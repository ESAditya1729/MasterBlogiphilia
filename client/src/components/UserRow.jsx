import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiUserMinus, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserRow = ({ userData, onFollowChange,onViewProfile, className = "", onCloseModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  const [isProcessing, setIsProcessing] = useState(false);
  const isSelf = user?._id === userData._id;

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/follow/${userData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to toggle follow state");

      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      onFollowChange?.(userData._id, newFollowState);
    } catch (error) {
      console.error("Follow toggle error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    onCloseModal?.(); // Close the modal first
    navigate(`/profile/${userData._id}`);
  };

  return (
    <motion.div 
      className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors ${className}`}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative">
          <img
            src={userData.profilePicture || `https://ui-avatars.com/api/?name=${userData.username}&background=random`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
            alt={`${userData.username}'s profile`}
            onClick={onViewProfile} // Make the whole area clickable
          />
          {isFollowing && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
          )}
        </div>
        <div className="min-w-0">
          <p 
            className="font-medium text-gray-800 dark:text-gray-100 truncate cursor-pointer"
            onClick={onViewProfile}
          >
            {userData.username}
          </p>
          <button
            onClick={onViewProfile}
            className="flex items-center text-xs text-blue-500 dark:text-blue-400 hover:underline mt-1"
          >
            <FiEye className="mr-1" size={12} />
            View Profile
          </button>
        </div>
      </div>

      {!isSelf && (
        <motion.button
          onClick={handleFollowToggle}
          disabled={isProcessing}
          whileTap={{ scale: 0.95 }}
          className={`text-sm px-3 py-1.5 rounded-full flex items-center space-x-1 transition-all ${
            isFollowing
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50"
          }`}
        >
          {isProcessing ? (
            <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          ) : isFollowing ? (
            <>
              <FiUserMinus className="text-sm" />
              <span className="hidden sm:inline">Unfollow</span>
            </>
          ) : (
            <>
              <FiUserPlus className="text-sm" />
              <span className="hidden sm:inline">Follow</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default UserRow;