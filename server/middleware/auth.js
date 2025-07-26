import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in multiple locations
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from authorization header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // 2. Check if token exists
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this route. No token provided.', 401)
    );
  }

  try {
    // 3. Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Extract user ID from token (handle different payload structures)
    const userId = decoded?.id || decoded?.userId || decoded?._id;
    if (!userId) {
      return next(new ErrorResponse('Invalid token payload', 401));
    }

    // 5. Get fresh user from DB
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new ErrorResponse('User no longer exists', 401));
    }

    // 6. Additional security checks
    if (user.isBanned) {
      return next(new ErrorResponse('Account suspended. Please contact support.', 403));
    }

    // 7. Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorResponse('Password was recently changed. Please log in again.', 401)
      );
    }

    // 8. Attach user to request
    req.user = user;
    next();
    
  } catch (err) {
    console.error('JWT Error:', err.message);
    
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