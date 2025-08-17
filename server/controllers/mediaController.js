import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import ErrorResponse from "../utils/errorResponse.js"; // ✅ Make sure you have this
import Blog from "../models/blogModel.js"; // ✅ Import your Blog model

// -------------------
// Cloudinary Config
// -------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------
// Multer (Memory Storage for buffer uploads)
// -------------------
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

// -------------------
// Utility: Upload to Cloudinary
// -------------------
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
};

// -------------------
// @desc    Upload/Replace blog cover image
// @route   POST /api/media/upload
// @access  Private
// -------------------
export const uploadCoverImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse("Please upload a file", 400));
    }

    const { blogId } = req.body;
    if (!blogId) {
      return next(new ErrorResponse("Blog ID is required", 400));
    }

    // ✅ Upload to Cloudinary with blogId as public_id (overwrites old image)
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
      folder: "blog-covers",
      public_id: blogId.toString(), // overwrite for same blog
      overwrite: true,
      transformation: [
        { width: 1200, height: 628, crop: "fill" }, // standard blog cover aspect ratio
        { quality: "auto" },
      ],
    });

    // ✅ Save URL to MongoDB
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { coverImage: cloudinaryResult.secure_url },
      { new: true }
    );

    if (!blog) {
      return next(new ErrorResponse("Blog not found", 404));
    }

    // ✅ Return URL to frontend
    return res.status(200).json({
      success: true,
      url: blog.coverImage,
      public_id: cloudinaryResult.public_id,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    next(err);
  }
};

// -------------------
// Get Cloudinary Image
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
