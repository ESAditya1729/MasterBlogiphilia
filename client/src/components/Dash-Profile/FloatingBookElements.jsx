import { motion } from "framer-motion";
import { FiBookOpen, FiFeather, FiBookmark, FiStar, FiPenTool } from "react-icons/fi";

const FloatingBookElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Book Icon - Enhanced floating effect with subtle glow */}
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ 
        opacity: [0.08, 0.15, 0.08], 
        y: [0, -15, 0],
        rotate: [0, 3, 0]
      }}
      transition={{ 
        duration: 18, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute top-1/4 left-10 text-purple-300/70 dark:text-purple-800/50 text-7xl"
    >
      <FiBookOpen />
    </motion.div>

    {/* Feather Icon - Smoother movement with depth effect */}
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ 
        opacity: [0.05, 0.15, 0.05], 
        x: [0, 15, 0],
        rotate: [0, -5, 0]
      }}
      transition={{ 
        duration: 14, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: 1.5 
      }}
      className="absolute bottom-1/3 right-20 text-indigo-300/60 dark:text-indigo-800/40 text-6xl"
    >
      <FiFeather />
    </motion.div>

    {/* Bookmark Icon - More organic movement */}
    <motion.div 
      initial={{ opacity: 0, rotate: -45 }}
      animate={{ 
        opacity: [0.1, 0.2, 0.1], 
        rotate: [-45, -35, -45],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: 0.8 
      }}
      className="absolute top-40 right-1/4 text-pink-300/50 dark:text-pink-800/30 text-8xl"
    >
      <FiBookmark />
    </motion.div>

    {/* New: Star Icon - Additional decorative element */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.05, 0.12, 0.05],
        scale: [0.8, 1, 0.8],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute top-1/2 left-1/4 text-yellow-300/40 dark:text-yellow-600/30 text-5xl"
    >
      <FiStar />
    </motion.div>

    {/* New: Pen Tool Icon - Additional decorative element */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.05, 0.1, 0.05],
        y: [0, 10, 0],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
      className="absolute bottom-20 left-1/3 text-blue-300/50 dark:text-blue-800/30 text-6xl"
    >
      <FiPenTool />
    </motion.div>

    {/* Subtle background gradient elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <motion.div 
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-purple-100/20 dark:bg-purple-900/10 blur-3xl"
      />
      <motion.div 
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5
        }}
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-100/20 dark:bg-blue-900/10 blur-3xl"
      />
    </div>
  </div>
);

export default FloatingBookElements;