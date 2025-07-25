import express from 'express';
const router = express.Router();

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

// In future: import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(createBlog)      // POST /api/blogs
  .get(getAllBlogs);     // GET /api/blogs

router.route('/:id')
  .get(getBlogById)      // GET /api/blogs/:id
  .put(updateBlog)       // PUT /api/blogs/:id
  .delete(deleteBlog);   // DELETE /api/blogs/:id

export default router;
