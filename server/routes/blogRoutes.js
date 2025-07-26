import express from 'express';
const router = express.Router();

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingGenres, 
  getTrendingBlogs  
} from '../controllers/blogController.js';

// Existing routes
router.route('/')
  .post(createBlog)
  .get(getAllBlogs);

router.route('/:id')
  .get(getBlogById)
  .put(updateBlog)
  .delete(deleteBlog);

// New trending routes
router.route('/trending-genres')
  .get(getTrendingGenres);

router.route('/trending')
  .get(getTrendingBlogs);

export default router;
