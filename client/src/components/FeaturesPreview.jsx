import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  "Unlimited publishing with zero restrictions",
  "Build your personal brand with customizable profiles",
  "Engage with a thoughtful community of readers and writers",
  "Early access to monetization and partnership programs",
  "Exclusive badges and featured placements for top content",
  "Advanced analytics to track your content's performance",
  "Priority support and writing mentorship opportunities",
  "Cross-promotion with our partner publications"
];

const FeaturesPreview = () => {
  return (
    <section id="Feature" className="w-full py-24 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            Elevate Your Writing with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Blogiphilia
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A creator-first platform designed to help writers at every stage of their journey
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }
                }
              }}
              whileHover={{
                x: 5,
                transition: { duration: 0.2 }
              }}
              className="flex items-start gap-4 p-5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/30 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {item}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle decorative elements */}
        <div className="absolute left-0 right-0 -bottom-20 h-40 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default FeaturesPreview;