import Blog from '../models/Blog.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Helper function for error responses
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, error: message });
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, genre, tags, content, status, isFeatured, coverImage, seoKeywords } = req.body;

  // Validate required fields
  if (!title || !genre || !content) {
    return errorResponse(res, 400, 'Missing required fields: title, genre, content');
  }

  // Validate status
  if (status && !['draft', 'published', 'archived'].includes(status)) {
    return errorResponse(res, 400, 'Invalid status value');
  }

  const blog = new Blog({
    title,
    excerpt,
    genre,
    tags: tags || [],
    content,
    status: status || 'draft',
    isFeatured: isFeatured || false,
    coverImage,
    seoKeywords: seoKeywords || [],
    author: req.user._id,
    ...(status === 'published' && { publishedAt: new Date() })
  });

  const savedBlog = await blog.save();
  res.status(201).json({ success: true, data: savedBlog });
});

// @desc    Get all blogs with filtering options
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { status, genre, author, featured, sort, limit } = req.query;
  
  const query = {};
  
  if (status) query.status = status;
  if (genre) query.genre = genre;
  if (author) query.author = author;
  if (featured) query.isFeatured = featured === 'true';
  
  const sortOptions = {};
  if (sort) {
    if (sort === 'newest') sortOptions.publishedAt = -1;
    if (sort === 'views') sortOptions.views = -1;
    if (sort === 'likes') sortOptions.likes = -1;
  } else {
    sortOptions.publishedAt = -1; // Default sort
  }
  
  const blogs = await Blog.find(query)
    .sort(sortOptions)
    .limit(parseInt(limit) || 0)
    .populate('author', 'username email profilePicture');
    
  res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } }, // Increment views on fetch
    { new: true }
  ).populate('author', 'username email bio profilePicture');
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  res.status(200).json({ success: true, data: blog });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (author only)
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if user is author or admin
  if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return errorResponse(res, 403, 'Not authorized to update this blog');
  }
  
  const { title, excerpt, genre, tags, content, status, isFeatured, coverImage, seoKeywords } = req.body;
  
  // Update fields if provided
  if (title) blog.title = title;
  if (excerpt) blog.excerpt = excerpt;
  if (genre) blog.genre = genre;
  if (tags) blog.tags = tags;
  if (content) blog.content = content;
  if (isFeatured !== undefined) blog.isFeatured = isFeatured;
  if (coverImage) blog.coverImage = coverImage;
  if (seoKeywords) blog.seoKeywords = seoKeywords;
  
  // Handle status changes
  if (status && status !== blog.status) {
    blog.status = status;
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
  }
  
  const updatedBlog = await blog.save();
  res.status(200).json({ success: true, data: updatedBlog });
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (author or admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if user is author or admin
  if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return errorResponse(res, 403, 'Not authorized to delete this blog');
  }
  
  await blog.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get trending blogs (top published by views)
// @route   GET /api/blogs/trending
// @access  Public
export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const blogs = await Blog.find({ status: 'published' })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('author', 'username profilePicture');
    
  res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Get trending genres
// @route   GET /api/blogs/trending-genres
// @access  Public
export const getTrendingGenres = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const topGenres = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  
  res.status(200).json({ success: true, data: topGenres });
});

// @desc    Get blogs by a specific author
// @route   GET /api/blogs/author/:userId
// @access  Public
export const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { author: req.params.userId };
  
  if (status) query.status = status;
  
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1 })
    .populate('author', 'username profilePicture');
    
  res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Get blogs by status for current user
// @route   GET /api/blogs/status/:status
// @access  Private
export const getBlogsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  if (!['draft', 'published', 'archived'].includes(status)) {
    return errorResponse(res, 400, 'Invalid status value');
  }
  
  const blogs = await Blog.find({
    author: req.user._id,
    status
  }).sort('-updatedAt');
  
  res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Toggle like on a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if user already liked the blog
  const hasLiked = blog.likedBy.includes(req.user._id);
  
  if (hasLiked) {
    // Unlike
    blog.likes -= 1;
    blog.likedBy.pull(req.user._id);
  } else {
    // Like
    blog.likes += 1;
    blog.likedBy.push(req.user._id);
  }
  
  await blog.save();
  res.status(200).json({ 
    success: true, 
    data: { likes: blog.likes, isLiked: !hasLiked } 
  });
});

// @desc    Get related blogs by tags or genre
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id }, // Exclude current blog
    status: 'published',
    $or: [
      { genre: blog.genre },
      { tags: { $in: blog.tags } }
    ]
  })
  .limit(4)
  .select('title excerpt coverImage views likes')
  .populate('author', 'username profilePicture');
  
  res.status(200).json({ success: true, data: relatedBlogs });
});