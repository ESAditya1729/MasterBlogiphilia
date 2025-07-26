import { motion } from "framer-motion";

export const OverviewHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Welcome to Blogiphilia
    </h1>
    <motion.div
      className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
      style={{ width: "fit-content" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    />
  </motion.div>
);