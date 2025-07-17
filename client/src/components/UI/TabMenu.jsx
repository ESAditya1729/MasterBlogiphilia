import React, { memo } from "react";
import { motion } from "framer-motion";

const tabs = [
  { key: "featured", label: "Featured" },
  { key: "genre", label: "Genres" },
  { key: "saved", label: "Saved" },
  { key: "visited", label: "Recent" },
  { key: "followers", label: "Following" },
];

const TabMenu = ({ activeTab, setActiveTab, colors, isScrolled }) => {
  return (
    <div className={`${isScrolled ? "mt-1" : "mt-6"} flex justify-center will-change-transform`}>
      <div
        className={`flex items-center gap-1 p-1 ${colors.tabBg} backdrop-blur-sm rounded-full shadow-inner`}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            colors={colors}
          />
        ))}
      </div>
    </div>
  );
};

const TabButton = memo(({ tab, isActive, onClick, colors }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 will-change-transform ${
        isActive
          ? "text-white"
          : `${colors.tabText} ${colors.tabHover}`
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="glowingTabBg"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-500/30"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 whitespace-nowrap">
        {tab.label}
      </span>
      {isActive && (
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
  );
});

export default memo(TabMenu);