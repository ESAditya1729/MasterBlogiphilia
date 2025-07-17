import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // ✅ 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ❌ No token provided
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this route (No token)', 401)
    );
  }

  try {
    // ✅ 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return next(new ErrorResponse('Invalid token payload (no userId)', 403));
    }

    // ✅ 3. Attach user to request
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    req.user = {
      _id: user._id.toString(), 
      username: user.username,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return next(new ErrorResponse('Not authorized or token expired', 401));
  }
};
