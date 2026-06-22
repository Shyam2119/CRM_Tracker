import Opportunity from '../models/Opportunity.js';
import { logger } from '../utils/logger.js';

const stripIdentityFields = (data) => {
  const { owner, created_by, user_id, activityNote, ...rest } = data;
  return rest;
};

const buildFilter = ({ stage, priority, search }) => {
  const filter = {};
  if (stage) filter.stage = stage;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { requirement: { $regex: search, $options: 'i' } },
      { contactName: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

const buildSort = (sort) => {
  const sorts = {
    value: { estimatedValue: -1 },
    priority: { priority: -1, createdAt: -1 },
    followUp: { nextFollowUpDate: 1, createdAt: -1 },
    newest: { createdAt: -1 },
  };
  return sorts[sort] || sorts.newest;
};

export const getAllOpportunities = async (query) => {
  const { stage, priority, search, sort, page = 1, limit = 12 } = query;
  const filter = buildFilter({ stage, priority, search });
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [opportunities, total] = await Promise.all([
    Opportunity.find(filter)
      .populate('owner', 'name email')
      .populate('activityLog.updatedBy', 'name')
      .sort(buildSort(sort))
      .skip(skip)
      .limit(limitNum),
    Opportunity.countDocuments(filter),
  ]);

  return {
    data: opportunities,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export const getOpportunityById = async (id) => {
  const opportunity = await Opportunity.findById(id)
    .populate('owner', 'name email')
    .populate('activityLog.updatedBy', 'name');

  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }
  return opportunity;
};

export const createOpportunity = async (data, userId) => {
  const cleanData = stripIdentityFields(data);
  const opportunity = await Opportunity.create({
    ...cleanData,
    owner: userId,
    activityLog: [
      {
        note: 'Opportunity created',
        action: 'created',
        updatedBy: userId,
      },
    ],
  });

  logger.info('Opportunity created', { id: opportunity._id, userId });
  return getOpportunityById(opportunity._id);
};

export const updateOpportunity = async (id, data, userId) => {
  const opportunity = await Opportunity.findById(id);
  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  if (opportunity.owner.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this opportunity');
    error.statusCode = 403;
    throw error;
  }

  const { activityNote, ...updateFields } = stripIdentityFields(data);
  const activityEntries = [];

  if (updateFields.stage && updateFields.stage !== opportunity.stage) {
    activityEntries.push({
      note: `Stage changed from ${opportunity.stage} to ${updateFields.stage}`,
      action: 'stage_changed',
      updatedBy: userId,
    });
  }

  if (activityNote?.trim()) {
    activityEntries.push({
      note: activityNote.trim(),
      action: 'note_added',
      updatedBy: userId,
    });
  }

  if (activityEntries.length === 0 && Object.keys(updateFields).length > 0) {
    activityEntries.push({
      note: 'Opportunity details updated',
      action: 'updated',
      updatedBy: userId,
    });
  }

  const updated = await Opportunity.findByIdAndUpdate(
    id,
    {
      ...updateFields,
      ...(activityEntries.length > 0 && { $push: { activityLog: { $each: activityEntries } } }),
    },
    { new: true, runValidators: true }
  )
    .populate('owner', 'name email')
    .populate('activityLog.updatedBy', 'name');

  logger.info('Opportunity updated', { id, userId });
  return updated;
};

export const deleteOpportunity = async (id, userId) => {
  const opportunity = await Opportunity.findById(id);
  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  if (opportunity.owner.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this opportunity');
    error.statusCode = 403;
    throw error;
  }

  await opportunity.deleteOne();
  logger.info('Opportunity deleted', { id, userId });
  return { message: 'Opportunity deleted successfully' };
};

export const getSummary = async (userId) => {
  const opportunities = await Opportunity.find();

  const totalPipeline = opportunities
    .filter((o) => !['Won', 'Lost'].includes(o.stage))
    .reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  const wonValue = opportunities
    .filter((o) => o.stage === 'Won')
    .reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  const highPriority = opportunities.filter((o) => o.priority === 'High').length;

  return {
    total: opportunities.length,
    totalPipeline,
    wonValue,
    highPriority,
    myOpportunities: opportunities.filter((o) => o.owner.toString() === userId.toString()).length,
    byStage: {
      New: opportunities.filter((o) => o.stage === 'New').length,
      Contacted: opportunities.filter((o) => o.stage === 'Contacted').length,
      Qualified: opportunities.filter((o) => o.stage === 'Qualified').length,
      'Proposal Sent': opportunities.filter((o) => o.stage === 'Proposal Sent').length,
      Won: opportunities.filter((o) => o.stage === 'Won').length,
      Lost: opportunities.filter((o) => o.stage === 'Lost').length,
    },
  };
};
