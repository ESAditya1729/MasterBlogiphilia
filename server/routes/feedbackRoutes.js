import express from 'express';
import { body } from 'express-validator';
import {
  submitFeedback,
  getFeedback,
  getMessageHistory
} from '../controllers/feedbackController.js';

const router = express.Router();

// Validation rules
const feedbackValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
];

// Submit feedback
router.post('/', feedbackValidationRules, submitFeedback);

// Get all feedback (with pagination)
router.get('/', getFeedback);

// Get message history for a specific email
router.get('/history/:email', getMessageHistory);

export default router;