import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiGrid, 
  FiSun, 
  FiMoon, 
  FiSettings,
  FiUser
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../../utils/Logo';

const BlogEditorNavbar = () => {
  const { mode, toggleTheme } = useTheme();
  const darkMode = mode === 'dark';
  const navigate = useNavigate();

  return (
    <nav className={`border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} px-4 py-3 shadow-sm transition-colors duration-200 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo and navigation */}
        <div className="flex items-center space-x-6">
          <Logo darkMode={darkMode} className="h-8" />
          
          <div className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group`}
            >
              <FiHome className={`h-5 w-5 transition-transform group-hover:scale-110 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group`}
            >
              <FiGrid className={`h-5 w-5 transition-transform group-hover:scale-110 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Right side - User and settings */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${darkMode ? 'text-gray-200 hover:bg-gray-800 hover:text-yellow-300' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'} hover:rotate-12 hover:scale-110`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            className={`p-2 rounded-full transition-all ${darkMode ? 'text-gray-200 hover:bg-gray-800 hover:text-blue-400' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'} hover:rotate-12 hover:scale-110`}
          >
            <FiSettings className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className={`relative h-10 w-10 rounded-full flex items-center justify-center text-white font-medium cursor-pointer transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} hover:shadow-lg group`}
          >
            <FiUser className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              User Profile
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BlogEditorNavbar;