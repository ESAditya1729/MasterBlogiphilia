import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiX, FiBookmark, FiShare2, FiHeart } from 'react-icons/fi';

const BlogViewModal = ({ blogId, onClose }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${blogId}`);
        setBlog(response.data);
        // Check if user has bookmarked/liked (you'd need auth context)
        // setIsBookmarked(response.data.isBookmarked);
        // setIsLiked(response.data.isLiked);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  const handleBookmark = async () => {
    try {
      await axios.post(`/api/blogs/${blogId}/bookmark`);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/blogs/${blogId}/like`);
      setIsLiked(!isLiked);
      setBlog(prev => ({
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <AnimatePresence>
      {blogId && (
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
            className="relative bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : error ? (
              <div className="p-8 text-red-500">{error}</div>
            ) : blog ? (
              <>
                {/* Header with actions */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-full ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                      <FiBookmark className={isBookmarked ? "fill-current" : ""} />
                    </button>
                    <button
                      onClick={handleLike}
                      className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      aria-label={isLiked ? "Unlike" : "Like"}
                    >
                      <FiHeart className={isLiked ? "fill-current" : ""} />
                      <span className="ml-1 text-sm">{blog.likes}</span>
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <FiShare2 />
                    </button>
                  </div>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <FiX />
                  </button>
                </div>

                {/* Blog Content */}
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-full">
                      {blog.category}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold dark:text-white">{blog.title}</h2>
                    <div className="mt-4 flex items-center">
                      <img 
                        src={blog.author.avatar} 
                        alt={blog.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium dark:text-gray-200">{blog.author.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(blog.publishedAt).toLocaleDateString()} · {blog.readTime} min read
                        </p>
                      </div>
                    </div>
                  </div>

                  {blog.featuredImage && (
                    <div className="mb-8 rounded-xl overflow-hidden">
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogViewModal;