// controllers/mediaController.js
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured (if not already in a central file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get an image from Cloudinary by folder and filename
// @route   GET /api/media/image/:folder/:filename
// @access  Public
export const getCloudinaryImage = async (req, res, next) => {
  try {
    const { folder, filename } = req.params;

    if (!folder || !filename) {
      return res.status(400).json({ success: false, message: 'Missing folder or filename' });
    }

    // Construct the public ID (Cloudinary uses "folder/filename" format without extension)
    const publicId = `${folder}/${filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}`;

    // Generate a signed or unsigned URL
    const imageUrl = cloudinary.url(publicId, {
      secure: true,
      format: 'png', // Force format if needed
    });

    // Optionally verify if image exists (Cloudinary does not expose this directly)
    // You can skip this step unless you want to validate presence before returning
    res.status(200).json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error('Cloudinary image fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch image' });
  }
};
