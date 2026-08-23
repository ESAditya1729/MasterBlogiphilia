// DashboardTabs/ContentManagement.jsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiEye,
  FiClock,
  FiCalendar,
  FiBook,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiHeart,
} from "react-icons/fi";
import api from "../../components/Dash-Editor/BlogApi";

const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
];

const getReadTime = (blog) => {
  const words =
    blog.wordCount ??
    (blog.content || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const ContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/blogs/status/published?limit=100");
      if (!data?.success) throw new Error(data?.message || "Failed to load blogs");
      setBlogs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Delete "${blog.title}" permanently? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/blogs/${blog._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const genres = ["all", ...new Set(blogs.map((b) => b.genre).filter(Boolean))];

  const filteredBlogs =
    selectedGenre === "all"
      ? blogs
      : blogs.filter((b) => b.genre === selectedGenre);

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
        <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Couldn't load your content
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchBlogs}
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
        <h1 className="text-2xl font-bold dark:text-white mb-2">Your Published Content</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all your published blog posts in one place
        </p>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedGenre === genre
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No published blogs found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
            {selectedGenre !== "all"
              ? `Try selecting a different genre or publish some ${selectedGenre} content.`
              : "You haven't published any blogs yet."}
          </p>
          {selectedGenre === "all" && (
            <button
              onClick={() => navigate("/editor")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Write your first blog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const gradient = GRADIENTS[(blog.genre || "").length % GRADIENTS.length];

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden cursor-pointer"
        onClick={() => navigate(`/blog/${blog._id}`)}
      >
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-44 object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-44 bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-500`}
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          >
            <span className="text-white text-4xl font-extrabold opacity-80">
              {(blog.title || "?").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            {blog.genre}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors"
          onClick={() => navigate(`/blog/${blog._id}`)}
        >
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
          <div className="flex items-center">
            <FiClock className="mr-1" />
            {getReadTime(blog)} min read
          </div>
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

      {/* Hover Actions */}
      <motion.div
        className="px-4 pb-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{ pointerEvents: isHovered ? "auto" : "none" }}
      >
        <button
          onClick={() => navigate(`/blog/${blog._id}`)}
          className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1"
        >
          <FiExternalLink className="w-4 h-4" />
          Read
        </button>
        <button
          onClick={() => navigate(`/editor/${blog._id}`)}
          aria-label="Edit blog"
          title="Edit"
          className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <FiEdit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(blog)}
          aria-label="Delete blog"
          title="Delete"
          className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ContentManagement;
