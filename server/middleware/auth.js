import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in both Authorization header and cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this route', 401)
    );
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Handle different token payload structures
    const userId = decoded.userId || decoded.id || decoded._id;
    if (!userId) {
      return next(new ErrorResponse('Invalid token payload', 403));
    }

    // 4. Get fresh user from DB
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new ErrorResponse('User no longer exists', 401));
    }

    // 5. Add additional security checks
    if (user.isBanned) {
      return next(new ErrorResponse('Account suspended', 403));
    }

    // 6. Attach user to request
    req.user = user;
    next();
    
  } catch (err) {
    console.error('JWT Error:', err.message);
    
    // Specific error messages
    let message = 'Not authorized';
    if (err.name === 'TokenExpiredError') {
      message = 'Session expired. Please login again.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    return next(new ErrorResponse(message, 401));
  }
};