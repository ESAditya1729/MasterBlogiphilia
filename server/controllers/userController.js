// controllers/userController.js
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "express-async-handler";

// @desc    Get user profile
// @route   GET /api/users/:userId/full-profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("followers", "username profilePicture createdAt")
      .populate("following", "username profilePicture createdAt");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const profile = user.toObject();
    profile.followersCount = (user.followers || []).length;
    profile.followingCount = (user.following || []).length;
    profile._id = user._id;
    profile.createdAt = user.createdAt;

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user bio
// @route   PUT /api/users/:userId/bio
// @access  Private
export const updateUserBio = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user._id) {
      return next(
        new ErrorResponse("Not authorized to update this profile", 401)
      );
    }

    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { bio },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return next(new ErrorResponse("User not found", 404));

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse("Please upload a file", 400));
    }

    // ✅ Make sure req.user.userId exists
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
      folder: "profile-pictures",
      public_id: req.user._id.toString(), // overwrite for same user
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
      ],
    });

    // ✅ Save URL to MongoDB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: cloudinaryResult.secure_url },
      { new: true }
    ).select("-password");

    // ✅ Return URL to frontend
    return res.status(200).json({
      success: true,
      url: user.profilePicture,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    next(err);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  const currentUserId = req.user._id;

  if (!query || query.trim() === "") {
    return res.status(200).json([]);
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" },
    _id: { $ne: currentUserId },
  }).select("username createdAt followers following profilePicture"); // ✅ added

  const results = users.map((user) => ({
    id: user._id,
    username: user.username,
    profilePicture: user.profilePicture || "", 
    createdAt: user.createdAt,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    isFollowing: user.followers.includes(currentUserId),
  }));

  res.status(200).json(results);
});

// @desc    Follow/Unfollow a user
// @route   POST /api/users/follow/:userId
// @access  Private
export const toggleFollow = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (userId === currentUserId.toString()) {
    return next(new ErrorResponse("You cannot follow yourself", 400));
  }

  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    return next(new ErrorResponse("User not found", 404));
  }

  const isFollowing = userToFollow.followers.includes(currentUserId);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId },
    });
  } else {
    // Follow
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUserId },
    });
  }

  const updatedUser = await User.findById(userId).select("followers following");

  res.status(200).json({
    success: true,
    followersCount: updatedUser.followers.length,
    followingCount: updatedUser.following.length,
    isFollowing: !isFollowing,
  });
});

// @desc    Get follow stats
// @route   GET /api/users/:userId/follow-stats
// @access  Public
export const getFollowStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select(
    "followers following"
  );

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    followersCount: user.followers.length,
    followingCount: user.following.length,
  });
});

// @desc    Get user's followers list
// @route   GET /api/users/:userId/followers
// @access  Public
export const getFollowers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .select("followers")
    .populate("followers", "username profilePicture createdAt");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    count: user.followers.length,
    data: user.followers,
  });
});
// @desc    Get user's following list
// @route   GET /api/users/:userId/following
// @access  Public
export const getFollowing = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .select("following")
    .populate({
      path: "following",
      select: "username profilePicture createdAt followers following",
      transform: (doc) => doc?.toJSON(),
    });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    count: user.following?.length || 0,
    data: user.following,
  });
});
