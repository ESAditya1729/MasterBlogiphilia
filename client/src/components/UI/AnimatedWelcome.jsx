import React from "react";
import { motion } from "framer-motion";

const AnimatedWelcome = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: [0.17, 0.67, 0.83, 0.67],
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, rotate: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: [0.8, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "anticipate",
      },
    },
  };

  const text = "Welcome to Blogiphilia";
  const letters = text.split("");

  return (
    <motion.div
      className="sticky top-[64px] z-40 w-full flex justify-center pointer-events-none overflow-visible"
      variants={headingVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-baseline">
        {/* Left decorative dots */}
        <motion.div 
          className="flex items-center mr-4"
          variants={dotVariants}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 mx-1"></span>
          <span className="w-3 h-3 rounded-full bg-indigo-500 mx-1"></span>
          <span className="w-2 h-2 rounded-full bg-pink-500 mx-1"></span>
        </motion.div>

        {/* Main text */}
        <h1 className="text-5xl font-bold leading-[1.2] pt-1 pb-1 whitespace-nowrap text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-auto">
          {letters.map((letter, index) => (
            <motion.span key={index} className="inline-block" variants={letterVariants}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </h1>

        {/* Right decorative dots */}
        <motion.div 
          className="flex items-center ml-4"
          variants={dotVariants}
        >
          <span className="w-2 h-2 rounded-full bg-pink-500 mx-1"></span>
          <span className="w-3 h-3 rounded-full bg-purple-500 mx-1"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-500 mx-1"></span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedWelcome;
