import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiArrowRight } from "react-icons/fi";

export const TrendingPosts = ({ onViewAll, onPostClick }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/trending`
        );
        if (!res.ok) throw new Error("Failed to fetch trending posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading trending posts...
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
        <button
          className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
          onClick={onViewAll}
        >
          View All <FiArrowRight className="ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            No trending posts available.
          </div>
        ) : (
          posts.map((post, idx) => (
            <motion.div
              key={post._id}
              className="flex items-center justify-between p-4 border-l-4 rounded-lg transition-all cursor-pointer bg-gray-50 dark:bg-gray-900 border-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
              whileHover={{ x: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              onClick={() => onPostClick(post._id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white truncate max-w-[220px]">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by {post.author?.username || "Unknown"}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {post.views?.toLocaleString() ?? 0} views
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
