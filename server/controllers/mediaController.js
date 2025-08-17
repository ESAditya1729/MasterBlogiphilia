import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------
// Multer (Memory Storage)
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
// Upload Cover Image (overwrite by blogId)
// -------------------
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { blogId } = req.body; // send from frontend
    if (!blogId) {
      return res.status(400).json({ success: false, message: "blogId required" });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "blog_covers",
        public_id: blogId,  // overwrite if same blog
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ success: false, message: "Upload failed", error });
        }

        return res.status(201).json({
          success: true,
          message: "Cover image uploaded successfully",
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Pipe buffer to Cloudinary stream
    require("streamifier").createReadStream(req.file.buffer).pipe(result);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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