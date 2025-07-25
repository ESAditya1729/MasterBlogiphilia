import React, { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import Logo from "../utils/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 md:px-8 md:py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="focus:outline-none">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {["Home", "About", "Contact"].map((label) => (
            <Link
              key={label}
              onClick={() => window.scrollTo(0, 0)}
              to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
              className="px-4 py-2 text-sm font-medium rounded-full border border-transparent hover:border-emerald-500 dark:hover:border-emerald-400 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center space-x-4 ml-4">
            <Link
              to="/signup"
              className="px-4 py-1.5 rounded-full border border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition-all duration-200"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-violet-500/30"
            >
              Login
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
              aria-label="Toggle theme"
            >
              {mode === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-600" />
            )}
          </button>
          
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
            {["Home", "About", "Contact"].map((label) => (
              <Link
                key={label}
                to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-center font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {label}
              </Link>
            ))}

            <div className="flex flex-col w-full space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-medium hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 transition"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition shadow-md"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;