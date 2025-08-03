import { Link } from 'react-router-dom';
import { FiHome, FiGrid, FiEdit2, FiCopy, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../utils/Logo';
import { motion } from 'framer-motion';

const PostNavbar = ({ darkMode, isCopied, copyBlogUrl }) => {
  const { user } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md py-3`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          {/* Logo on the very left */}
          <div className="flex-shrink-0">
            <Logo darkMode={darkMode} className="h-8" />
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              <FiHome className="text-lg" />
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              <FiGrid className="text-lg" />
              <span>Dashboard</span>
            </Link>
            {user && (
              <Link 
                to="/editor" 
                className={`flex items-center space-x-2 ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
              >
                <FiEdit2 className="text-lg" />
                <span>Editor</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Right-side buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${darkMode ? 'text-gray-200 hover:bg-gray-700 hover:text-yellow-300' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          
          {/* Copy URL Button */}
          <button 
            onClick={copyBlogUrl}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <FiCopy className="text-lg" />
            <span>{isCopied ? 'Copied!' : 'Copy URL'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostNavbar;