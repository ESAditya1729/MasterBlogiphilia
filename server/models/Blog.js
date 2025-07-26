import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog must have an author']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  views: {
  type: Number,
  default: 0
},
likes: {
  type: Number,
  default: 0
}
});

// Update updatedAt on save
blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
