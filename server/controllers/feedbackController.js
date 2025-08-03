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

    // Find existing feedback or create new
    const feedback = await Feedback.findOneAndUpdate(
      { email },
      {
        $set: { name, updatedAt: Date.now() },
        $push: { 
          messages: { 
            content: message 
          } 
        },
        $setOnInsert: { status: 'pending' }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    // Send confirmation email (implement as needed)
    // await sendConfirmationEmail(email, name);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We will get back to you soon.',
      data: feedback
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

// Get all feedback with pagination
exports.getFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
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

// Get single user's message history
exports.getMessageHistory = async (req, res) => {
  try {
    const { email } = req.params;
    const feedback = await Feedback.findOne({ email });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this email'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message history',
      error: error.message
    });
  }
};