import { motion } from "framer-motion";
import { FiBookOpen, FiPenTool, FiAward } from "react-icons/fi";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => (
  <motion.div 
    className="flex border-b border-gray-200 dark:border-gray-700"
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: { staggerChildren: 0.1 }
      }
    }}
  >
    <motion.button
      variants={tabVariants}
      onClick={() => setActiveTab("posts")}
      className={`flex-1 py-4 px-2 text-center font-medium flex items-center justify-center gap-2 ${
        activeTab === "posts"
          ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500"
          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      <FiBookOpen />
      <span>Posts</span>
    </motion.button>

    {isOwnProfile && (
      <motion.button
        variants={tabVariants}
        onClick={() => setActiveTab("drafts")}
        className={`flex-1 py-4 px-2 text-center font-medium flex items-center justify-center gap-2 ${
          activeTab === "drafts"
            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        <FiPenTool />
        <span>Drafts</span>
      </motion.button>
    )}

    <motion.button
      variants={tabVariants}
      onClick={() => setActiveTab("achievements")}
      className={`flex-1 py-4 px-2 text-center font-medium flex items-center justify-center gap-2 ${
        activeTab === "achievements"
          ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-500"
          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      <FiAward />
      <span>Achievements</span>
    </motion.button>
  </motion.div>
);

export default ProfileTabs;