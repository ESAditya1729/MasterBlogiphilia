import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiBookmark,
  FiEye,
  FiHeart,
  FiClock,
  FiCalendar,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../components/Dash-Editor/BlogApi";

const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
];

const CoverOrPlaceholder = ({ blog, isHovered }) => {
  const gradient =
    GRADIENTS[
      (blog.genre || "").length % GRADIENTS.length
    ] || GRADIENTS[0];

  if (blog.coverImage) {
    return (
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-44 object-cover transition-transform duration-500"
        style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`w-full h-44 bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-500`}
      style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
    >
      <span className="text-white text-4xl font-extrabold opacity-80">
        {(blog.title || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

const BookmarkCard = ({ blog, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const readTime =
    blog.wordCount != null ? Math.max(1, Math.round(blog.wordCount / 200)) : null;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <div className="relative overflow-hidden cursor-pointer">
        <CoverOrPlaceholder blog={blog} isHovered={isHovered} />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
            {blog.genre}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(blog);
          }}
          aria-label="Remove bookmark"
          title="Remove bookmark"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 cursor-pointer">
        <h3 className="font-semibold text-base mb-1 line-clamp-2 dark:text-white">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {blog.excerpt || blog.content?.replace(/<[^>]*>/g, " ").slice(0, 100)}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
          </div>
          {readTime && (
            <div className="flex items-center">
              <FiClock className="mr-1" />
              {readTime} min
            </div>
          )}
          <div className="flex items-center">
            <FiEye className="mr-1" />
            {(blog.views || 0).toLocaleString()}
          </div>
          <div className="flex items-center">
            <FiHeart className="mr-1" />
            {(blog.likes || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookmarksTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/blogs/bookmarks");
      if (!data?.success) throw new Error(data?.message || "Failed to load bookmarks");
      setBlogs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError(err.response?.data?.message || err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemove = async (blog) => {
    try {
      await api.put(`/api/blogs/${blog._id}/bookmark`);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      toast.success("Removed from bookmarks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center py-12">
        <FiBookmark className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Couldn't load your bookmarks
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchBookmarks}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white mb-2">Your Bookmarks</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Blogs you've saved for later reading
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <FiBookmark className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No bookmarks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tap the bookmark icon on any blog post to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <BookmarkCard key={blog._id} blog={blog} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksTab;
