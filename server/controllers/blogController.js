import Blog from '../models/Blog.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler'; // Optional: for cleaner error handling

// @desc    Create new blog (draft or published)
// @route   POST /api/blogs
// @access  Public (will protect later)
export const createBlog = asyncHandler(async (req, res) => {
  const { title, genre, tags, content, isPublished, authorId } = req.body;

  if (!title || !genre || !content || !authorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const author = await User.findById(authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }

  const blog = new Blog({
    title,
    genre,
    tags,
    content,
    isPublished: isPublished || false,
    author: author._id
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

// @desc    Get all blogs (for testing)
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('author', 'username email profilePicture');
  res.status(200).json(blogs);
});

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username email bio');
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.status(200).json(blog);
});

// @desc    Update blog (e.g., publish later)
// @route   PUT /api/blogs/:id
// @access  Public (protected later)
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const { title, genre, tags, content, isPublished } = req.body;

  blog.title = title || blog.title;
  blog.genre = genre || blog.genre;
  blog.tags = tags || blog.tags;
  blog.content = content || blog.content;
  blog.isPublished = typeof isPublished === 'boolean' ? isPublished : blog.isPublished;

  const updatedBlog = await blog.save();
  res.status(200).json(updatedBlog);
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Public (protected later)
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  await blog.remove();
  res.status(200).json({ message: 'Blog deleted successfully' });
});

// @desc    Get trending blogs (e.g., top 5 published by views)
// @route   GET /api/blogs/trending
// @access  Public
export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .populate('author', 'username');

  res.status(200).json(blogs);
});

// @desc    Get trending genres based on number of published blogs
// @route   GET /api/blogs/trending-genres
// @access  Public
export const getTrendingGenres = asyncHandler(async (req, res) => {
  const topGenres = await Blog.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 }, // You can adjust this to return more/less genres
  ]);

  res.status(200).json(topGenres);
});

// @desc    Get blogs by a specific author
// @route   GET /api/blogs/author/:userId
// @access  Public
export const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ 
    author: req.params.userId,
    isPublished: true 
  }).sort('-createdAt');
  res.status(200).json(blogs);
});

// @desc    Get all drafts for current user
// @route   GET /api/blogs/drafts
// @access  Private
export const getUserDrafts = asyncHandler(async (req, res) => {
  const drafts = await Blog.find({
    author: req.user._id,
    isPublished: false
  }).sort('-updatedAt').populate('author', 'username');
  
  res.status(200).json(drafts);
});

/////////////////////////////////////NEW Addition for Blog Editor Page and other Usages/////////////////////////////////////////////////////////>>
// @desc    Save blog as draft or publish
// @route   POST /api/blogs/save
// @access  Private
export const saveBlog = asyncHandler(async (req, res) => {
  const { 
    title, 
    excerpt, 
    genre, 
    tags, 
    content, 
    isFeatured,
    isPublished,
    wordCount,
    coverImage,
    seoKeywords,
    blogId 
  } = req.body;

  if (!title || !genre || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let blog;
  if (blogId) {
    // Update existing blog
    blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.title = title;
    blog.excerpt = excerpt;
    blog.genre = genre;
    blog.tags = tags;
    blog.content = content;
    blog.isFeatured = isFeatured;
    blog.wordCount = wordCount;
    blog.coverImage = coverImage;
    blog.seoKeywords = seoKeywords;
    
    if (isPublished && !blog.isPublished) {
      blog.isPublished = true;
      blog.publishedAt = new Date();
      blog.status = 'published';
    }
  } else {
    // Create new blog
    blog = new Blog({
      title,
      excerpt,
      genre,
      tags,
      content,
      isFeatured,
      isPublished,
      wordCount,
      coverImage,
      seoKeywords,
      author: req.user._id,
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? new Date() : null
    });
  }

  const savedBlog = await blog.save();
  res.status(blogId ? 200 : 201).json(savedBlog);
});

// @desc    Get blog by status (draft/published) for current user
// @route   GET /api/blogs/status/:status
// @access  Private
export const getBlogsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const blogs = await Blog.find({
    author: req.user._id,
    status
  }).sort('-updatedAt');
  res.status(200).json(blogs);
});

// @desc    Increment blog views
// @route   PUT /api/blogs/:id/views
// @access  Public
export const incrementViews = asyncHandler(async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, { 
    $inc: { views: 1 } 
  });
  res.status(200).json({ message: 'View counted' });
});