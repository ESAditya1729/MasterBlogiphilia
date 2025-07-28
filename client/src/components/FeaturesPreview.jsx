import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, PenTool, Users, BarChart, Badge, Zap, MessageSquare, Share2 } from "lucide-react";

const features = [
  {
    text: "Unlimited publishing with zero restrictions",
    icon: <PenTool className="w-5 h-5" />
  },
  {
    text: "Build your personal brand with customizable profiles",
    icon: <Users className="w-5 h-5" />
  },
  {
    text: "Engage with a thoughtful community of readers and writers",
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    text: "Early access to monetization and partnership programs",
    icon: <Zap className="w-5 h-5" />
  },
  {
    text: "Exclusive badges and featured placements for top content",
    icon: <Badge className="w-5 h-5" />
  },
  {
    text: "Advanced analytics to track your content's performance",
    icon: <BarChart className="w-5 h-5" />
  },
  {
    text: "Priority support and writing mentorship opportunities",
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    text: "Cross-promotion with our partner publications",
    icon: <Share2 className="w-5 h-5" />
  }
];

const FeaturesPreview = () => {
  return (
    <section id="features" className="w-full py-24 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    mass: 0.5
                  }
                }
              }}
              whileHover={{
                y: -5,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }
              }}
              className="flex items-start gap-4 p-6 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/80 hover:border-indigo-300/50 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'bg-purple-100/70 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'} flex-shrink-0`}>
                {item.icon}
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute left-0 right-0 -bottom-20 h-40 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none z-0" />
      </div>
    </section>
  );
};

export default FeaturesPreview;