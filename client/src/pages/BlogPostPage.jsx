import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../components/Dash-Editor/BlogApi';
import { useTheme} from '../contexts/ThemeContext';
import { useAuth} from '../contexts/AuthContext';
import DOMPurify from 'dompurify';
import { FiHeart, FiEye, FiClock, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PostNavbar from './BlogPostNavbar'; // Adjust path as needed

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const contentRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/${id}`);
        
        if (!data?.success) {
          throw new Error(data?.message || 'Failed to load blog');
        }

        setBlog(data.data);
        setIsLiked(data.data.isLiked || false);
        setIsFollowing(data.data.isFollowing || false);
      } catch (err) {
        toast.error(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/api/blogs/${id}/like`);
      setIsLiked(data.isLiked);
      setBlog(prev => ({
        ...prev,
        likedBy: data.likedBy
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update like');
    }
  };

  const handleFollow = async () => {
    try {
      if (!blog?.author?._id) return;
      
      const { data } = await api.post(`/api/users/${blog.author._id}/follow`);
      setIsFollowing(data.isFollowing);
      toast.success(data.isFollowing ? 'Followed successfully' : 'Unfollowed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update follow status');
    }
  };

  const copyBlogUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success('Blog URL copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
        <p className="text-xl">Blog post not found</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
    >
      {/* Navigation Bar */}
      <PostNavbar darkMode={darkMode} isCopied={isCopied} copyBlogUrl={copyBlogUrl} />

      <article className="max-w-3xl mx-auto py-12 px-4" ref={contentRef}>
        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div 
            variants={itemVariants}
            className="mb-10 rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-96 object-cover"
            />
          </motion.div>
        )}

        {/* Title - Centered */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight">
            {blog.title}
          </h1>
          
          {/* Author Section */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-3 mb-2">
              {blog.author?.profilePicture && (
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src={blog.author.profilePicture} 
                  alt={blog.author.username} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              )}
              <p className="font-medium font-serif italic text-lg">
                {blog.author?.username || 'Anonymous Writer'}
              </p>
            </div>

            {/* Follow Button */}
            {user && blog.author?._id && user._id !== blog.author._id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`flex items-center space-x-1 px-4 py-1 rounded-full text-sm mt-2 ${
                  isFollowing 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}
              >
                {isFollowing ? (
                  <>
                    <FiUserCheck />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus />
                    <span>Follow</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center space-x-6 mb-10"
        >
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiClock className="text-lg" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiEye className="text-lg" />
            <span>{blog.views || 0} views</span>
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${isLiked 
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
              <FiHeart className="text-lg" />
            </motion.span>
            <span>{blog.likedBy?.length || 0}</span>
          </motion.button>
        </motion.div>

        {/* Excerpt */}
        {blog.excerpt && (
          <motion.p 
            variants={itemVariants}
            className={`text-xl text-center mb-12 italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            "{blog.excerpt}"
          </motion.p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {blog.tags.map(tag => (
              <motion.span 
                whileHover={{ y: -2 }}
                key={tag} 
                className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Content */}
        <motion.div 
          variants={itemVariants}
          className={`
            prose 
            prose-lg 
            max-w-none
            ${darkMode ? 'prose-invert' : ''}
            ${darkMode ? 'text-gray-300' : 'text-gray-800'}
            prose-headings:${darkMode ? 'text-white' : 'text-black'}
            prose-p:${darkMode ? 'text-gray-300' : 'text-gray-800'}
            prose-strong:${darkMode ? 'text-white' : 'text-black'}
            prose-a:text-blue-600
            dark:prose-a:text-blue-400
            prose-img:rounded-xl
            prose-img:shadow-lg
            prose-img:mx-auto
            prose-blockquote:border-l-4
            prose-blockquote:border-blue-500
            prose-blockquote:italic
            prose-blockquote:pl-6
          `}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />
      </article>
    </motion.div>
  );
};

export default BlogPostPage;