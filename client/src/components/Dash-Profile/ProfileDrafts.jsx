import { motion } from "framer-motion";
import { FiEdit3, FiClock, FiTrash2 } from "react-icons/fi";

const ProfileDrafts = () => {
  // Mock drafts data
  const drafts = [
    {
      id: 1,
      title: "Untitled Draft",
      lastEdited: "2023-06-10",
      wordCount: 1245
    },
    {
      id: 2,
      title: "The Future of Digital Publishing",
      lastEdited: "2023-06-05",
      wordCount: 832
    }
  ];

  return (
    <div>
      {drafts.length > 0 ? (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <motion.li
              key={draft.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg text-gray-800 dark:text-white mb-1">
                    {draft.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiClock className="mr-1" />
                    <span className="mr-3">
                      Last edited {new Date(draft.lastEdited).toLocaleDateString()}
                    </span>
                    <span>{draft.wordCount} words</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <FiEdit3 />
                  </button>
                  <button className="p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-md"
          >
            Create New Draft
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileDrafts;