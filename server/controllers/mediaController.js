// controllers/mediaController.js
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured (if not already in a central file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get a Cloudinary image by folder and filename
// @route   GET /api/media/image/:folder/:filename
// @access  Public

export const getCloudinaryImage = async (req, res) => {
  const { folder, filename } = req.params;

  try {
    // Option 1: Search by exact public_id (must match exactly including extension)
    // const result = await cloudinary.search
    //   .expression(`public_id:${folder}/${filename}`)
    //   .execute();

    // Option 2: More flexible search (matches files containing the filename)
    const result = await cloudinary.search
      .expression(`resource_type:image AND folder:${folder} AND filename:${filename}*`)
      .sort_by('created_at', 'desc')
      .max_results(1)
      .execute();

    if (!result?.resources?.length) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const image = result.resources[0];
    
    res.status(200).json({
      success: true,
      imageUrl: image.secure_url,
      // You might want to return additional info
      imageInfo: {
        public_id: image.public_id,
        format: image.format,
        width: image.width,
        height: image.height
      }
    });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch image from Cloudinary",
      error: error.message 
    });
  }
};


