import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../components/Dash-Editor/BlogApi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import DOMPurify from 'dompurify';
import { 
  FiHeart, 
  FiEye, 
  FiClock, 
  FiUserPlus, 
  FiUserCheck, 
  FiShare2,
  FiBookmark,
  FiMessageSquare
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PostNavbar from './BlogPostNavbar';
import LoadingSpinner from '../utils/LoadingSpinner';
import ErrorMessage from '../utils/ErrorMessage';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const contentRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
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
        setIsBookmarked(data.data.isBookmarked || false);
      } catch (err) {
        setError(err.message || 'Failed to load blog post');
        toast.error(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();

    // Track view count
    const trackView = async () => {
      try {
        await api.post(`/api/blogs/${id}/view`);
      } catch (err) {
        console.error('Failed to track view:', err);
      }
    };

    trackView();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this post');
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.post(`/api/blogs/${id}/like`);
      setIsLiked(data.isLiked);
      setBlog(prev => ({
        ...prev,
        likedBy: data.likedBy,
        likeCount: data.isLiked ? prev.likeCount + 1 : prev.likeCount - 1
      }));
      
      if (data.isLiked) {
        toast.success('Post liked!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update like');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.info('Please login to follow this author');
      navigate('/login');
      return;
    }

    try {
      if (!blog?.author?._id) return;
      
      const { data } = await api.post(`/api/users/${blog.author._id}/follow`);
      setIsFollowing(data.isFollowing);
      toast.success(data.isFollowing ? 'Followed successfully' : 'Unfollowed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update follow status');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.info('Please login to bookmark this post');
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.post(`/api/blogs/${id}/bookmark`);
      setIsBookmarked(data.isBookmarked);
      toast.success(data.isBookmarked ? 'Post bookmarked' : 'Post removed from bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const copyBlogUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast.success('Blog URL copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatReadTime = (minutes) => {
    if (minutes < 1) return 'Less than a minute';
    if (minutes === 1) return '1 min read';
    return `${minutes} min read`;
  };

  if (loading) {
    return <LoadingSpinner darkMode={darkMode} fullScreen />;
  }

  if (error || !blog) {
    return (
      <ErrorMessage 
        message={error || 'Blog post not found'} 
        darkMode={darkMode} 
        fullScreen 
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
    >
      {/* Navigation Bar */}
      <PostNavbar 
        darkMode={darkMode} 
        isCopied={isCopied} 
        copyBlogUrl={copyBlogUrl} 
        blog={blog}
      />

      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8" ref={contentRef}>
        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div 
            variants={itemVariants}
            className="mb-10 rounded-xl overflow-hidden shadow-2xl"
          >
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-auto max-h-[32rem] object-cover"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Title Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-10"
        >
          <div className="mb-6">
            {blog.category && (
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
                  darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}
              >
                {blog.category}
              </motion.span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif leading-tight">
            {blog.title}
          </h1>
          
          {/* Author Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center space-x-3 mb-3">
              {blog.author?.profilePicture && (
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  src={blog.author.profilePicture} 
                  alt={blog.author.username} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                  onClick={() => navigate(`/profile/${blog.author._id}`)}
                />
              )}
              <div className="text-left">
                <p className="font-medium text-lg">
                  {blog.author?.username || 'Anonymous Writer'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Published {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-4">
              {/* Follow Button */}
              {user && blog.author?._id && user._id !== blog.author._id && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
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

              {/* Bookmark Button */}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
                    isBookmarked
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <FiBookmark />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-6 mb-10"
        >
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiClock className="text-lg" />
            <span>{formatReadTime(blog.readTime || 5)}</span>
          </div>
          
          <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiEye className="text-lg" />
            <span>{blog.views?.toLocaleString() || 0} views</span>
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
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              <FiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
            </motion.span>
            <span>{(blog.likeCount || blog.likedBy?.length || 0).toLocaleString()}</span>
          </motion.button>

          <button 
            onClick={() => {
              const commentSection = document.getElementById('comments');
              commentSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <FiMessageSquare className="text-lg" />
            <span>{(blog.commentCount || 0).toLocaleString()} comments</span>
          </button>
        </motion.div>

        {/* Excerpt */}
        {blog.excerpt && (
          <motion.p 
            variants={itemVariants}
            className={`text-xl md:text-2xl text-center mb-12 leading-relaxed max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {blog.excerpt}
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
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                }`}
                onClick={() => navigate(`/blogs?tag=${tag}`)}
              >
                #{tag}
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
            md:prose-xl
            max-w-none
            ${darkMode ? 'prose-invert' : ''}
            ${darkMode ? 'text-gray-300' : 'text-gray-800'}
            prose-headings:font-serif
            prose-headings:${darkMode ? 'text-white' : 'text-gray-900'}
            prose-p:${darkMode ? 'text-gray-300' : 'text-gray-700'}
            prose-p:leading-relaxed
            prose-strong:${darkMode ? 'text-white' : 'text-gray-900'}
            prose-a:text-blue-600
            dark:prose-a:text-blue-400
            prose-a:underline-offset-4
            prose-img:rounded-xl
            prose-img:shadow-lg
            prose-img:mx-auto
            prose-blockquote:border-l-4
            prose-blockquote:border-blue-500
            prose-blockquote:italic
            prose-blockquote:pl-6
            prose-blockquote:bg-opacity-20
            ${darkMode ? 'prose-blockquote:bg-gray-800' : 'prose-blockquote:bg-blue-50'}
            prose-pre:bg-gray-800
            prose-pre:rounded-xl
            prose-pre:p-4
            prose-code:${darkMode ? 'text-gray-300' : 'text-gray-800'}
            prose-ul:list-disc
            prose-ol:list-decimal
            prose-li:my-1
          `}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />

        {/* Comments Section */}
        <motion.section 
          id="comments"
          variants={fadeIn}
          className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6">Comments ({blog.commentCount || 0})</h2>
          {/* Comment functionality would go here */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className="text-center">
              {user ? (
                'Comment functionality coming soon!'
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-blue-500 hover:underline"
                >
                  Login to leave a comment
                </button>
              )}
            </p>
          </div>
        </motion.section>
      </article>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col space-y-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyBlogUrl}
          className={`p-3 rounded-full shadow-lg ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
          aria-label="Share post"
        >
          <FiShare2 />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`p-3 rounded-full shadow-lg ${
            isLiked 
              ? 'bg-red-100 text-red-500 dark:bg-red-900' 
              : darkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-800'
          }`}
          aria-label="Like post"
        >
          <FiHeart className={isLiked ? 'fill-current' : ''} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;