import React from "react";
import { motion } from "framer-motion";

const TabMenu = ({ activeTab, setActiveTab, colors, isScrolled }) => {
  const tabs = [
    { key: "featured", label: "Featured" },
    { key: "genre", label: "Genres" },
    { key: "saved", label: "Saved" },
    { key: "visited", label: "Recent" },
    { key: "followers", label: "Following" },
  ];

  return (
    <div className={`${isScrolled ? "mt-1" : "mt-6"} flex justify-center`}>
      <div
        className={`flex items-center gap-1 p-1 ${colors.tabBg} backdrop-blur-sm rounded-full shadow-inner`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "text-white"
                : `${colors.tabText} ${colors.tabHover}`
            }`}
          >
            {activeTab === tab.key && (
              <motion.span
                layoutId="glowingTabBg"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-500/30"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            {activeTab === tab.key && (
              <motion.span
                className="absolute inset-0 rounded-full bg-pink-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabMenu;