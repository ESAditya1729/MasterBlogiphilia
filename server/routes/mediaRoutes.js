import express from "express";
import { upload, uploadCoverImage, getCloudinaryImage } from "../controllers/mediaController.js";

const router = express.Router();

// Upload cover image
router.post("/upload", upload.single("image"), uploadCoverImage);

// Get image from Cloudinary
router.get("/image/:folder/:filename", getCloudinaryImage);

export default router;
