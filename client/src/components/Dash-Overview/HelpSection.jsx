import { motion } from "framer-motion";
import { FiHelpCircle } from "react-icons/fi";

export const HelpSection = () => (
  <motion.div
    className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
  >
    <h3 className="text-xl font-semibold dark:text-white mb-4 flex items-center">
      <FiHelpCircle className="mr-2 text-blue-500" />
      Need Help?
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Explore our documentation or contact support for assistance.
    </p>
    <button className="w-full py-2 px-4 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
      Get Help
    </button>
  </motion.div>
);