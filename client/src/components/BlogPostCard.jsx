import { motion } from "framer-motion";
import { FiClock, FiHeart, FiBookOpen } from "react-icons/fi";

const BlogPostCard = ({ post }) => (
  <motion.div 
    className="h-full bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600"
    whileHover={{ 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
    }}
  >
    {post.coverImage && (
      <div className="h-40 overflow-hidden">
        <motion.img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    )}
    
    <div className="p-5">
      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {post.excerpt}
      </p>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <FiClock className="mr-1" />
          <span>{post.readTime}</span>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <FiHeart className="mr-1" />
          <span>{post.likes}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default BlogPostCard;