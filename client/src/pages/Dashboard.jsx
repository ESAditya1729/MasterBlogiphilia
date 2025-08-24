import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Overview from "./DashboardTabs/Overview";
import EditorStudio from "./DashboardTabs/EditorStudio";
import ContentManagement from "./DashboardTabs/ContentManagement";
import {
  FiHelpCircle,
  FiEdit,
  FiPieChart,
  FiFileText,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const tabConfig = {
    overview: {
      title: "Overview",
      icon: <FiFileText className="mr-2" />,
      description: "Get a quick summary of your content",
    },
    analytics: {
      title: "Analytics Dashboard",
      icon: <FiPieChart className="mr-2" />,
      description: "Track your content performance",
    },
    content: {
      title: "Content Management",
      icon: <FiFileText className="mr-2" />,
      description: "Organize and manage all your posts",
    },
    audience: {
      title: "Audience Insights",
      icon: <FiUsers className="mr-2" />,
      description: "Understand your readers better",
    },
    settings: {
      title: "Settings",
      icon: <FiSettings className="mr-2" />,
      description: "Configure your workspace",
    },
  };

  const currentTab = tabConfig[activeTab] || {
    title: activeTab,
    icon: <FiFileText className="mr-2" />,
    description: "Content will appear here",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 flex flex-col items-center justify-center px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              {currentTab.icon}
              <h1 className="text-xl font-semibold dark:text-white">
                {currentTab.title}
              </h1>
            </div>
            <motion.p
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentTab.description}
            </motion.p>
            <motion.span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-green-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>

          {/* Help button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          >
            <FiHelpCircle className="text-lg dark:text-white" />
          </motion.div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === "overview" ? (
                <Overview />
              ) : activeTab === "studio" ? (
                <EditorStudio />
              ) : activeTab === "content" ? ( // Add this condition
                <ContentManagement />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    {currentTab.icon}
                    <h2 className="text-xl font-semibold dark:text-white">
                      {currentTab.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentTab.description}
                  </p>

                  <motion.div
                    className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeTab === "analytics" &&
                        "Your analytics dashboard will show engagement metrics, traffic sources, and reader demographics."}
                      {activeTab === "content" &&
                        "Manage all your published and draft posts in one organized location."}
                      {activeTab === "audience" &&
                        "See detailed information about your readers including location, devices, and reading habits."}
                      {activeTab === "settings" &&
                        "Customize your dashboard appearance, notifications, and account settings."}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
