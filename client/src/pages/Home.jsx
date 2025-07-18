import React, { useState, useRef, useEffect } from "react";
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

const Home = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const contentRef = useRef(null);
  const profileRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end start"],
  });

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

  const scrollToProfile = () => {
    if (profileRef.current) {
      window.scrollTo({
        top: profileRef.current.offsetTop - 300,
        behavior: "smooth",
      });
    }
  };

  const tabContents = {
    leaderboard: {
      title: "Leaderboard",
      icon: "🏆",
      content: Array(10).fill({
        title: "Top Blogger",
        excerpt: "This user has written outstanding posts this week.",
        author: "Star Author",
      }),
    },
    news: {
      title: "Company News",
      icon: "📰",
      content: Array(5).fill({
        title: "Platform Update",
        excerpt: "New features have been released in Blogiphilia!",
        author: "Admin Team",
      }),
    },
  };

  const renderTabContent = () => {
    const currentTab = tabContents[activeTab];

    return (
      <div className="space-y-6" ref={contentRef}>
        <motion.div
          className="sticky top-[180px] z-30 w-full px-4"
          style={{ opacity: headerOpacity, scale: headerScale }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center text-center rounded-xl p-4 mt-4 bg-white/70 dark:bg-gray-900/60 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 blur-xl z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="z-10">
                <span className="text-4xl mb-1 block">{currentTab.icon}</span>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white drop-shadow">
                  {currentTab.title}
                </h2>
                <motion.div
                  className="w-20 h-1 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="space-y-6 pt-6 px-4">
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (profileRef.current) {
      observer.observe(profileRef.current);
    }

    return () => {
      if (profileRef.current) {
        observer.unobserve(profileRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sticky Animated Header */}
      <div className="sticky top-[64px] z-40 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AnimatedWelcome />
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* Scrollable Profile Section */}
      <div
        ref={profileRef}
        className="max-w-7xl mx-auto px-4 py-4 scroll-mt-[144px]"
      >
        {userId && (
          <UserProfileBox
            userId={userId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Tab Content */}
      <div className="w-full px-4 sm:px-8 pb-16">{renderTabContent()}</div>

      {/* Floating Scroll-To-Profile Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            onClick={scrollToProfile}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-110 transition-transform animate-pulse"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            aria-label="Scroll to Profile"
          >
            ⬆️
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
