import React from "react";
import { motion } from "framer-motion";
import UserStats from "./UserStats";

const CollapsedHeader = ({ user, colors, renderStats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between mb-2"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={
              user.profilePicture
                ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
                : "https://i.pravatar.cc/100"
            }
            alt="Profile"
            className="rounded-full border-2 border-white dark:border-gray-800 w-10 h-10 shadow-md"
          />
        </div>
        <h3 className={`font-bold ${colors.text} text-md`}>{user.username}</h3>
      </div>
      <div className="flex items-center gap-4">
        <UserStats
          user={user}
          setShowFollowers={() => {}}
          setShowFollowing={() => {}}
          colors={colors}
        />
      </div>
    </motion.div>
  );
};

export default CollapsedHeader;