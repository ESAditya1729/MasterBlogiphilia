import React from "react";

const LevelBar = ({ userLevel }) => {
  return (
    <div className="flex items-center gap-1 mb-1 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i < userLevel
              ? "bg-gradient-to-b from-indigo-500 to-purple-500"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default LevelBar;