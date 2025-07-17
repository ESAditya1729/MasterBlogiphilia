import React from "react";
import { motion } from "framer-motion";
import UserStats from "./UserStats";
import ProfilePicture from "./ProfilePicture";

const CollapsedHeader = ({ user, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex items-center justify-between mb-2 will-change-transform"
    >
      <div className="flex items-center gap-3">
        <ProfilePicture 
          user={user} 
          size="small" 
          handleProfilePicClick={() => {}} 
        />
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