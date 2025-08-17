import { 
  FiEdit2, 
  FiFileText, 
  FiMessageSquare, 
  FiEye,
  FiBook,
  FiBookOpen 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const BlogEditorTabs = ({ activeTab, setActiveTab }) => {
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    {
      id: 'contents',
      label: 'Contents',
      icon: <FiEdit2 size={16} />,
      activeColor: 'text-white',
      inactiveColor: 'text-blue-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      darkBgColor: 'bg-gradient-to-r from-blue-600 to-blue-700'
    },
    {
      id: 'metadata',
      label: 'Metadata', 
      icon: <FiFileText size={16} />,
      activeColor: 'text-white',
      inactiveColor: 'text-purple-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      darkBgColor: 'bg-gradient-to-r from-purple-600 to-purple-700'
    },
    {
      id: 'askLilly',
      label: 'Ask Lilly',
      icon: <FiMessageSquare size={16} />,
      activeColor: 'text-white',
      inactiveColor: 'text-indigo-500',
      bgColor: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      darkBgColor: 'bg-gradient-to-r from-indigo-600 to-indigo-700'
    },
    // {
    //   id: 'preview',
    //   label: 'Preview',
    //   icon: <FiEye size={16} />,
    //   activeColor: 'text-white',
    //   inactiveColor: 'text-orange-500',
    //   bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
    //   darkBgColor: 'bg-gradient-to-r from-orange-600 to-orange-700'
    // }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative -mt-6">
      {/* Extended hanging line with subtle shadow */}
      <motion.div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 z-10 ${
          darkMode ? 'bg-gray-600 shadow-gray-800' : 'bg-gray-300 shadow-gray-200'
        }`}
        initial={{ height: 48 }}
        animate={{ 
          height: isCollapsed ? 24 : 48,
          transition: { 
            type: "spring", 
            damping: 10, 
            stiffness: 200,
            delay: isCollapsed ? 0.3 : 0
          }
        }}
      />

      {/* Elegant toggle button */}
      <motion.button
        onClick={toggleCollapse}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
          darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        } transition-all duration-200`}
        style={{ marginTop: '24px' }}
        animate={{ 
          y: isCollapsed ? 0 : 24,
          transition: { 
            type: "spring", 
            damping: 10, 
            stiffness: 300 
          }
        }}
      >
        <motion.div
          animate={{ 
            rotate: isCollapsed ? 0 : 180,
            scale: isCollapsed ? 1 : [1, 1.2, 1]
          }}
          transition={{ duration: 0.4 }}
          className={`text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } transition-transform duration-200`}
        >
          {isCollapsed ? (
            <FiBook size={20} className="stroke-[2.5px]" />
          ) : (
            <FiBookOpen size={20} className="stroke-[2.5px]" />
          )}
        </motion.div>
      </motion.button>

      {/* Modern tabs container */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              transition: { 
                staggerChildren: 0.1,
                when: "beforeChildren",
                duration: 0.4,
                ease: "backOut"
              } 
            }}
            exit={{ 
              opacity: 0, 
              y: -30,
              scale: 0.95,
              transition: { 
                duration: 0.3,
                ease: "easeIn",
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
              }
            }}
            className="flex justify-center gap-3 pt-20 pb-3"
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: index * 0.05
                  }
                }}
                exit={{
                  y: -40,
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.25,
                    ease: "easeIn"
                  }
                }}
              >
                <motion.button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsCollapsed(true);
                  }}
                  whileHover={{ 
                    y: -4,
                    scale: 1.05,
                    boxShadow: darkMode 
                      ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
                      : '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center px-4 py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? `${darkMode ? tab.darkBgColor : tab.bgColor} shadow-lg`
                      : darkMode
                      ? 'bg-gray-700/70 hover:bg-gray-600/80 border border-gray-600/50'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: activeTab === tab.id ? [1, 1.1, 1] : 1,
                      rotate: activeTab === tab.id ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.6 }}
                    className="mr-2"
                  >
                    <span className={
                      activeTab === tab.id 
                        ? tab.activeColor 
                        : tab.inactiveColor
                    }>
                      {tab.icon}
                    </span>
                  </motion.div>
                  <span className={`text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-white'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>
                    {tab.label}
                  </span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogEditorTabs;