import { motion } from "framer-motion";
import { FiBookOpen, FiFeather, FiBookmark } from "react-icons/fi";
import { Link } from "react-router-dom";
import logoImage from "../../assets/BlogiphiliaLogo.png";

const FloatingBookElements = () => (
  <>
    {/* 🏷️ Logo Badge - Enhanced with subtle glow and smoother transition */}
    <div className="fixed top-4 right-4 z-50">
      <Link to="/" aria-label="Go to homepage">
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center overflow-hidden"
        >
          <img
            src={logoImage}
            alt="Blogiphilia Logo"
            className="w-full h-full object-contain transition-transform duration-300 hover:rotate-3"
            draggable="false"
          />
        </motion.div>
      </Link>
    </div>

    {/* ✨ Floating Decorations - Improved animations and visibility */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Book Icon - More subtle floating effect */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ 
          opacity: [0.08, 0.15, 0.08], 
          y: [0, -15, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-10 text-purple-300/70 dark:text-purple-800/50 text-7xl"
      >
        <FiBookOpen />
      </motion.div>

      {/* Feather Icon - Smoother horizontal movement */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        animate={{ 
          opacity: [0.05, 0.15, 0.05], 
          x: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1.5 
        }}
        className="absolute bottom-1/3 right-20 text-indigo-300/60 dark:text-indigo-800/40 text-6xl"
      >
        <FiFeather />
      </motion.div>

      {/* Bookmark Icon - More organic rotation */}
      <motion.div 
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1], 
          rotate: [-45, -35, -45],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.8 
        }}
        className="absolute top-40 right-1/4 text-pink-300/50 dark:text-pink-800/30 text-8xl"
      >
        <FiBookmark />
      </motion.div>
    </div>
  </>
);

export default FloatingBookElements;