import { motion } from "framer-motion";
import { FiClock, FiHeart, FiBookOpen } from "react-icons/fi";

const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-16'}`}>
    <div className="text-center">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          },
          scale: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1
          }
        }}
        className="inline-block text-5xl text-purple-500 mb-4"
      >
        <FiBookOpen />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-gray-700 dark:text-gray-300"
      >
        Loading your Blogiphilia experience
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 dark:text-gray-400 mt-2"
      >
        Curating the best reading experience for you
      </motion.p>
    </div>
  </div>
);

export default LoadingSpinner;