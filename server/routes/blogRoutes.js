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
  getBlogsByAuthor,
  saveBlog,
  getBlogsByStatus,
  incrementViews
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/trending-genres', asyncHandler(getTrendingGenres));
router.get('/trending', asyncHandler(getTrendingBlogs));
router.get('/author/:userId', asyncHandler(getBlogsByAuthor));
router.get('/:id', asyncHandler(getBlogById));
router.put('/:id/views', asyncHandler(incrementViews));

// Protected routes
router.use(protect);

// Blog operations
router.get('/status/:status', asyncHandler(getBlogsByStatus));
router.post('/save', asyncHandler(saveBlog));

// CRUD operations
router.route('/')
  .get(asyncHandler(getAllBlogs))
  .post(asyncHandler(createBlog));

router.route('/:id')
  .put(asyncHandler(updateBlog))
  .delete(asyncHandler(deleteBlog));

export default router;