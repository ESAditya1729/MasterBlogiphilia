import User from "../models/User.js";

// @desc    Get user-related stats (Total users, New users in last 7 days)
// @route   GET /api/stats/user-stats
// @access  Private (requires auth)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsers = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    res.status(200).json({
      totalUsers,
      newUsers,
    });
  } catch (err) {
    console.error("Error in user stats:", err);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};
