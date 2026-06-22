import { Router } from 'express';
import { body } from 'express-validator';
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getSummary,
} from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { STAGES, PRIORITIES } from '../models/Opportunity.js';

const router = Router();

const createValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('requirement').trim().notEmpty().withMessage('Requirement is required'),
  body('estimatedValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be non-negative'),
  body('stage')
    .optional()
    .isIn(STAGES)
    .withMessage(`Stage must be one of: ${STAGES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  body('contactEmail')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Valid contact email is required'),
  body('activityNote').optional().trim(),
];

const updateValidation = [
  body('customerName').optional().trim().notEmpty().withMessage('Customer name cannot be empty'),
  body('requirement').optional().trim().notEmpty().withMessage('Requirement cannot be empty'),
  body('estimatedValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be non-negative'),
  body('stage')
    .optional()
    .isIn(STAGES)
    .withMessage(`Stage must be one of: ${STAGES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  body('contactEmail')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Valid contact email is required'),
  body('activityNote').optional().trim(),
];

router.use(protect);

router.get('/summary', getSummary);
router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', createValidation, validate, createOpportunity);
router.put('/:id', updateValidation, validate, updateOpportunity);
router.delete('/:id', deleteOpportunity);

export default router;
