import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Layout/Header";
import AnimatedWelcome from "../components/UI/AnimatedWelcome";
import UserProfileBox from "../components/UI/UserProfileBox";
import GenreDropdown from "../components/Layout/tabs/GenreSelector";

const Home = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const contentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.97]);

  const token = localStorage.getItem("authToken");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id;
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  const tabContents = {
    featured: {
      title: "Featured Blogs",
      icon: "🌟",
      content: Array(15).fill({
        title: "Featured Blog Post",
        excerpt:
          "This is a featured blog post about interesting topics that everyone should read.",
        author: "Featured Writer",
      }),
    },
    genre: {
      title: `${selectedGenre} Blogs`,
      icon: "🏷️",
      content: Array(10).fill({
        title: `${selectedGenre} Blog Post`,
        excerpt: `This is a specialized ${selectedGenre.toLowerCase()} blog post.`,
        author: `${selectedGenre} Expert`,
      }),
    },
    saved: {
      title: "Saved Blogs",
      icon: "💾",
      content: Array(8).fill({
        title: "Saved Blog Post",
        excerpt: "You saved this blog post for later reading.",
        author: "Your Favorite Author",
      }),
    },
    visited: {
      title: "Recently Visited",
      icon: "🕒",
      content: Array(12).fill({
        title: "Recently Viewed Blog",
        excerpt: "You recently viewed this blog post.",
        author: "Popular Writer",
      }),
    },
    followers: {
      title: "Following Blogs",
      icon: "👥",
      content: Array(5).fill({
        title: "Blog from Someone You Follow",
        excerpt: "This blog post is from someone in your network.",
        author: "Followed Author",
      }),
    },
  };

  const renderTabContent = () => {
    const currentTab = tabContents[activeTab];

    return (
      <div className="space-y-6" ref={contentRef}>
        {/* Sticky Tab Header */}
        <motion.div
          className="sticky top-[320px] z-30 w-full py-4 -mx-4"
          style={{
            y: headerY,
            opacity: headerOpacity,
            scale: headerScale,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent dark:from-gray-900/90 dark:via-gray-900/80 dark:to-transparent backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50" />

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + selectedGenre}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl mb-1">{currentTab.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentTab.title}
                </h2>
                <motion.div
                  className="w-20 h-1 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {currentTab.content.map((item, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -2 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {item.title} #{index + 1}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {item.excerpt}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {item.author}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sticky Header Block (Welcome + Profile + Optional Dropdown) */}
      <div className="sticky top-[64px] z-40 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
          <AnimatedWelcome />
          {userId && (
            <UserProfileBox
              userId={userId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "genre" && (
            <GenreDropdown
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16 relative">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Home;
