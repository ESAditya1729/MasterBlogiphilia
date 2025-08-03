import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiAward } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ViewAllPostsModal = ({ posts = [], isOpen, onClose }) => {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
    onClose();
  };

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
              <h3 className="text-xl font-semibold dark:text-white flex items-center">
                <FiAward className="mr-2 text-yellow-500" />
                {posts.length > 0 ? 'All Trending Posts' : 'No Posts Available'}
              </h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <FiX className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    There are no trending posts to display.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post, idx) => (
                    <motion.div
                      key={post._id || `post-${idx}`}
                      whileHover={{ 
                        x: 5,
                        backgroundColor: 'var(--blue-50)',
                        darkBackgroundColor: 'var(--gray-700)'
                      }}
                      className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                      onClick={() => handlePostClick(post._id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {post.title || 'Untitled Post'}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {post.author?.username ? `by ${post.author.username}` : 'Unknown author'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {typeof post.views === 'number' ? post.views.toLocaleString() : '0'} views
                        </span>
                        <FiArrowRight className="text-gray-400 flex-shrink-0" size={14} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewAllPostsModal;