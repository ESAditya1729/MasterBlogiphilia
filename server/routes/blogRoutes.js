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
  getUserDrafts,
  saveBlog,
  getBlogsByStatus,
  incrementViews
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/trending-genres', asyncHandler(getTrendingGenres));
router.get('/trending', asyncHandler(getTrendingBlogs));
router.get('/author/:userId', asyncHandler(getBlogsByAuthor));
router.get('/:id', asyncHandler(getBlogById));
router.put('/:id/views', asyncHandler(incrementViews));

// Protected routes (require authentication)
router.use(protect);

// Blog status management
router.get('/status/:status', asyncHandler(getBlogsByStatus));
router.post('/save', asyncHandler(saveBlog));

// Drafts specific routes
router.route('/drafts')
  .get(asyncHandler(getUserDrafts));

// General CRUD routes
router.route('/')
  .get(asyncHandler(getAllBlogs))
  .post(asyncHandler(createBlog));

router.route('/:id')
  .put(asyncHandler(updateBlog))
  .delete(asyncHandler(deleteBlog));

export default router;