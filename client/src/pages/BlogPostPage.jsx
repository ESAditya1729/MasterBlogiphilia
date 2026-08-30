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
  FiMessageSquare,
  FiEdit3,
  FiTrash2,
  FiArrowUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import PostNavbar from './BlogPostNavbar';
import LoadingSpinner from '../utils/LoadingSpinner';
import ErrorMessage from '../utils/ErrorMessage';
import useArticleEnhancer from '../utils/useArticleEnhancer';

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
  const articleBodyRef = useRef(null);
  useArticleEnhancer(articleBodyRef);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // "Edited" flag: true when the post was saved again after it was published
  const EDIT_GRACE_MS = 60 * 1000;
  const publishedDate = blog?.publishedAt || blog?.createdAt;
  const isEdited =
    blog?.status === 'published' &&
    !!blog?.updatedAt &&
    !!publishedDate &&
    new Date(blog.updatedAt).getTime() - new Date(publishedDate).getTime() > EDIT_GRACE_MS;

  const isOwner =
    !!user && !!blog?.author?._id && user._id === blog.author._id;

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
  }, [id]);

  // Scroll progress + back-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      const progress = height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0;
      setScrollProgress(progress);
      setShowTopBtn(scrollTop > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const handleEditPost = () => {
    navigate(`/editor/${id}`);
  };

  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      'Delete this blog permanently? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success('Blog deleted successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to delete blog'
      );
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this post');
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.put(`/api/blogs/${id}/like`);
      const payload = data?.data || {};
      setIsLiked(!!payload.isLiked);
      setBlog((prev) => ({
        ...prev,
        likes: typeof payload.likes === 'number' ? payload.likes : prev.likes,
      }));

      if (payload.isLiked) {
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
      
      const { data } = await api.post(`/api/users/follow/${blog.author._id}`);
      setIsFollowing(!!data.isFollowing);
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
      const { data } = await api.put(`/api/blogs/${id}/bookmark`);
      const payload = data?.data || {};
      setIsBookmarked(!!payload.isBookmarked);
      toast.success(payload.isBookmarked ? 'Post bookmarked' : 'Post removed from bookmarks');
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

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8" ref={contentRef}>
        {/* Cover Image Hero */}
        {blog.coverImage && (
          <motion.div 
            variants={itemVariants}
            className={`relative mb-12 overflow-hidden rounded-2xl shadow-2xl ${
              darkMode ? 'shadow-gray-800/60' : 'shadow-gray-300/50'
            }`}
          >
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-[18rem] sm:h-[26rem] md:h-[32rem] object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-10"
        >
          {blog.category && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide mb-6 ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 ring-1 ring-indigo-500/30' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 ring-1 ring-indigo-200'
              }`}
            >
              {blog.category}
            </motion.span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-serif leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Compact author strip — whole thing links to profile */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${blog.author?._id}`)}
              className="group flex items-center gap-3"
              aria-label={`View ${blog.author?.username || 'author'} profile`}
            >
              {blog.author?.profilePicture ? (
                <img
                  src={blog.author.profilePicture}
                  alt={blog.author.username}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-md group-hover:shadow-indigo-500/30 transition-shadow"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-bold">
                  {(blog.author?.username || 'A')[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-left">
                <span className="block font-semibold leading-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
                  {blog.author?.username || 'Anonymous Writer'}
                </span>
                <span className={`block text-sm leading-tight ${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}`}>
                  {new Date(publishedDate || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {' · '}
                  {formatReadTime(blog.readTime || 5)}
                  {isEdited && (
                    <span
                      className="italic opacity-75"
                      title={`Edited on ${new Date(blog.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}`}
                    >
                      {' (edited)'}
                    </span>
                  )}
                </span>
              </span>
            </button>

            {user && blog.author?._id && user._id !== blog.author._id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30'
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

            {isOwner && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditPost}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium ${
                    darkMode
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <FiEdit3 />
                  <span>Edit</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeletePost}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium ${
                    darkMode
                      ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-4"
        >
          <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FiEye className="text-lg" />
            <span>{blog.views?.toLocaleString() || 0} views</span>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiked
              ? 'text-red-500'
              : darkMode
                ? 'text-gray-400 hover:text-red-400'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <motion.span
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              <FiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
            </motion.span>
            <span>{(blog.likes || 0).toLocaleString()}</span>
          </motion.button>

          <button 
            onClick={() => {
              const commentSection = document.getElementById('comments');
              commentSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <FiMessageSquare className="text-lg" />
            <span>{(blog.commentCount || 0).toLocaleString()} comments</span>
          </button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyBlogUrl}
            className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-500 hover:text-indigo-600'}`}
            aria-label="Share post"
          >
            <FiShare2 className="text-lg" />
            <span>{isCopied ? 'Copied!' : 'Share'}</span>
          </motion.button>
        </motion.div>

        <motion.div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-8" variants={itemVariants} />

        {/* Excerpt */}
        {blog.excerpt && (
          <motion.p 
            variants={itemVariants}
            className={`text-xl md:text-2xl text-center mb-12 leading-relaxed max-w-3xl mx-auto font-serif italic ${
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
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-indigo-300' : 'bg-gray-100 hover:bg-gray-200 text-indigo-600'
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
          ref={articleBodyRef}
          className="blog-article prose prose-xl dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />

        {/* Closing / Author CTA */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-10" />
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl ${
            darkMode ? 'bg-gray-800/60 ring-1 ring-gray-700' : 'bg-gray-50 ring-1 ring-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              {blog.author?.profilePicture ? (
                <img
                  src={blog.author.profilePicture}
                  alt={blog.author.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold">
                  {(blog.author?.username || 'A')[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Written by</p>
                <p className="font-bold text-xl">{blog.author?.username || 'Anonymous Writer'}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/profile/${blog.author?._id}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-lg hover:shadow-indigo-500/30 transition-shadow"
            >
              View Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.section 
          id="comments"
          variants={fadeIn}
          className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 font-serif">Comments ({blog.commentCount || 0})</h2>
          {/* Comment functionality would go here */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
            <p className="text-center">
              {user ? (
                'Comment functionality coming soon!'
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-indigo-500 hover:underline"
                >
                  Login to leave a comment
                </button>
              )}
            </p>
          </div>
        </motion.section>
      </article>

      {/* Floating Action Buttons (right side) */}
      <div className="fixed right-5 bottom-24 flex flex-col space-y-3 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyBlogUrl}
          className={`p-3 rounded-full shadow-lg ${
            darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
          aria-label="Share post"
          title="Share post"
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
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
          aria-label="Like post"
          title="Like post"
        >
          <FiHeart className={isLiked ? 'fill-current' : ''} />
        </motion.button>

        {user && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`p-3 rounded-full shadow-lg ${
              isBookmarked
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
                : darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          >
            <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
          </motion.button>
        )}
      </div>

      {/* Back to top */}
      <div className="fixed right-5 bottom-5 z-30">
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            aria-label="Back to top"
            title="Back to top"
          >
            <FiArrowUp />
          </motion.button>
        )}
      </div>

      {/* Sticky reading progress labels (desktop left rail) */}
      <div className={`fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 text-sm z-20 ${
        darkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <div className="flex items-center gap-2">
          <FiClock />
          <span>{formatReadTime(blog.readTime || 5)}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiEye />
          <span>{blog.views?.toLocaleString() || 0} views</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;