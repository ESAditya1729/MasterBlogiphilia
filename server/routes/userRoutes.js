// routes/userRoutes.js
import express from 'express';
import multer from 'multer';
import {
  getUserProfile,
  updateUserBio,
  uploadProfilePicture,
  searchUsers,
  toggleFollow,
  getFollowStats,
  getFollowers,
  getFollowing,
  getCloudinaryImage 
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

router.get('/search', protect, searchUsers);
router.post(
  '/upload-profile-picture',
  protect,
  upload.single('profilePicture'),
  uploadProfilePicture
);

// Parameterized routes come after specific routes
router.get('/:userId/full-profile', protect, getUserProfile);
router.put('/:userId/bio', protect, updateUserBio);
router.post('/follow/:userId', protect, toggleFollow);
router.get('/:userId/follow-stats', getFollowStats);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

export default router;