import express from 'express';
import {signup, login, forgotPassword,verifyAuth } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/verify', protect, verifyAuth);

export default router;