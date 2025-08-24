// DashboardTabs/ContentManagement.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEye, FiClock, FiCalendar, FiBook } from "react-icons/fi";

const ContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample data - replace with your API call
  useEffect(() => {
    // Simulate API fetch
    const fetchBlogs = async () => {
      try {
        // This would be your actual API call
        // const response = await fetch('/api/blogs/published');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockBlogs = [
          {
            id: 1,
            title: "Getting Started with React",
            excerpt: "Learn the basics of React and how to create your first component",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            category: "Technology",
            readTime: 5,
            publishedDate: "2023-06-15",
            views: 1245
          },
          {
            id: 2,
            title: "Advanced CSS Techniques",
            excerpt: "Discover modern CSS techniques to enhance your web designs",
            image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
            category: "Design",
            readTime: 8,
            publishedDate: "2023-07-02",
            views: 987
          },
          {
            id: 3,
            title: "The Future of Web Development",
            excerpt: "Exploring the upcoming trends in web development for 2023 and beyond",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
            category: "Technology",
            readTime: 12,
            publishedDate: "2023-07-10",
            views: 1567
          },
          {
            id: 4,
            title: "Building Scalable APIs",
            excerpt: "Best practices for creating APIs that can grow with your application",
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            category: "Development",
            readTime: 10,
            publishedDate: "2023-07-18",
            views: 845
          },
          {
            id: 5,
            title: "UX Design Principles",
            excerpt: "Essential UX principles that every designer should know",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            category: "Design",
            readTime: 7,
            publishedDate: "2023-07-22",
            views: 1123
          },
          {
            id: 6,
            title: "JavaScript Performance Tips",
            excerpt: "Optimize your JavaScript code for better performance",
            image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80",
            category: "Development",
            readTime: 9,
            publishedDate: "2023-07-25",
            views: 1342
          }
        ];
        
        setBlogs(mockBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get unique categories for filter
  const categories = ["all", ...new Set(blogs.map(blog => blog.category))];

  // Filter blogs by category
  const filteredBlogs = selectedCategory === "all" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
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
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {selectedCategory !== "all" 
              ? `Try selecting a different category or publish some ${selectedCategory} content.`
              : "You haven't published any blogs yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            {blog.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            {new Date(blog.publishedDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            {blog.readTime} min read
          </div>
          <div className="flex items-center">
            <FiEye className="mr-1" />
            {blog.views.toLocaleString()}
          </div>
        </div>
      </div>
      
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors">
          View Details
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ContentManagement;