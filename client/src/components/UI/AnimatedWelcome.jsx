import React from "react";
import { motion } from "framer-motion";

const AnimatedWelcome = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-40 overflow-hidden"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Solid + blurred background */}
      <div className="absolute inset-0 z-0 bg-white dark:bg-gray-900 bg-opacity-95 backdrop-blur-2xl shadow-lg pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 pt-24 pb-12 px-4 text-center">
        <h1 className="relative inline-block text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
          Welcome to Blogiphilia
          <motion.span
            className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />
        </h1>

        <p className="italic text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-4">
          Share your voice. Inspire the world.
        </p>
      </div>

      {/* Bottom fade into scroll */}
      <div className="absolute bottom-0 w-full h-10 z-5 bg-gradient-to-b from-white/90 to-transparent dark:from-gray-900/90 pointer-events-none" />
    </motion.div>
  );
};

export default AnimatedWelcome;
