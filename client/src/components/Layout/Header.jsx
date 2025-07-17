import React, { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";

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
    hover: "hover:bg-gray-100",
    active: "bg-gray-100 text-purple-600 font-semibold",
    border: "border-gray-200",
    shadow: "shadow-lg shadow-gray-300/50",
    logo: "from-purple-600 to-indigo-600",
    button: "from-fuchsia-500 to-indigo-500",
    icon: "text-indigo-600",
  };

  const darkColors = {
    bg: "bg-gray-800",
    text: "text-gray-300",
    hover: "hover:bg-gray-700",
    active: "bg-gray-700 text-white font-semibold",
    border: "border-gray-700",
    shadow: "shadow-lg shadow-gray-900/50",
    logo: "from-purple-300 to-indigo-300",
    button: "from-fuchsia-600 to-indigo-600",
    icon: "text-indigo-300",
  };

  const colors = darkMode ? darkColors : lightColors;

  return (
    <>
      {/* Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="w-full max-w-[100vw] mx-auto px-0">
          <div
            className={`flex justify-between items-center px-6 py-3
              mx-auto w-[95%] max-w-7xl
              ${colors.bg} bg-opacity-90 backdrop-blur-md
              rounded-full border ${colors.border} ${colors.shadow}
              transition-all duration-300
              ${scrolled ? "py-2" : "py-4"}`}
          >
            {/* Logo */}
            <div className="flex-shrink-0 pl-6">
              <Link
                to="/home"
                className={`text-3xl font-extrabold bg-gradient-to-r ${colors.logo} bg-clip-text text-transparent`}
              >
                Blogiphilia
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-4">
              {["/home", "/blog", "/about", "/contact"].map((path) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-6 py-3 text-base transition-all duration-300
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

            {/* Dark Mode Toggle & Create Button */}
            <div className="flex items-center space-x-4 pr-6">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg focus:outline-none transition-all duration-300 ${colors.hover}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <SunIcon className={`h-6 w-6 ${colors.icon}`} />
                ) : (
                  <MoonIcon className={`h-6 w-6 ${colors.icon}`} />
                )}
              </button>

              <Link
                to="/write"
                className={`hidden md:inline-block px-6 py-3 text-base font-medium 
                  bg-gradient-to-r ${colors.button} text-white shadow-md hover:shadow-lg 
                  transition-all duration-300 rounded-lg`}
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating Create Button */}
      <Link
        to="/write"
        className="fixed bottom-6 right-6 z-50 md:hidden bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
      >
        ✍️
      </Link>
    </>
  );
};

export default Navbar;
