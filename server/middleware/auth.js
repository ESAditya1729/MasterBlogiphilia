// auth.js
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

// @desc    Protect routes
export const protect = async (req, res, next) => {
  let token;

  // 1. Extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Check if token exists
  if (!token) {
    return next(new ErrorResponse('No token provided.', 401));
  }

  try {
    // 3. Verify secret is set
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Extract userId from token
    const userId = decoded?.id || decoded?.userId || decoded?._id;
    if (!userId) {
      return next(new ErrorResponse('Invalid token payload', 401));
    }

    // 6. Fetch user from DB
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new ErrorResponse('User no longer exists', 401));
    }

    // 7. Check if user is banned
    if (user.isBanned) {
      return next(new ErrorResponse('Account suspended', 403));
    }

    // 8. Check if password changed after token
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorResponse('Password recently changed. Please login again.', 401)
      );
    }

    // 9. Attach user to request
    req.user = user;
    next();

  } catch (err) {

    let message = 'Not authorized to access this route';
    let statusCode = 401;

    if (err.name === 'TokenExpiredError') {
      message = 'Session expired. Please login again.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token. Please login again.';
    } else if (err.message === 'JWT_SECRET is not configured') {
      message = 'Server configuration error';
      statusCode = 500;
    }

    return next(new ErrorResponse(message, statusCode));
  }
};
