import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, PenLine, ArrowRight, LogIn } from "lucide-react";
import TiltCard from "./ThreeD/TiltCard";
import heroImg from "../assets/HeroSec-svg.svg";
import tagoreImg from "../assets/HeroSec-Tagore.png";
import { useAuth } from "../contexts/AuthContext";

const headingLineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.5 },
  }),
};

const FloatTransition = ({ className, depth = 40, duration = 4, delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: 1,
      scale: 1,
      z: depth,
      y: [0, -12, 0],
    }}
    transition={{
      opacity: { delay: delay + 0.6, duration: 0.5 },
      scale: { delay: delay + 0.6, type: "spring", stiffness: 200 },
      z: { delay: delay + 0.6, duration: 0.5 },
      y: { duration, repeat: Infinity, ease: "easeInOut", delay },
    }}
    className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg shadow-slate-900/10 dark:shadow-black/30 border border-white/60 dark:border-slate-700/60 text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`}
  >
    {children}
  </motion.div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrimaryClick = () => {
    navigate("/dashboard");
  };

  const handleExploreClick = () => {
    navigate(user ? "/dashboard" : "/login");
  };

  return (
    <section
      id="home"
      className="relative w-full py-24 md:pb-36 px-6 md:px-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Ambient background: dot grid + drifting gradient orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:26px_26px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-violet-200/50 dark:bg-violet-700/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 35, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] rounded-full bg-emerald-200/50 dark:bg-emerald-700/15 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 relative z-10">
                Take Flight
              </span>
              <span className="absolute left-0 bottom-0 h-1 bg-violet-400 w-full group-hover:scale-x-100 scale-x-0 origin-left transition-transform duration-300 z-0"></span>
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

          {/* Rabindranath Tagore Quote */}
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
            <motion.button
              onClick={handlePrimaryClick}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/30 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Become a Blogiphilian
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleExploreClick}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full border border-violet-500 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-800/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {user ? <BookOpen className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              Explore Blogs
            </motion.button>
          </div>
        </motion.div>

        {/* Right: 3D Illustration Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 relative flex justify-center [perspective:1400px]"
        >
          {/* Glow pedestal behind illustration */}
          <div className="absolute inset-x-10 bottom-0 h-24 bg-gradient-to-t from-violet-300/40 dark:from-violet-800/25 to-transparent blur-2xl rounded-full" aria-hidden="true" />

          <TiltCard maxTilt={9} scale={1} lift={0} glare={false} className="rounded-3xl">
            <img
              src={heroImg}
              alt="Blogging Illustration"
              className="w-[90%] max-w-md md:max-w-lg drop-shadow-2xl"
              loading="lazy"
            />
          </TiltCard>

          {/* Floating glass badges at different depths */}
          <FloatTransition className="-top-4 left-2 md:left-6" depth={70} duration={4.2}>
            <PenLine className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            Write Daily
          </FloatTransition>
          <FloatTransition className="top-1/3 -right-2 md:right-2" depth={110} duration={5} delay={0.8}>
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Get Inspired
          </FloatTransition>
          <FloatTransition className="-bottom-4 left-6 md:left-14" depth={55} duration={4.6} delay={1.4}>
            <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            100+ Stories
          </FloatTransition>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
