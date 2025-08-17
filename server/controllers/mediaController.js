import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------
// Multer Config
// -------------------
const storage = multer.diskStorage({});
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

// -------------------
// Upload Cover Image (with replacement)
// -------------------
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Check if there's an existing public_id to replace
    const oldPublicId = req.body.public_id; // Assuming you send the old public_id in the request

    let result;
    if (oldPublicId) {
      // First upload the new image
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_covers",
        resource_type: "image",
      });
      
      // Then delete the old image
      await cloudinary.uploader.destroy(oldPublicId);
    } else {
      // No existing image, just upload
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_covers",
        resource_type: "image",
      });
    }

    res.status(201).json({
      success: true,
      message: "Cover image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload cover image",
      error: error.message,
    });
  }
};

// -------------------
// Get Cloudinary Image (already exists)
// -------------------
export const getCloudinaryImage = async (req, res) => {
  const { folder, filename } = req.params;

  try {
    const result = await cloudinary.search
      .expression(`resource_type:image AND folder:${folder} AND filename:${filename}*`)
      .sort_by("created_at", "desc")
      .max_results(1)
      .execute();

    if (!result?.resources?.length) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const image = result.resources[0];

    res.status(200).json({
      success: true,
      imageUrl: image.secure_url,
      imageInfo: {
        public_id: image.public_id,
        format: image.format,
        width: image.width,
        height: image.height,
      },
    });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch image from Cloudinary",
      error: error.message,
    });
  }
};