import React from "react";
import { motion } from "framer-motion";
import { Sparkles, PenLine, ArrowRight, Badge, Star, Gem } from "lucide-react";

const JoinEarlyWriters = () => {
  const benefits = [
    {
      icon: <Badge className="w-5 h-5 text-amber-500" />,
      text: "Exclusive Founder Badge"
    },
    {
      icon: <Star className="w-5 h-5 text-violet-500" />,
      text: "Priority Access to New Features"
    },
    {
      icon: <Gem className="w-5 h-5 text-emerald-500" />,
      text: "Special Recognition in Community"
    }
  ];

  return (
    <section id="join" className="w-full py-28 px-6 md:px-10 bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-violet-500 blur-3xl"></div>
        <div className="absolute bottom-10 -right-10 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center justify-center gap-2 mb-5 px-4 py-2 bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium shadow-sm border border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm mx-auto w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Founding Writer Program</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight text-center"
        >
          Shape the Future of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Blogiphilia
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed text-center"
        >
          Join our <span className="font-semibold text-violet-700 dark:text-violet-400">exclusive founding writers</span> program. Get early access, special badges, and help build a platform designed <span className="italic">by writers, for writers</span>.
        </motion.p>

        {/* Benefits List */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800/80 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 backdrop-blur-sm"
            >
              {benefit.icon}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {benefit.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex justify-center"
        >
          <motion.a
            href="/signup?founder=true"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-lg"
          >
            <PenLine className="w-5 h-5" />
            <span>Apply as Founding Writer</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mx-auto"
        >
          Limited spots available. Applications reviewed within 48 hours.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default JoinEarlyWriters;