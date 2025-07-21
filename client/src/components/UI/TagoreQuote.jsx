import React from "react";
import { motion } from "framer-motion";
import tagoreImage from "../../assets/Rabindranath-tagore-WelcomePage.jpg";

const TagoreQuote = () => {
  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.05,
      rotate: 1,
      transition: { duration: 0.3 }
    }
  };

  const floatingVariants = {
    float: {
      y: [-5, 5],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.div
      className="fixed top-[64px] left-0 z-30 flex flex-col items-center ml-4 mt-4"
      initial="hidden"
      animate="visible"
    >
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute -top-2 -left-2 w-16 h-16 rounded-full bg-purple-300/30 dark:bg-purple-600/20 blur-xl"
        variants={quoteVariants}
      />
      
      <motion.div
        className="relative"
        variants={imageVariants}
        whileHover="hover"
        animate="float"
      >
        {/* Portrait glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-300/20 dark:bg-yellow-400/10 blur-md" />
        
        {/* Main portrait */}
        <img
          src={tagoreImage}
          alt="Rabindranath Tagore"
          className="relative z-10 w-28 h-28 object-cover rounded-full border-4 border-white shadow-2xl dark:border-gray-700/80"
        />
        
        {/* Decorative border elements */}
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-300/50 dark:border-purple-500/30 pointer-events-none" />
        <div className="absolute -inset-1 rounded-full border border-purple-200/30 dark:border-purple-700/30 pointer-events-none" />
      </motion.div>

      {/* Quote card */}
      <motion.div
        className="relative mt-4 px-4 py-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg max-w-xs"
        variants={quoteVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        {/* Quote decoration */}
        <div className="absolute top-2 left-2 text-3xl text-gray-300 dark:text-gray-600">“</div>
        <div className="absolute bottom-2 right-2 text-3xl text-gray-300 dark:text-gray-600">”</div>
        
        {/* Quote text */}
        <p className="text-gray-800 dark:text-gray-100 text-sm italic font-medium text-center relative z-10">
          "Let your words be a bridge to the infinite."
        </p>
        {/* Decorative elements */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-300/20 dark:bg-purple-600/10 blur-sm" />
        <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-yellow-300/20 dark:bg-yellow-500/10 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

export default TagoreQuote;