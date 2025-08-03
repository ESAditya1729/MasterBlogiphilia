const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message should be at least 10 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'replied'],
    default: 'pending'
  }
});

// Add text index for search functionality
feedbackSchema.index({ name: 'text', email: 'text', message: 'text' });

module.exports = mongoose.model('Feedback', feedbackSchema);