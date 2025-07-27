import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getTrendingGenres,
  getBlogsByAuthor
} from '../controllers/blogController.js';

const router = express.Router();

// Most specific routes FIRST
router.get('/trending-genres', asyncHandler(getTrendingGenres));
router.get('/trending', asyncHandler(getTrendingBlogs));
router.get('/author/:userId', asyncHandler(getBlogsByAuthor));

// Then general ones
router.get('/', asyncHandler(getAllBlogs));
router.post('/', asyncHandler(createBlog));
router.get('/:id', asyncHandler(getBlogById));
router.put('/:id', asyncHandler(updateBlog));
router.delete('/:id', asyncHandler(deleteBlog));

export default router;