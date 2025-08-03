// src/components/Dash-Editor/BlogEditorTabs.jsx
import { 
  FiEdit2, 
  FiFileText, 
  FiMessageSquare, 
  FiSearch, 
  FiEye, 
  FiSliders,
  FiBook,
  FiBookOpen 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const BlogEditorTabs = ({ activeTab, setActiveTab }) => {
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const [isCollapsed, setIsCollapsed] = useState(false); // Changed to false for expanded by default

  const tabs = [
    {
      id: 'contents',
      label: 'Contents',
      icon: <FiEdit2 size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-blue-500',
      bgColor: 'bg-blue-500',
      darkBgColor: 'bg-blue-600'
    },
    {
      id: 'metadata',
      label: 'Metadata', 
      icon: <FiFileText size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-purple-500',
      bgColor: 'bg-purple-500',
      darkBgColor: 'bg-purple-600'
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: <FiSearch size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-green-500',
      bgColor: 'bg-green-500',
      darkBgColor: 'bg-green-600'
    },
    {
      id: 'style', 
      label: 'Style',
      icon: <FiSliders size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-pink-500',
      bgColor: 'bg-pink-500',
      darkBgColor: 'bg-pink-600'
    },
    {
      id: 'askLilly',
      label: 'Ask Lilly',
      icon: <FiMessageSquare size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500',
      darkBgColor: 'bg-indigo-600'
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: <FiEye size={20} />,
      activeColor: 'text-white',
      inactiveColor: 'text-orange-500',
      bgColor: 'bg-orange-500',
      darkBgColor: 'bg-orange-600'
    }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative -mt-6">
      {/* Animated vine stem */}
      <motion.div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 z-10 ${
          darkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}
        initial={{ height: 44 }}
        animate={{ 
          height: isCollapsed ? 24 : 44,
          transition: { 
            type: "spring", 
            damping: 10, 
            stiffness: 200,
            delay: isCollapsed ? 0.3 : 0
          }
        }}
      />

      {/* Toggle button with book icons */}
      <motion.button
        onClick={toggleCollapse}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full shadow-md ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        style={{ marginTop: '12px' }}
        animate={{ 
          y: isCollapsed ? 0 : 20,
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
          className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {isCollapsed ? (
            <FiBook size={20} className="stroke-[2.5px]" /> // Closed book icon
          ) : (
            <FiBookOpen size={20} className="stroke-[2.5px]" /> // Open book icon
          )}
        </motion.div>
      </motion.button>

      {/* Tabs container - now visible by default */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }} // Changed to start visible
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
            className="flex justify-center gap-3 pt-20 pb-2"
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.id}
                initial={{ y: 0, opacity: 1, scale: 1 }} // Changed to start visible
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
                    y: -5,
                    scale: 1.05,
                    boxShadow: darkMode 
                      ? '0 5px 15px rgba(0, 0, 0, 0.3)' 
                      : '0 5px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center px-4 py-3 rounded-2xl transition-all ${
                    activeTab === tab.id
                      ? darkMode
                        ? `${tab.darkBgColor} shadow-lg`
                        : `${tab.bgColor} shadow-md`
                      : darkMode
                      ? 'bg-gray-700/70 hover:bg-gray-600/80'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: activeTab === tab.id ? [1, 1.2, 1] : 1,
                      rotate: activeTab === tab.id ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.6 }}
                    className="p-3 rounded-full mb-2"
                  >
                    <span className={
                      activeTab === tab.id 
                        ? tab.activeColor 
                        : tab.inactiveColor
                    }>
                      {tab.icon}
                    </span>
                  </motion.div>
                  <span className={`text-xs font-medium ${
                    activeTab === tab.id
                      ? 'text-white'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {index < tabs.length - 1 && (
                    <motion.div 
                      className={`absolute -right-4 top-1/2 w-4 h-0.5 ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      initial={{ scaleX: 1 }} // Changed to start visible
                      animate={{ 
                        scaleX: 1,
                        transition: { delay: 0.2 + (index * 0.05) }
                      }}
                      exit={{ scaleX: 0 }}
                    />
                  )}
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