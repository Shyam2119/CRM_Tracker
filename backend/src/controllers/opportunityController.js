import * as opportunityService from '../services/opportunityService.js';

export const getOpportunities = async (req, res, next) => {
  try {
    const result = await opportunityService.getAllOpportunities(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunityById(req.params.id);
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.createOpportunity(req.body, req.user._id);
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.updateOpportunity(
      req.params.id,
      req.body,
      req.user._id
    );
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const deleteOpportunity = async (req, res, next) => {
  try {
    const result = await opportunityService.deleteOpportunity(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const summary = await opportunityService.getSummary(req.user._id);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
