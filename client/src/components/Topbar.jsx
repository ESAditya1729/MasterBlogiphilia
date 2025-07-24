import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Topbar = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Welcome to Blogiphilia!</h1>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
        aria-label="Toggle Theme"
      >
        {mode === "dark" ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-slate-700" />
        )}
      </button>
    </header>
  );
};

export default Topbar;
