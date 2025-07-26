import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ViewAllGenresModal = ({ genres, isOpen, onClose }) => {
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
              <h3 className="text-xl font-semibold dark:text-white">All Trending Genres</h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onClose}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <motion.div
                    key={genre.id}
                    whileHover={{ scale: 1.03 }}
                    className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-medium dark:text-white">{genre.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {genre.posts} posts
                    </p>
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

export default ViewAllGenresModal;