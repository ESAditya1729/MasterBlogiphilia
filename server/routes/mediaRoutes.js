import express from "express";
import { upload, uploadCoverImage, getCloudinaryImage } from "../controllers/mediaController.js";

const router = express.Router();

/**
 * @route   POST /api/media/upload
 * @desc    Upload a cover image for a blog post
 * @access  Private
 * @param   {file} image - The image file to upload (max 5MB)
 * @param   {string} blogId - The ID of the blog to associate with this image
 * @returns {Object} Contains image URL and Cloudinary public_id
 */
router.post(
  "/upload", 
  upload.single("image"), // Middleware to handle single file upload
  (err, req, res, next) => { // Error handling middleware for Multer
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message || "File upload failed",
        code: err.code 
      });
    }
    next();
  },
  uploadCoverImage // Controller
);

/**
 * @route   GET /api/media/image/:folder/:filename
 * @desc    Get an image from Cloudinary
 * @access  Public
 * @param   {string} folder - The Cloudinary folder name
 * @param   {string} filename - The filename (without extension)
 * @returns {Object} Contains image URL and metadata
 */
router.get("/image/:folder/:filename", getCloudinaryImage);

export default router;