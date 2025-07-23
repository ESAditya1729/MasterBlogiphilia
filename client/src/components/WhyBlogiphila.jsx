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
  },
  {
    title: "Engage with Community",
    icon: <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
    description: "Connect with readers, writers, and creative thinkers.",
  },
  {
    title: "Discover Perspectives",
    icon: <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
    description: "Explore a wide range of topics and insights.",
  },
  {
    title: "Grow as a Writer",
    icon: <HeartHandshake className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
    description: "Learn, improve, and build your digital presence.",
  },
  {
    title: "Inspire the World",
    icon: <Lightbulb className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
    description: "Motivate others through your stories and wisdom.",
  },
];

// Animation config
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const WhyBlogiphilia = () => {
  const centerFeature = featureData[0]; // Express Yourself
  const leftFeatures = featureData.slice(1, 3); // Engage + Discover
  const rightFeatures = featureData.slice(3, 5); // Grow + Inspire

  return (
    <section id="why-blogiphilia" className="w-full py-20 px-6 md:px-10 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why <span className="text-violet-600 dark:text-violet-400">Blogiphilia</span>?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Because your words matter — and we’ve built the perfect home for them.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10">
        {/* Left column (2 boxes) */}
        <div className="flex flex-col gap-6 w-full lg:w-1/4">
          {leftFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-emerald-300/40 dark:border-emerald-400/30 shadow-lg hover:shadow-emerald-300/30 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Center Feature Box */}
        <motion.div
          className="bg-white dark:bg-slate-900 border-2 border-emerald-400 shadow-xl hover:shadow-emerald-400/40 rounded-3xl p-8 text-center w-full lg:w-[32%] mt-10 lg:mt-24 hover:scale-[1.03] transition-transform duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4">{centerFeature.icon}</div>
          <h3 className="text-2xl font-bold mb-3">{centerFeature.title}</h3>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {centerFeature.description}
          </p>
        </motion.div>

        {/* Right column (2 boxes) */}
        <div className="flex flex-col gap-6 w-full lg:w-1/4">
          {rightFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-emerald-300/40 dark:border-emerald-400/30 shadow-lg hover:shadow-emerald-300/30 rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBlogiphilia;
