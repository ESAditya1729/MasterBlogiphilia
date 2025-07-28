import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/HeroSec-svg.svg";
import tagoreImg from "../assets/HeroSec-Tagore.png";

const headingLineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.5 },
  }),
};

const HeroSection = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/dashboard");
  };

  return (
    <section
      id="home"
      className="w-full py-24 md:pb-36 px-6 md:px-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 text-center md:text-left relative"
        >
          {/* Multiline Heading with staggered animation */}
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={headingLineVariants}
              className="relative inline-flex group"
            >
              <span className="relative z-10">Where Thoughts</span>
              <span className="absolute left-0 bottom-0 h-1 bg-emerald-400 w-full group-hover:scale-x-100 scale-x-0 origin-left transition-transform duration-300 z-0"></span>
            </motion.span>
            <br />
            <motion.span
              custom={1}
              initial="hidden"
              animate="visible"
              variants={headingLineVariants}
              className="relative inline-flex group"
            >
              <span className="relative z-10">Take Flight</span>
              <span className="absolute left-0 bottom-0 h-1 bg-emerald-400 w-full group-hover:scale-x-100 scale-x-0 origin-left transition-transform duration-300 z-0"></span>
            </motion.span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Welcome to{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              Blogiphilia
            </span>{" "}
            — a vibrant platform to express, explore, and engage. Discover
            amazing blogs or start writing your own.
          </p>

          {/* Rabindranath Tagore Quote - now below paragraph */}
          <div className="flex items-center justify-center md:justify-start space-x-3 mt-2">
            <img
              src={tagoreImg}
              alt="Rabindranath Tagore"
              className="w-10 h-10 rounded-full border-2 border-violet-500 shadow-md"
            />
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-sm italic text-gray-700 dark:text-gray-300"
            >
              "Let your life lightly dance on the edges of Time like dew on the
              tip of a leaf."
            </motion.p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-4">
            <button 
              onClick={handleButtonClick}
              className="px-6 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all duration-200"
            >
              Become a Blogiphilian
            </button>
            <button className="px-6 py-3 rounded-full border border-violet-500 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-800/20 transition-all duration-200">
              Explore Blogs
            </button>
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={heroImg}
            alt="Blogging Illustration"
            className="w-[90%] max-w-md md:max-w-lg"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;