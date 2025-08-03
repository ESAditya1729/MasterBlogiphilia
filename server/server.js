// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ErrorResponse from './utils/errorResponse.js';
import mediaRoutes from './routes/mediaRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import statsRoutes from "./routes/statsRoutes.js";
import feedbackRoutes from './routes/feedbackRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "*", 
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/avatars', express.static('avatars'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/feedback', feedbackRoutes);


// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ErrorResponse('Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse('Not authorized', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
});

// DB Connection + Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
