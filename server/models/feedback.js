import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    minlength: [10, 'Message should be at least 10 characters long']
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
    unique: true
  },
  messages: [messageSchema],
  updatedAt: {
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
feedbackSchema.index({ name: 'text', email: 'text', 'messages.content': 'text' });

export default mongoose.model('Feedback', feedbackSchema);