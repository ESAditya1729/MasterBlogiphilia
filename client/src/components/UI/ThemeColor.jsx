export const getThemeColors = (darkMode) => {
  return darkMode
    ? {
        bg: "bg-gradient-to-br from-gray-800 to-gray-900",
        text: "text-gray-100",
        border: "border-gray-700",
        shadow: "shadow-lg shadow-black/30",
        stats: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent",
        card: "bg-gray-800",
        button: "bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white",
        tabBg: "bg-gray-800/50",
        tabText: "text-gray-300",
        tabHover: "hover:text-white",
      }
    : {
        bg: "bg-gradient-to-br from-white to-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
        shadow: "shadow-lg shadow-gray-300/30",
        stats: "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
        card: "bg-white",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
        tabBg: "bg-gray-100/50",
        tabText: "text-gray-600",
        tabHover: "hover:text-gray-900",
      };
};