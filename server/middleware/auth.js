import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route (No token)', 401));
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both { userId } or { id } payloads
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return next(new ErrorResponse('Invalid token payload (no userId)', 403));
    }

    // Fetch user from DB and attach to req
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return next(new ErrorResponse('Not authorized or token expired', 401));
  }
};
