import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a blog title"],
    trim: true,
    maxlength: [150, "Title cannot exceed 150 characters"],
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [160, "Excerpt cannot exceed 160 characters"],
  },
  genre: {
    type: String,
    required: [true, "Please provide a genre"],
    trim: true,
    index: true, // Added for better query performance
  },
  tags: {
    type: [String],
    default: [],
    index: true, // Added for better query performance
  },
  content: {
    type: String,
    required: [true, "Blog content is required"],
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    index: true, // Important for filtering
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  coverImage: {
    type: String, // URL to image
    trim: true,
  },
  seoKeywords: {
    type: [String],
    default: [],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Blog must have an author"],
    index: true,
  },
  wordCount: {
    type: Number,
    min: 0,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  publishedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt
});

// Update timestamps and status before save
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  
  // Automatically set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate word count if content changes
  if (this.isModified('content')) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  next();
});

// Indexes for better query performance
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1, publishedAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;