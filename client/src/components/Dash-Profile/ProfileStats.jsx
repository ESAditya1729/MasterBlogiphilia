import { motion } from "framer-motion";
import { FiBookOpen, FiUsers, FiClock } from "react-icons/fi";
import { useState } from "react";

const StatItem = ({ icon, value, label, color, onClick }) => (
  <motion.button 
    className="flex flex-col items-center px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full focus:outline-none focus:ring-2 focus:ring-opacity-50"
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    whileFocus={{ y: -4 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    aria-label={`View ${label}`}
  >
    <div className={`text-2xl mb-2 p-2.5 rounded-full ${color}`}>
      {icon}
    </div>
    <motion.span 
      className="text-2xl font-bold text-gray-800 dark:text-white mb-1"
      key={value}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {value}
    </motion.span>
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </span>
  </motion.button>
);

const ProfileStats = ({ 
  postsCount, 
  followersCount, 
  followingCount, 
  readingTime,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
  onReadingClick
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatItem 
        icon={<FiBookOpen className="stroke-1.5" />} 
        value={postsCount} 
        label="Posts" 
        color="text-purple-500 bg-purple-50 dark:bg-purple-900/20"
        onClick={onPostsClick}
      />
      <StatItem 
        icon={<FiUsers className="stroke-1.5" />} 
        value={followersCount} 
        label="Followers" 
        color="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
        onClick={onFollowersClick}
      />
      <StatItem 
        icon={<FiUsers className="stroke-1.5 -scale-x-100" />} 
        value={followingCount} 
        label="Following" 
        color="text-blue-500 bg-blue-50 dark:bg-blue-900/20"
        onClick={onFollowingClick}
      />
      <StatItem 
        icon={<FiClock className="stroke-1.5" />} 
        value={`${Math.round(readingTime)}h`} 
        label="Reading" 
        color="text-pink-500 bg-pink-50 dark:bg-pink-900/20"
        onClick={onReadingClick}
      />
    </div>
  );
};

export default ProfileStats;