import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MiniProfileBar = ({ userId }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/full-profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data?.username) {
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch mini profile", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative max-w-4xl mx-auto px-4 mt-4"
    >
      {/* Inner-glow animated border using background-clip + text-transparent */}
      <div className="relative z-10 rounded-2xl p-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-6 py-4 border border-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-inner"
            />
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
                {user.username}
              </h2>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{user.followers?.length || 0} Followers</span>
                <span>{user.following?.length || 0} Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/my-profile")}
            className="flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg hover:scale-105 transition"
          >
            View My Profile
            <motion.span
              className="inline-block"
              initial={{ x: 0, opacity: 0.6 }}
              animate={{ x: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              &gt;&gt;
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniProfileBar;
