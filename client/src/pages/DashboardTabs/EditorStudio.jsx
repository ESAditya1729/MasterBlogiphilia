import { motion } from "framer-motion";
import { FiArrowRightCircle, FiEdit, FiAlertTriangle, FiPenTool } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const rules = [
  {
    icon: <FiEdit className="text-blue-500" size={24} />,
    title: "Be Clear and Concise",
    description: "Maintain clarity in your writing. Avoid unnecessary jargon or vague statements.",
    color: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800"
  },
  {
    icon: <FiAlertTriangle className="text-yellow-500" size={24} />,
    title: "Respect Community Guidelines",
    description: "No offensive, political, or sexual content will be tolerated.",
    color: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800"
  },
  {
    icon: <FiPenTool className="text-green-500" size={24} />,
    title: "Word Count",
    description: "Blogs must be between 100 to 3000 words. Stay within this range to ensure readability.",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800"
  },
];

const EditorStudio = () => {
  const navigate = useNavigate();

  const handleLaunchClick = () => {
    navigate("/editor");
  };

  return (
    <div className="w-full py-16 px-6 md:px-10 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Blogiphilia Studio</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your creative space for crafting amazing content that resonates with readers.
          </p>
        </motion.div>

        {/* Rules Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl border ${rule.border} ${rule.color} shadow-sm hover:shadow-md transition-all`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${rule.color.replace('bg-', 'bg-').replace('/20', '/30')} border ${rule.border}`}>
                  {rule.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{rule.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{rule.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLaunchClick}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Launch Blogiphilia Editor 
            <FiArrowRightCircle className="text-2xl" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EditorStudio;