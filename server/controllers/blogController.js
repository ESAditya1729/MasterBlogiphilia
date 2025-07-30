import Blog from '../models/Blog.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import sanitizeHtml from 'sanitize-html';
import mongoose from 'mongoose';

// Helper function for error responses
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, error: message });
};

// Sanitization options for blog content
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'style', 'id'],
    img: ['src', 'alt', 'width', 'height'],
    a: ['href', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'data']
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
  const validStatuses = ['draft', 'published', 'archived'];
  if (status && !validStatuses.includes(status)) {
    return errorResponse(res, 400, `Invalid status value. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Sanitize content
  const sanitizedContent = sanitizeHtml(content, sanitizeOptions);

  const blog = new Blog({
    title: sanitizeHtml(title),
    excerpt: excerpt ? sanitizeHtml(excerpt) : '',
    genre: sanitizeHtml(genre),
    tags: tags ? tags.map(tag => sanitizeHtml(tag)) : [],
    content: sanitizedContent,
    status: status || 'draft',
    isFeatured: isFeatured || false,
    coverImage,
    seoKeywords: seoKeywords ? seoKeywords.map(keyword => sanitizeHtml(keyword)) : [],
    author: req.user._id,
    ...(status === 'published' && { publishedAt: new Date() })
  });

  const savedBlog = await blog.save();
  
  // Update user's blog count
  await User.findByIdAndUpdate(req.user._id, { $inc: { blogCount: 1 } });

  res.status(201).json({ 
    success: true, 
    data: savedBlog,
    message: 'Blog created successfully'
  });
});

// @desc    Get all blogs with filtering options
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { 
    status = 'published', 
    genre, 
    author, 
    featured, 
    sort = 'newest', 
    limit = 10, 
    page = 1,
    search,
    tag
  } = req.query;
  
  // Build query
  const query = { 
    ...(status && { status }),
    ...(genre && { genre: new RegExp(genre, 'i') }),
    ...(author && mongoose.Types.ObjectId.isValid(author) && { author }),
    ...(featured && { isFeatured: featured === 'true' }),
    ...(tag && { tags: { $in: [new RegExp(tag, 'i')] } }),
    ...(search && { 
      $or: [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ]
    })
  };
  
  // Sort options
  const sortOptions = {
    newest: { publishedAt: -1 },
    oldest: { publishedAt: 1 },
    views: { views: -1 },
    likes: { likes: -1 },
    featured: { isFeatured: -1, publishedAt: -1 }
  };
  
  const sortBy = sortOptions[sort] || sortOptions.newest;
  
  // Pagination
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;
  
  // Get total count for pagination
  const total = await Blog.countDocuments(query);
  
  const blogs = await Blog.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(pageSize)
    .populate('author', 'username email profilePicture bio')
    .lean();
    
  res.status(200).json({ 
    success: true, 
    count: blogs.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    data: blogs 
  });
});

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 400, 'Invalid blog ID');
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } }, // Increment views on fetch
    { new: true }
  ).populate('author', 'username email bio profilePicture socialLinks');
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if user is authenticated and if they've liked the blog
  let isLiked = false;
  if (req.user) {
    isLiked = blog.likedBy.includes(req.user._id);
  }
  
  res.status(200).json({ 
    success: true, 
    data: {
      ...blog.toObject(),
      isLiked
    }
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (author only)
export const updateBlog = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 400, 'Invalid blog ID');
  }

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
  if (title) blog.title = sanitizeHtml(title);
  if (excerpt) blog.excerpt = sanitizeHtml(excerpt);
  if (genre) blog.genre = sanitizeHtml(genre);
  if (tags) blog.tags = tags.map(tag => sanitizeHtml(tag));
  if (content) blog.content = sanitizeHtml(content, sanitizeOptions);
  if (isFeatured !== undefined) blog.isFeatured = isFeatured;
  if (coverImage) blog.coverImage = coverImage;
  if (seoKeywords) blog.seoKeywords = seoKeywords.map(keyword => sanitizeHtml(keyword));
  
  // Handle status changes
  if (status && status !== blog.status) {
    blog.status = status;
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    if (status === 'archived') {
      blog.archivedAt = new Date();
    }
  }
  
  blog.updatedAt = new Date();
  const updatedBlog = await blog.save();
  
  res.status(200).json({ 
    success: true, 
    data: updatedBlog,
    message: 'Blog updated successfully'
  });
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (author or admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 400, 'Invalid blog ID');
  }

  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if user is author or admin
  if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return errorResponse(res, 403, 'Not authorized to delete this blog');
  }
  
  await blog.deleteOne();
  
  // Update user's blog count
  await User.findByIdAndUpdate(req.user._id, { $inc: { blogCount: -1 } });
  
  res.status(200).json({ 
    success: true, 
    data: {},
    message: 'Blog deleted successfully'
  });
});

// @desc    Get trending blogs (top published by views)
// @route   GET /api/blogs/trending
// @access  Public
export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 20); // Max 20 blogs
  
  const blogs = await Blog.find({ status: 'published' })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('author', 'username profilePicture')
    .select('title excerpt coverImage views likes createdAt');
    
  res.status(200).json({ 
    success: true, 
    count: blogs.length, 
    data: blogs 
  });
});

// @desc    Get trending genres
// @route   GET /api/blogs/trending-genres
// @access  Public
export const getTrendingGenres = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 5, 10); // Max 10 genres
  
  const topGenres = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { 
      _id: "$genre", 
      count: { $sum: 1 },
      totalViews: { $sum: "$views" },
      totalLikes: { $sum: "$likes" }
    }},
    { $sort: { totalViews: -1 } },
    { $limit: limit }
  ]);
  
  res.status(200).json({ 
    success: true, 
    data: topGenres 
  });
});

// @desc    Get blogs by a specific author
// @route   GET /api/blogs/author/:userId
// @access  Public
export const getBlogsByAuthor = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return errorResponse(res, 400, 'Invalid user ID');
  }

  const { status = 'published', limit = 10, page = 1 } = req.query;
  const query = { author: req.params.userId };
  
  if (status) query.status = status;
  
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;
  
  const total = await Blog.countDocuments(query);
  
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .populate('author', 'username profilePicture bio');
    
  res.status(200).json({ 
    success: true, 
    count: blogs.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    data: blogs 
  });
});

// @desc    Get blogs by status for current user
// @route   GET /api/blogs/status/:status
// @access  Private
export const getBlogsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { limit = 10, page = 1 } = req.query;
  
  const validStatuses = ['draft', 'published', 'archived'];
  if (!validStatuses.includes(status)) {
    return errorResponse(res, 400, `Invalid status value. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;
  
  const total = await Blog.countDocuments({
    author: req.user._id,
    status
  });
  
  const blogs = await Blog.find({
    author: req.user._id,
    status
  })
  .sort('-updatedAt')
  .skip(skip)
  .limit(pageSize);
  
  res.status(200).json({ 
    success: true, 
    count: blogs.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    data: blogs 
  });
});

