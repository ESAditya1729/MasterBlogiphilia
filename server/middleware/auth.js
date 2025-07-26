export const protect = async (req, res, next) => {
  let token;

  console.log("🔐 [protect] Headers received:", req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log("🔑 Token extracted from header:", token);
  } else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log("🍪 Token extracted from cookie:", token);
  }

  if (!token) {
    console.log("❌ No token provided");
    return next(new ErrorResponse('No token provided.', 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET not configured");
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const userId = decoded?.id || decoded?.userId || decoded?._id;
    if (!userId) {
      console.log("❌ No userId in decoded token");
      return next(new ErrorResponse('Invalid token payload', 401));
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log("❌ User not found in DB");
      return next(new ErrorResponse('User no longer exists', 401));
    }

    if (user.isBanned) {
      console.log("🚫 User is banned");
      return next(new ErrorResponse('Account suspended', 403));
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      console.log("🔁 Password changed after token issued");
      return next(
        new ErrorResponse('Password recently changed. Please login again.', 401)
      );
    }

    console.log("✅ User authenticated:", user.username);
    req.user = user;
    next();

  } catch (err) {
    console.error("❌ JWT verification error:", err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
