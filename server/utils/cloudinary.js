// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer to Cloudinary
export const uploadToCloudinary = (buffer, options = {}) => {
  // Apply defaults for folder and overwrite
  const finalOptions = {
    folder: 'profile-pictures', // ✅ Ensure profile pictures are grouped
    overwrite: true,            // ✅ Avoid duplicates
    ...options,                 // Allow caller to override these
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(finalOptions, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
