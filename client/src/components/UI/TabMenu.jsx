import React, { memo } from "react";
import { motion } from "framer-motion";

const leaderboardTabs = [
  { key: "leaderboard", label: "Leaderboard" },
  { key: "news", label: "Company News" },
];

const TabMenu = ({ activeTab, setActiveTab, colors, isScrolled }) => {
  return (
    <div className={`${isScrolled ? "mt-1" : "mt-6"} flex justify-center`}>
      <div
        className={`flex items-center gap-1 p-1 ${colors.tabBg} backdrop-blur-sm rounded-full shadow-inner`}
      >
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
      className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
        isActive ? "text-white" : `${colors.tabText} ${colors.tabHover}`
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="glowingTabBg"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-md"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
    </button>
  );
});

export default memo(TabMenu);