// @desc    Toggle like on a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 400, 'Invalid blog ID');
  }

  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  // Check if blog is published
  if (blog.status !== 'published') {
    return errorResponse(res, 400, 'Cannot like an unpublished blog');
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
    data: { 
      likes: blog.likes, 
      isLiked: !hasLiked 
    },
    message: hasLiked ? 'Blog unliked successfully' : 'Blog liked successfully'
  });
});

// @desc    Get related blogs by tags or genre
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return errorResponse(res, 400, 'Invalid blog ID');
  }

  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return errorResponse(res, 404, 'Blog not found');
  }
  
  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id }, 
    status: 'published',
    $or: [
      { genre: blog.genre },
      { tags: { $in: blog.tags } }
    ]
  })
  .limit(4)
  .select('title excerpt coverImage views likes createdAt slug')
  .populate('author', 'username profilePicture');
  
  res.status(200).json({ 
    success: true, 
    data: relatedBlogs 
  });
});

// @desc    Get blog stats for dashboard
// @route   GET /api/blogs/stats
// @access  Private (admin or author)
export const getBlogStats = asyncHandler(async (req, res) => {
  let matchQuery = {};
  
  // For non-admin users, only show their own stats
  if (!req.user.isAdmin) {
    matchQuery.author = req.user._id;
  }
  
  const stats = await Blog.aggregate([
    { $match: matchQuery },
    { 
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        totalViews: 1,
        totalLikes: 1,
        _id: 0
      }
    }
  ]);
  
  res.status(200).json({ 
    success: true, 
    data: stats 
  });
});