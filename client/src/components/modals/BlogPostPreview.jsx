import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiEye, FiClock, FiUserPlus, FiUserCheck, FiShare2, FiBookmark } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import "./Styles.css"

const BlogPreviewModal = ({ blog, isOpen, onClose, darkMode, onLike, onFollow, isLiked, isFollowing }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const copyBlogUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`absolute top-4 right-4 z-20 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="Close preview"
              >
                <FiX size={24} />
              </motion.button>

              {/* Cover Image */}
              {blog.coverImage && (
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className={`p-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {/* Title */}
                <h2 className="text-3xl font-bold mb-4 font-serif">{blog.title}</h2>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {blog.author?.profilePicture && (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={blog.author.profilePicture}
                        alt={blog.author.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                      />
                    )}
                    <div>
                      <p className="font-medium">{blog.author?.username || 'Anonymous Writer'}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onFollow}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                      isFollowing
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <FiUserCheck size={14} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={14} />
                        <span>Follow</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className={`text-lg italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    "{blog.excerpt}"
                  </p>
                )}

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map(tag => (
                      <motion.span
                        whileHover={{ y: -2 }}
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600'
                        }`}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Content Preview */}
                <div
                  className={`
                    blog-content-preview
                    max-h-64 
                    overflow-y-auto 
                    ${darkMode ? 'dark-mode' : ''}
                    ${darkMode ? 'text-gray-300' : 'text-gray-800'}
                  `}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content.substring(0, 1000) + '...') }}
                />

                {/* Engagement Bar */}
                <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <FiEye size={18} />
                        <span>{blog.views || 0} views</span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onLike}
                        className={`flex items-center space-x-2 ${isLiked
                          ? 'text-red-500'
                          : darkMode
                            ? 'text-gray-400 hover:text-red-400'
                            : 'text-gray-600 hover:text-red-500'
                          }`}
                      >
                        <motion.span
                          animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FiHeart size={18} />
                        </motion.span>
                        <span>{blog.likedBy?.length || 0}</span>
                      </motion.button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleBookmark}
                        className={`p-2 rounded-full ${isBookmarked
                          ? 'text-amber-500'
                          : darkMode
                            ? 'text-gray-400 hover:text-amber-400'
                            : 'text-gray-600 hover:text-amber-500'
                          }`}
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <FiBookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={copyBlogUrl}
                        className={`p-2 rounded-full ${isCopied
                          ? 'text-green-500'
                          : darkMode
                            ? 'text-gray-400 hover:text-blue-400'
                            : 'text-gray-600 hover:text-blue-500'
                          }`}
                        aria-label="Share blog"
                      >
                        <FiShare2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPreviewModal;