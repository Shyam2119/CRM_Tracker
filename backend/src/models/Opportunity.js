import mongoose from 'mongoose';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const activityLogSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'note_added', 'stage_changed', 'follow_up'],
      default: 'note_added',
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const opportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer/company name is required'],
      trim: true,
    },
    contactName: { type: String, trim: true },
    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v),
        message: 'Please provide a valid contact email',
      },
    },
    contactPhone: { type: String, trim: true },
    requirement: {
      type: String,
      required: [true, 'Requirement summary is required'],
      trim: true,
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated value must be non-negative'],
      default: 0,
    },
    stage: {
      type: String,
      enum: STAGES,
      default: 'New',
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'Medium',
    },
    nextFollowUpDate: { type: Date },
    notes: { type: String, trim: true },
    activityLog: [activityLogSchema],
  },
  { timestamps: true }
);

export { STAGES, PRIORITIES };
const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
