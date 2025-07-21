import React, { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const lightColors = {
    bg: "bg-white",
    text: "text-gray-700",
    hover: "hover:bg-gray-50",
    active: "bg-gray-50 text-purple-600 font-medium",
    border: "border-gray-200",
    shadow: "shadow-sm shadow-gray-200/50",
    logo: "from-purple-600 to-indigo-600",
    button: "from-fuchsia-500 to-indigo-500",
    icon: "text-indigo-600",
  };

  const darkColors = {
    bg: "bg-gray-800",
    text: "text-gray-300",
    hover: "hover:bg-gray-700/50",
    active: "bg-gray-700/50 text-purple-300 font-medium",
    border: "border-gray-700",
    shadow: "shadow-sm shadow-gray-900/30",
    logo: "from-purple-300 to-indigo-300",
    button: "from-fuchsia-600 to-indigo-600",
    icon: "text-indigo-300",
  };

  const colors = darkMode ? darkColors : lightColors;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="w-full max-w-[100vw] mx-auto px-0">
          <motion.div
            className={`flex justify-between items-center px-4 py-2
              mx-auto w-[95%] max-w-7xl
              ${colors.bg} bg-opacity-90 backdrop-blur-sm
              rounded-full border ${colors.border} ${colors.shadow}
              transition-all duration-300
              ${scrolled ? "py-1.5" : "py-2"}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo */}
            <Link
              to="/home"
              className={`text-2xl font-bold bg-gradient-to-r ${colors.logo} bg-clip-text text-transparent pl-2 hover:opacity-80 transition-opacity`}
            >
              Blogiphilia
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1">
              {["/home", "/blog", "/about", "/contact"].map((path) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200
                    ${
                      isActive(path)
                        ? colors.active
                        : `${colors.text} ${colors.hover}`
                    }`}
                >
                  {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 pr-1">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full focus:outline-none transition-all duration-200 ${colors.hover}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <SunIcon className={`h-5 w-5 ${colors.icon}`} />
                ) : (
                  <MoonIcon className={`h-5 w-5 ${colors.icon}`} />
                )}
              </button>

              <Link
                to="/write"
                className={`hidden md:flex items-center px-3 py-1.5 text-sm font-medium 
                  bg-gradient-to-r ${colors.button} text-white shadow-xs hover:shadow-sm 
                  transition-all duration-200 rounded-lg gap-1`}
              >
                <span>Create</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile Floating Create Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50 md:hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          to="/write"
          className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-3 py-2 rounded-full shadow-sm hover:scale-105 transition-all duration-200 text-sm flex items-center justify-center w-10 h-10"
        >
          ✍️
        </Link>
      </motion.div>
    </>
  );
};

export default Navbar;