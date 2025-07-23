import React, { useState } from 'react';
import { Menu, X, Feather } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 md:px-8 md:py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Blog
          </span>
          <Feather
            size={24}
            className="text-violet-600 dark:text-violet-400 transform -rotate-45"
            strokeWidth={2.5}
          />
          <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            philia
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {['Home', 'About', 'Contact'].map((label) => (
            <a
              key={label}
              href="#"
              className="px-4 py-2 text-sm font-medium rounded-full border border-transparent hover:border-emerald-500 dark:hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
            >
              {label}
            </a>
          ))}

          <div className="flex items-center space-x-4 ml-4">
            <button className="px-4 py-1.5 rounded-full border border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition-all duration-200">
              Sign Up
            </button>

            <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-violet-500/30">
              Login
            </button>

            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <span className="text-yellow-400">☀️</span>
              ) : (
                <span className="text-purple-400">🌙</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 animate-fadeIn bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg p-4 shadow-lg dark:shadow-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center space-y-3">
            {['Home', 'Library', 'About', 'Contact'].map((label) => (
              <a
                key={label}
                href="#"
                className="w-full py-2.5 text-center font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="flex flex-col w-full space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full py-2.5 rounded-full border border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition">
                Sign Up
              </button>

              <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition shadow-md">
                Login
              </button>

              <button
                onClick={() => setDarkMode(prev => !prev)}
                className="w-full py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Switch to {darkMode ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
