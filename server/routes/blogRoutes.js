import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getTrendingGenres,
} from '../controllers/blogController.js';

const router = express.Router();

// Most specific routes FIRST
router.get('/trending-genres', getTrendingGenres);
router.get('/trending', getTrendingBlogs);

// Then general ones
router.get('/', getAllBlogs);
router.post('/', createBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
