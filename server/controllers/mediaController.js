import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import ErrorResponse from "../utils/errorResponse.js";
import Blog from "../models/Blog.js";

// -------------------
// Cloudinary Config with validation
// -------------------
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary credentials are missing in environment variables"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------
// Multer Configuration with enhanced options
// -------------------
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Limit to single file
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          "Only JPEG, PNG, WEBP, or GIF images are allowed",
          400
        ),
        false
      );
    }

    // Check file extension
    const fileExt = file.originalname.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(fileExt)) {
      return cb(new ErrorResponse("Invalid file extension", 400), false);
    }

    cb(null, true);
  },
});

// -------------------
// Enhanced Cloudinary Upload Utility
// -------------------
const uploadToCloudinary = async (buffer, options) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(
              new ErrorResponse(
                `Cloudinary upload failed: ${error.message}`,
                500
              )
            );
          } else {
            console.log("Cloudinary upload success:", result);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    throw error; // Re-throw for controller to handle
  }
};

// -------------------
// @desc    Upload/Replace blog cover image
// @route   POST /api/media/upload
// @access  Private
// -------------------
export const uploadCoverImage = async (req, res, next) => {
  try {
    console.log("Upload request received:", {
      file: req.file
        ? `${req.file.originalname} (${req.file.size} bytes)`
        : "none",
      body: req.body,
    });

    // Validate file exists
    if (!req.file) {
      console.error("No file uploaded");
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    // Validate blogId
    const { blogId } = req.body;
    if (!blogId) {
      console.error("Missing blogId");
      return next(new ErrorResponse("Blog ID is required", 400));
    }

    // Verify blog exists first
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      console.error(`Blog not found with ID: ${blogId}`);
      return next(new ErrorResponse("Blog not found", 404));
    }

    // Upload to Cloudinary with error handling
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
        folder: "blog-covers",
        public_id: blogId.toString(),
        overwrite: true,
        transformation: [
          { width: 1200, height: 628, crop: "fill" }, // Standard blog cover size
          { quality: "auto" }, // Automatic quality optimization
        ],
        // Removed format: 'auto' since it's not supported in upload API
        allowed_formats: ["jpg", "jpeg", "png", "webp"], // Explicitly allowed formats
        format: "jpg", // Default format if conversion needed
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", {
        error: uploadError,
        fileInfo: {
          originalname: req.file?.originalname,
          mimetype: req.file?.mimetype,
          size: req.file?.size,
        },
      });
      return next(
        new ErrorResponse(
          uploadError.message.includes("File size too large")
            ? "Image must be smaller than 10MB"
            : "Failed to process image. Please try another image",
          500
        )
      );
    }
    // Update blog with new image URL
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        coverImage: cloudinaryResult.secure_url,
        coverImagePublicId: cloudinaryResult.public_id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      console.error("Blog update failed after successful upload");
      return next(
        new ErrorResponse("Failed to update blog with new image", 500)
      );
    }

    console.log("Upload successful for blog:", blogId);
    return res.status(200).json({
      success: true,
      url: updatedBlog.coverImage,
      public_id: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
    });
  } catch (err) {
    console.error("Unexpected error in uploadCoverImage:", err);
    next(err);
  }
};

// -------------------
// Enhanced Get Cloudinary Image
// -------------------
export const getCloudinaryImage = async (req, res, next) => {
  const { folder, filename } = req.params;
  console.log(`Fetching image: ${folder}/${filename}`);

  try {
    // Validate inputs
    if (!folder || !filename) {
      return next(new ErrorResponse("Folder and filename are required", 400));
    }

    // Sanitize inputs to prevent Cloudinary search injection
    const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, "");
    const safeFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, "");

    const result = await cloudinary.search
      .expression(
        `resource_type:image AND folder:${safeFolder} AND filename:${safeFilename}*`
      )
      .sort_by("created_at", "desc")
      .max_results(1)
      .execute();

    if (!result?.resources?.length) {
      console.error("Image not found in Cloudinary");
      return next(new ErrorResponse("Image not found", 404));
    }

    const image = result.resources[0];
    console.log("Found image:", image.secure_url);

    res.status(200).json({
      success: true,
      imageUrl: image.secure_url,
      imageInfo: {
        public_id: image.public_id,
        format: image.format,
        width: image.width,
        height: image.height,
        bytes: image.bytes,
        created_at: image.created_at,
      },
    });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    next(new ErrorResponse("Failed to fetch image from Cloudinary", 500));
  }
};
