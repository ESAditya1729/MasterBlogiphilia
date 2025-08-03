const Feedback = require('../models/feedback');
const { validationResult } = require('express-validator');

exports.submitFeedback = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { name, email, message } = req.body;

    // Create new feedback
    const newFeedback = new Feedback({
      name,
      email,
      message
    });

    // Save to database
    await newFeedback.save();

    // Send confirmation email (you'll need to implement this)
    // await sendConfirmationEmail(email, name);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We will get back to you soon.',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};