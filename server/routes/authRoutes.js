import express from 'express';
import { signup, login, forgotPassword } from '../controllers/authController.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

export default router;