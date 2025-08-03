import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const TrendingPosts = ({ onViewAll }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/trending`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trending posts: ${res.status}`);
        }

        const data = await res.json();
        
        // Handle both response formats
        const postsData = Array.isArray(data.data) ? data.data : 
                         Array.isArray(data) ? data : [];
        
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold dark:text-white flex items-center">
            <FiAward className="mr-2 text-yellow-500" />
            Trending Blogs
          </h3>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold dark:text-white flex items-center">
            <FiAward className="mr-2 text-yellow-500" />
            Trending Blogs
          </h3>
        </div>
        <p className="text-sm text-red-500 dark:text-red-400">
          Error loading posts: {error}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold dark:text-white flex items-center">
          <FiAward className="mr-2 text-yellow-500" />
          Trending Blogs
        </h3>
        {posts.length > 0 && (
          <button
            className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center disabled:opacity-50"
            onClick={onViewAll}
            disabled={loading || error}
          >
            View All <FiArrowRight className="ml-1" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            No trending posts available.
          </div>
        ) : (
          posts.map((post, idx) => (
            <motion.div
              key={post._id || `post-${idx}`}
              className="flex items-center justify-between p-4 border-l-4 rounded-lg transition-all cursor-pointer bg-gray-50 dark:bg-gray-900 border-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
              whileHover={{ x: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              onClick={() => handlePostClick(post._id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {post.title || 'Untitled Post'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {post.author?.username ? `by ${post.author.username}` : "Unknown author"}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {typeof post.views === 'number' ? post.views.toLocaleString() : '0'} views
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};