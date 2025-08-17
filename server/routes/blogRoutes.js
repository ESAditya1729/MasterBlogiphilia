import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  upsertBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getTrendingGenres,
  getBlogsByAuthor,
  getBlogsByStatus,
  toggleLike,
  getRelatedBlogs,
  getBlogStats,
  getPostCounts
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getAllBlogs));
router.get('/trending-genres', asyncHandler(getTrendingGenres));
router.get('/trending', asyncHandler(getTrendingBlogs));
router.get('/author/:userId', asyncHandler(getBlogsByAuthor));
router.get('/:id', asyncHandler(getBlogById));
router.get('/:id/related', asyncHandler(getRelatedBlogs));
router.get('/post-counts/:id', asyncHandler(getPostCounts));

// Protected routes
router.use(protect);

// Blog operations
router.get('/status/:status', asyncHandler(getBlogsByStatus));
router.put('/:id/like', asyncHandler(toggleLike));

// Dashboard stats
router.get('/stats', asyncHandler(getBlogStats));

// CRUD operations
router.route('/')
  .post(asyncHandler(upsertBlog));

router.route('/:id')
  .put(asyncHandler(updateBlog))
  .delete(asyncHandler(deleteBlog));

export default router;