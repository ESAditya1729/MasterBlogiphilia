import React from "react";
import { motion } from "framer-motion";
import {
  PenTool,
  Users,
  Sparkles,
  HeartHandshake,
  Lightbulb,
} from "lucide-react";

// Feature data
const featureData = [
  {
    title: "Express Yourself",
    icon: <PenTool className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
    description: "Share your voice through blogs, ideas, and storytelling.",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    title: "Engage with Community",
    icon: <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    description: "Connect with readers, writers, and creative thinkers.",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Discover Perspectives",
    icon: <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    description: "Explore a wide range of topics and insights.",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Grow as a Writer",
    icon: <HeartHandshake className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
    description: "Learn, improve, and build your digital presence.",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    title: "Inspire the World",
    icon: <Lightbulb className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
    description: "Motivate others through your stories and wisdom.",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
  },
];

// Animation config
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

const WhyBlogiphilia = () => {
  const centerFeature = featureData[0]; // Express Yourself
  const leftFeatures = featureData.slice(1, 3); // Engage + Discover
  const rightFeatures = featureData.slice(3, 5); // Grow + Inspire

  return (
    <section
      id="why-blogiphilia"
      className="w-full pt-36 pb-20 scroll-mt-28 px-6 md:px-10 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why{" "}
          <span className="text-violet-600 dark:text-violet-400">
            Blogiphilia
          </span>
          ?
        </motion.h2>
        <motion.p 
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Because your words matter — and we've built the perfect home for them.
        </motion.p>
      </div>

      <motion.div 
        className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left column (2 boxes) */}
        <div className="flex flex-col gap-8 w-full lg:w-1/4">
          {leftFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`${feature.bgColor} border border-transparent hover:border-emerald-300/40 dark:hover:border-emerald-400/30 shadow-lg hover:shadow-emerald-300/30 rounded-2xl p-6 text-center hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Center Feature Box */}
        <motion.div
          className={`${centerFeature.bgColor} border-2 border-violet-400 shadow-xl hover:shadow-violet-400/40 rounded-3xl p-8 text-center w-full lg:w-[32%] mt-10 lg:mt-24 hover:scale-[1.03] transition-all duration-300`}
          variants={item}
        >
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-md">
              {centerFeature.icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">{centerFeature.title}</h3>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {centerFeature.description}
          </p>
        </motion.div>

        {/* Right column (2 boxes) */}
        <div className="flex flex-col gap-8 w-full lg:w-1/4">
          {rightFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`${feature.bgColor} border border-transparent hover:border-emerald-300/40 dark:hover:border-emerald-400/30 shadow-lg hover:shadow-emerald-300/30 rounded-2xl p-6 text-center hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyBlogiphilia;