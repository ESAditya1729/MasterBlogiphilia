import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import SearchBar from "../SearchBar";

export const SearchSection = () => (
  <motion.div
    className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
  >
    <h3 className="text-xl font-semibold dark:text-white mb-6 flex items-center">
      <FiSearch className="mr-2 text-blue-500" />
      Search Users
    </h3>
    <SearchBar placeholder="Search by username..." />
  </motion.div>
);