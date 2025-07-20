// routes/mediaRoutes.js
import express from 'express';
import { getCloudinaryImage } from '../controllers/mediaController.js';

const router = express.Router();

// GET /api/media/image/:folder/:filename
router.get('/image/:folder/:filename', getCloudinaryImage);

export default router;
