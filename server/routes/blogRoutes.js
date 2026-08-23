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
  toggleBookmark,
  getBookmarkedBlogs,
  getRelatedBlogs,
  getBlogStats,
  getPostCounts
} from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getAllBlogs));
router.get('/trending-genres', asyncHandler(getTrendingGenres));
router.get('/trending', asyncHandler(getTrendingBlogs));
router.get('/author/:userId', asyncHandler(getBlogsByAuthor));
// Must be registered before GET /:id or it gets shadowed (matched as id="stats")
router.get('/stats', protect, asyncHandler(getBlogStats));
router.get('/bookmarks', protect, asyncHandler(getBookmarkedBlogs));
router.get('/:id', optionalAuth, asyncHandler(getBlogById));
router.get('/:id/related', asyncHandler(getRelatedBlogs));
router.get('/post-counts/:userId', asyncHandler(getPostCounts));

// Protected routes
router.use(protect);

// Blog operations
router.get('/status/:status', asyncHandler(getBlogsByStatus));
router.put('/:id/like', asyncHandler(toggleLike));
router.put('/:id/bookmark', asyncHandler(toggleBookmark));

// CRUD operations
router.route('/')
  .post(asyncHandler(upsertBlog));

router.route('/:id')
  .put(asyncHandler(updateBlog))
  .delete(asyncHandler(deleteBlog));

export default router;