import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye } from "react-icons/fi";
import UserRow from "../UserRow";
import { useNavigate } from "react-router-dom";

const FollowingModal = ({ isOpen, onClose, userId, onFollowChange }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    fetchFollowing();
  }, [isOpen, userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) throw new Error("Failed to fetch following");
      
      const data = await res.json();
      setFollowing(data.data || []);
    } catch (err) {
      console.error("Failed to load following", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    onClose(); // Close the modal first
    navigate(`/profile/${userId}`); // Then navigate to the profile
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Following
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <FiX className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading following...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500 dark:text-red-400">
                  {error}
                </div>
              ) : following.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <FiEye className="text-4xl mb-2" />
                  <p>Not following anyone yet</p>
                </div>
              ) : (
                following.map((user) => (
                  <UserRow 
                    key={user._id}
                    userData={user}
                    onFollowChange={onFollowChange}
                    onViewProfile={() => handleViewProfile(user._id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  />
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowingModal;