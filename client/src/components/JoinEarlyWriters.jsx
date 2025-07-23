import React from "react";
import { motion } from "framer-motion";
import { Sparkles, PenLine, ArrowRight } from "lucide-react";

const JoinEarlyWriters = () => {
  return (
    <section id= "join" className="w-full py-28 px-6 md:px-10 bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 relative overflow-hidden">
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
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileFocusWithin={{ scale: 1.02 }}
            className="w-full sm:w-80"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-5 py-3.5 rounded-full border border-gray-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition shadow-sm backdrop-blur-sm"
              required
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            <span>Join as Founder</span>
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center"
        >
          We respect your privacy. Unsubscribe anytime.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default JoinEarlyWriters;