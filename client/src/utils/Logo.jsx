import { motion } from "framer-motion";
import { Feather } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="focus:outline-none">
      <motion.div 
        className="flex items-center space-x-1 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.span 
          className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Blog
        </motion.span>
        
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: -45, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <Feather
            size={24}
            className="text-violet-600 dark:text-violet-400"
            strokeWidth={2.5}
          />
        </motion.div>
        
        <motion.span 
          className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          philia
        </motion.span>
      </motion.div>
    </Link>
  );
};

export default Logo;