import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSettings, 
  FiUsers, 
  FiBarChart2, 
  FiBookmark, 
  FiChevronLeft, 
  FiMenu, 
  FiSun, 
  FiMoon,
  FiUser,
  FiLogOut,
  FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../utils/Logo';

const Sidebar = ({ 
  isCollapsed, 
  toggleCollapse, 
  activeTab, 
  setActiveTab 
}) => {
  const { mode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview', icon: <FiFileText />, label: 'Overview' },
    { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    { id: 'content', icon: <FiBookmark />, label: 'Content' },
    { id: 'audience', icon: <FiUsers />, label: 'Audience' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ 
        width: isCollapsed ? 80 : 240,
        borderRight: mode === 'dark' 
          ? '1px solid rgba(99, 102, 241, 0.2)' 
          : '1px solid rgba(99, 102, 241, 0.1)'
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`relative flex flex-col h-full ${
        mode === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-white'
      } shadow-xl z-10`}
    >
      {/* Animated border highlight */}
      <motion.div 
        className="absolute top-0 right-0 h-full w-0.5 bg-indigo-500"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.8, 0],
          transition: { duration: 3, repeat: Infinity }
        }}
      />

      {/* Collapse bar on top */}
      <div className={`flex items-center justify-between p-3 border-b ${
        mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
      }`}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <Logo mode={mode} size="small" />
          </motion.div>
        )}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-1 rounded-md cursor-pointer ${
            mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <FiMenu className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          ) : (
            <FiChevronLeft className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          )}
        </motion.div>
      </div>

      {/* Enhanced Profile Section */}
      <div className={`p-4 ${isCollapsed ? 'pt-2' : ''}`}>
        <motion.div 
          className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-row items-center'} gap-3`}
          whileHover={{ 
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="relative group">
            {(() => {
              const storedUser = JSON.parse(localStorage.getItem('user'));
              const currentUser = storedUser || user;
              const hasImage = currentUser?.profilePicture;
              
              return (
                <>
                  {hasImage ? (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      src={currentUser.profilePicture}
                      alt={currentUser.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg cursor-pointer"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer shadow-lg"
                    >
                      {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                    </motion.div>
                  )}
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {currentUser?.username || 'User'}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          
          {!isCollapsed && (() => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const currentUser = storedUser || user;
            
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 overflow-hidden"
              >
                <h3 className={`font-bold text-sm truncate ${
                  mode === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {currentUser?.username || 'User Name'}
                </h3>
                <p className={`text-xs ${
                  mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } truncate`}>
                  {currentUser?.email || 'admin@example.com'}
                </p>
              </motion.div>
            );
          })()}
        </motion.div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3"
          >
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: mode === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(74, 222, 128, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold ${
                mode === 'dark' ? 'text-green-300' : 'text-green-600'
              }`}
            >
              <span>View Profile</span>
              <FiExternalLink size={14} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Animated separator */}
      <motion.div 
        className={`w-full h-px mx-auto my-2 ${
          mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      />

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ 
              translateX: 5,
              backgroundColor: mode === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(74, 222, 128, 0.1)'
            }}
            whileTap={{ 
              scale: 0.98,
              backgroundColor: mode === 'dark' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.2)'
            }}
            className={`flex items-center px-3 py-3 rounded-lg mx-1 cursor-pointer ${
              activeTab === item.id 
                ? mode === 'dark' 
                  ? 'bg-green-900/30 text-green-300' 
                  : 'bg-green-100 text-green-700'
                : mode === 'dark' 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className={`text-lg ${
              activeTab === item.id 
                ? mode === 'dark' 
                  ? 'text-green-300' 
                  : 'text-green-600'
                : mode === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-500'
            }`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  fontWeight: activeTab === item.id ? 700 : 600
                }}
                transition={{ delay: 0.1 }}
                className={`ml-3 text-sm ${
                  activeTab === item.id 
                    ? 'font-bold' 
                    : 'font-semibold'
                }`}
              >
                {item.label}
              </motion.span>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </div>
            )}
          </motion.div>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className={`p-3 border-t ${
        mode === 'dark' ? 'border-gray-800' : 'border-gray-100'
      }`}>
        {/* Theme Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
            mode === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={toggleTheme}
        >
          <div className="flex items-center">
            {mode === 'dark' ? (
              <FiMoon className="text-lg text-green-300" />
            ) : (
              <FiSun className="text-lg text-yellow-500" />
            )}
            {!isCollapsed && (
              <span className={`ml-3 text-sm font-semibold ${
                mode === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </div>
        </motion.div>

        {/* Profile/Logout */}
        {!isCollapsed && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-2 flex items-center p-2 rounded-lg cursor-pointer ${
              mode === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-red-400' 
                : 'bg-gray-50 hover:bg-gray-100 text-red-500'
            }`}
            onClick={logout}
          >
            <FiLogOut className="text-lg" />
            <span className={`ml-3 text-sm font-semibold ${
              mode === 'dark' ? 'text-red-400' : 'text-red-500'
            }`}>Logout</span>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;