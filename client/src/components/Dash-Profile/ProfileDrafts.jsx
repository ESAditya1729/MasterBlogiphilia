import { motion } from "framer-motion";
import { FiEdit3, FiClock, FiTrash2, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileDrafts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchDrafts();
  }, [user]);

const fetchDrafts = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/blogs/drafts`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Filter drafts client-side as additional security
    const userDrafts = response.data.filter(draft => 
      draft.author && 
      draft.author._id === user?._id
    );
    
    setDrafts(userDrafts);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch drafts");
    console.error("Drafts fetch error:", err);
    if (err.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
    }
  } finally {
    setLoading(false);
  }
};

  const handleEditDraft = (draftId) => {
    navigate(`/editor/${draftId}`);
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${draftId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Draft deleted successfully");
      fetchDrafts(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete draft");
      console.error("Delete draft error:", err);
    }
  };

  const handleCreateNew = () => {
    navigate("/editor/new");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      {drafts.length > 0 ? (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <motion.li
              key={draft._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg text-gray-800 dark:text-white mb-1 truncate">
                    {draft.title || "Untitled Draft"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-x-3">
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                    <span>
                      {draft.content.split(/\s+/).length} words
                    </span>
                    {draft.genre && (
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">
                        {draft.genre}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditDraft(draft._id)}
                    className="p-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    aria-label="Edit draft"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft._id)}
                    className="p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Delete draft"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
            <FiEdit3 />
          </div>
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
            No drafts saved yet
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            Your unpublished works will appear here
          </p>
          <motion.button
            onClick={handleCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-md flex items-center mx-auto"
          >
            <FiPlus className="mr-2" />
            Create New Draft
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileDrafts;