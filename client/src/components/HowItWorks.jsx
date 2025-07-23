import React from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Users,
  UploadCloud,
  Star,
  BadgeCheck,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    title: "Join Our Community",
    icon: <Users className="w-5 h-5" />,
    description: "Create your account in 30 seconds and customize your profile",
    color: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    stepColor: "bg-indigo-600"
  },
  {
    title: "Craft Your Story",
    icon: <Pencil className="w-5 h-5" />,
    description: "Use our distraction-free editor with markdown support",
    color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    stepColor: "bg-purple-600"
  },
  {
    title: "Publish & Amplify",
    icon: <UploadCloud className="w-5 h-5" />,
    description: "Share your work with our global community of readers",
    color: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    stepColor: "bg-blue-600"
  },
  {
    title: "Earn Recognition",
    icon: <BadgeCheck className="w-5 h-5" />,
    description: "Achieve milestones and unlock exclusive badges",
    color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    stepColor: "bg-emerald-600"
  },
  {
    title: "Build Your Legacy",
    icon: <Star className="w-5 h-5" />,
    description: "Grow your audience and establish your authority",
    color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    stepColor: "bg-amber-600"
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-24 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Blogging Journey</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From first-time writer to established voice — we're with you at every step
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-amber-500/20 dark:from-indigo-600/20 dark:via-purple-600/20 dark:to-amber-600/20 top-1/4 left-8 right-8 -z-10" />

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className={`group relative rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${step.border} backdrop-blur-sm bg-white/70 dark:bg-slate-800/70`}
              >
                {/* Step indicator */}
                <div className={`absolute -top-3 -left-3 ${step.stepColor} text-white text-xs font-medium px-3 py-1 rounded-full shadow-md flex items-center justify-center`}>
                  <span>0{index + 1}</span>
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Icon container */}
                <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;