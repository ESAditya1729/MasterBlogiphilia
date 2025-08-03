const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { body } = require('express-validator');

// Validation rules
const feedbackValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
];

// Submit feedback
router.post('/', feedbackValidationRules, feedbackController.submitFeedback);

// Get all feedback (for admin dashboard)
router.get('/', feedbackController.getFeedback);

module.exports = router;