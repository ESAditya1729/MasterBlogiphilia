import express from 'express';
const router = express.Router();

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingGenres // <- your new controller
} from '../controllers/blogController.js';

// FIRST: Register specific routes
router.route('/trending-genres')
  .get(getTrendingGenres); // GET /api/blogs/trending-genres

// THEN: Regular blog routes
router.route('/')
  .post(createBlog)
  .get(getAllBlogs);

router.route('/:id')
  .get(getBlogById)
  .put(updateBlog)
  .delete(deleteBlog);

export default router;
