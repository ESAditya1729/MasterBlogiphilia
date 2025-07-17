import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartIcon, BookmarkIcon, ChatBubbleLeftIcon, ArrowUpTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

const FeaturedBlogs = ({ darkMode }) => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interactions, setInteractions] = useState({});

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API response
        const mockData = [
          {
            id: 1,
            title: "The Future of AI in Web Development",
            excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and interact with web applications.",
            author: "Alex Johnson",
            date: "2023-05-15",
            readTime: "5 min",
            likes: 124,
            comments: 28,
            shares: 42,
            views: 1560,
            isLiked: false,
            isBookmarked: false,
            tags: ["AI", "Web Dev", "Technology"],
            coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          },
          {
            id: 2,
            title: "Mastering React Hooks in 2023",
            excerpt: "A comprehensive guide to using React Hooks effectively in your projects with practical examples.",
            author: "Sarah Miller",
            date: "2023-04-22",
            readTime: "8 min",
            likes: 89,
            comments: 15,
            shares: 23,
            views: 980,
            isLiked: true,
            isBookmarked: true,
            tags: ["React", "JavaScript", "Frontend"],
            coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          },
          {
            id: 3,
            title: "The Complete Guide to CSS Grid",
            excerpt: "Learn how to create complex layouts with CSS Grid through real-world examples and exercises.",
            author: "Michael Chen",
            date: "2023-03-10",
            readTime: "12 min",
            likes: 156,
            comments: 34,
            shares: 67,
            views: 2100,
            isLiked: false,
            isBookmarked: false,
            tags: ["CSS", "Design", "Layout"],
            coverImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          }
        ];

        setFeaturedBlogs(mockData);
        // Initialize interactions state
        const initialInteractions = {};
        mockData.forEach(blog => {
          initialInteractions[blog.id] = {
            isLiked: blog.isLiked,
            isBookmarked: blog.isBookmarked,
            likes: blog.likes
          };
        });
        setInteractions(initialInteractions);
      } catch (err) {
        setError("Failed to load featured blogs. Please try again later.");
        console.error("Error fetching featured blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  const handleLike = (blogId) => {
    setInteractions(prev => ({
      ...prev,
      [blogId]: {
        ...prev[blogId],
        isLiked: !prev[blogId].isLiked,
        likes: prev[blogId].isLiked ? prev[blogId].likes - 1 : prev[blogId].likes + 1
      }
    }));
  };

  const handleBookmark = (blogId) => {
    setInteractions(prev => ({
      ...prev,
      [blogId]: {
        ...prev[blogId],
        isBookmarked: !prev[blogId].isBookmarked
      }
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Featured Blogs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">Featured Blogs</h2>
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Featured Blogs</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Handpicked, trending blogs curated just for you!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredBlogs.map((blog) => (
          <motion.div 
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-indigo-600/90 text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold dark:text-white line-clamp-2">{blog.title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {blog.readTime} read
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>By {blog.author}</span>
                <span>{formatDate(blog.date)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(blog.id)}
                    className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    {interactions[blog.id]?.isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>{interactions[blog.id]?.likes || 0}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{blog.comments}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    <EyeIcon className="h-5 w-5" />
                    <span>{blog.views}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>

                  <button 
                    onClick={() => handleBookmark(blog.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    {interactions[blog.id]?.isBookmarked ? (
                      <BookmarkIconSolid className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md">
          View All Featured Blogs
        </button>
      </div>
    </div>
  );
};

export default FeaturedBlogs;