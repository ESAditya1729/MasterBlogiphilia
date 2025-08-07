import { motion } from "framer-motion";
import { FiPenTool, FiFeather, FiBookOpen } from "react-icons/fi";

const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-16'}`}>
    <div className="text-center space-y-6">
      <motion.div 
        className="relative h-20 w-20 mx-auto"
        animate={{
          rotate: 360,
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }
        }}
      >
        {/* Outer circle with writing tools */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            opacity: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
        >
          <FiPenTool className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
          <FiFeather className="absolute right-0 top-1/2 -translate-y-1/2 text-pink-400 text-xl" />
          <FiBookOpen className="absolute top-0 left-1/2 -translate-x-1/2 text-purple-400 text-xl" />
        </motion.div>
        
        {/* Central animated dot */}
        <motion.div 
          className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">
          Crafting your Blogiphilia experience
        </h3>
        <motion.p
          className="text-gray-600 dark:text-gray-400 max-w-md mx-auto"
          animate={{
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {[
            "Preparing the perfect writing environment...",
            "Gathering inspiration for your next post...",
            "Setting up a distraction-free space..."
          ][Math.floor(Math.random() * 3)]}
        </motion.p>
      </motion.div>

      {/* Progress indicator */}
      <motion.div 
        className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-xs mx-auto mt-6"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
          animate={{
            width: ["0%", "100%"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  </div>
);

export default LoadingSpinner;