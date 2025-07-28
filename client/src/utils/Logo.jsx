import { motion, useAnimation } from "framer-motion";
import { Feather, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Logo = ({ className = "", animateOnMount = true }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (animateOnMount) {
      controls.start({
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      });
    }
  }, [animateOnMount, controls]);

  return (
    <Link to="/" className={`focus:outline-none group ${className}`}>
      <motion.div 
        className="flex items-center cursor-pointer"
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.97 }}
        initial={animateOnMount ? { opacity: 0 } : false}
        animate={controls}
      >
        {/* Blog text with subtle underline effect */}
        <motion.span 
          className="relative text-3xl font-bold text-emerald-500 dark:text-teal-400"
          initial={animateOnMount ? { opacity: 0, x: -10 } : false}
          animate={animateOnMount ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.5 }}
        >
          Blog
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 dark:bg-teal-300 group-hover:w-full transition-all duration-300 ease-out"></span>
        </motion.span>
        
        {/* Feather icon with writing animation */}
        <motion.div
          className="relative mx-1"
          initial={animateOnMount ? { rotate: -45, opacity: 0, y: 5 } : false}
          animate={animateOnMount ? { rotate: -45, opacity: 1, y: 0 } : false}
          transition={{ delay: 0.2, duration: 0.7 }}
          whileHover={{
            rotate: [ -45, -30, -45 ],
            y: [0, -3, 0],
            transition: { duration: 0.6 }
          }}
        >
          <Feather
            size={24}
            className="text-violet-600 dark:text-violet-400"
            strokeWidth={2.5}
          />
          <motion.div 
            className="absolute -right-1 -bottom-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <PenTool 
              size={12} 
              className="text-amber-500 dark:text-amber-400"
              strokeWidth={3}
            />
          </motion.div>
        </motion.div>
        
        {/* "philia" text with staggered letter animation */}
        <motion.div className="flex">
          {['p','h','i','l','i','a'].map((letter, i) => (
            <motion.span
              key={i}
              className="text-3xl font-bold text-violet-600 dark:text-purple-400"
              initial={animateOnMount ? { opacity: 0, y: 10 } : false}
              animate={animateOnMount ? { opacity: 1, y: 0 } : false}
              transition={{ 
                duration: 0.4,
                delay: 0.3 + (i * 0.05)
              }}
              whileHover={{
                y: [0, -2, 0],
                transition: { duration: 0.3 }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default Logo;