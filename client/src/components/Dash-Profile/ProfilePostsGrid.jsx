import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiFeather, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePostsGrid = ({ userId, showDrafts = false }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/author/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              status: showDrafts ? 'draft' : 'published'
            }
          }
        );

        const formattedPosts = response.data.data.map((post) => ({
          id: post._id,
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 100) + "...",
          genre: post.genre,
          tags: post.tags,
          date: new Date(post.publishedAt || post.createdAt).toLocaleDateString(),
          readTime: `${Math.ceil((post.content || "").length / 1000)} min`,
          likes: post.likes || 0,
          views: post.views || 0,
          status: post.status,
          isFeatured: post.isFeatured || false,
        }));

        setPosts(formattedPosts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
        console.error("Fetch posts error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, showDrafts]);

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like post");
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="col-span-full text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-red-500 text-5xl mb-4">
          <FiFeather />
        </div>
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
          Error loading posts
        </h3>
        <p className="text-gray-400 dark:text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative"
          >
            <div 
              className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              {/* Cover Image Placeholder */}
              <div className="h-40 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <FiBookOpen className="text-4xl text-gray-400 dark:text-gray-500" />
              </div>

              <div className="p-5">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                    {post.genre}
                  </span>
                  {post.isFeatured && (
                    <motion.span
                      className="ml-2 text-xs font-bold px-2 py-1 bg-amber-500 text-white rounded-full flex items-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1.5,
                      }}
                    >
                      <FiBookOpen className="mr-1" size={12} />
                      Featured
                    </motion.span>
                  )}
                  {post.status === 'draft' && (
                    <span className="ml-2 text-xs font-bold px-2 py-1 bg-gray-500 text-white rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center">
                    <FiClock className="mr-1" size={14} />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center hover:text-red-500 transition-colors"
                    >
                      ♥ {post.likes}
                    </button>
                    <span>• {post.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {posts.length === 0 && (
        <motion.div
          className="col-span-full text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
            <FiFeather />
          </div>
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
            {showDrafts ? "No draft posts found" : "No published posts yet"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {showDrafts 
              ? "When you create drafts, they'll appear here" 
              : "When posts are published, they'll appear here"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePostsGrid;