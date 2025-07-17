import React from 'react';
import { motion } from 'framer-motion';

const AnimatedWelcome = () => {
  return (
    <motion.div
      className="text-center mt-12"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Gradient headline with animated underline */}
      <h1 className="relative inline-block text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
        Welcome to Blogiphilia
        <br/>

        {/* Animated underline */}
        <motion.span
          className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
      </h1>

      {/* Italic subtitle */}
      <p className="italic text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-4">
      </p>
    </motion.div>
  );
};

export default AnimatedWelcome;
