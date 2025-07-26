import express from 'express';
import { protect, signup, login, forgotPassword,verifyAuth } from '../controllers/authController.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/verify', protect, verifyAuth);

export default router;