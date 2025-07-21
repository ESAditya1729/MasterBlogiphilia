import React from "react";
import { motion } from "framer-motion";

const InfoCard = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl p-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
