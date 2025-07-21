import React, { memo } from "react";
import { motion } from "framer-motion";

const leaderboardTabs = [
  { key: "news", label: "Community News", icon: "📰" },
  { key: "challenges", label: "Weekly Challenge", icon: "🎯" },
  { key: "spotlight", label: "Spotlight", icon: "🔦" },
];

const TabMenu = ({ activeTab, setActiveTab, colors }) => {
  return (
    <div className="w-full px-4 mt-4">
      <div className={`relative flex justify-center gap-1 p-1 ${colors.tabBg} backdrop-blur-lg rounded-full shadow-inner`}>
        {/* Animated glow background */}
        <motion.div
          layoutId="glow-bg"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 dark:from-purple-600/30 dark:to-pink-600/30"
          initial={false}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
        
        {leaderboardTabs.map((tab) => (
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
      className={`relative z-20 flex-1 min-w-0`}
    >
      <motion.div
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full ${
          isActive
            ? 'text-white'
            : `${colors.tabText} ${colors.tabHover}`
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.span 
          className="text-xl"
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {tab.icon}
        </motion.span>
        <motion.span 
          className="text-sm font-medium"
          animate={{
            scale: isActive ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {tab.label}
        </motion.span>
      </motion.div>

      {/* Active indicator glow */}
      {isActive && (
        <motion.div
          layoutId="active-glow"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 shadow-sm -z-10"
          initial={false}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      )}
    </button>
  );
});

export default memo(TabMenu);