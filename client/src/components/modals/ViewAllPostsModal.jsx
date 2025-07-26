import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';

const ViewAllPostsModal = ({ posts, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold dark:text-white">All Trending Posts</h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onClose}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ x: 5 }}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm mr-3 font-medium w-6 text-right">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium dark:text-gray-200">{post.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            by {post.author?.name || 'Unknown author'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                          {post.views} views
                        </span>
                        <FiArrowRight className="text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewAllPostsModal;