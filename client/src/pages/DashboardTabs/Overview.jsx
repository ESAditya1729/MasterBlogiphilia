import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiBookOpen,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi';

const Overview = () => {
  const stats = [
    {
      title: 'Total Posts',
      value: 48,
      icon: <FiBookOpen className="text-blue-500 text-2xl" />
    },
    {
      title: 'Monthly Views',
      value: '12.4K',
      icon: <FiTrendingUp className="text-green-500 text-2xl" />
    },
    {
      title: 'Subscribers',
      value: 320,
      icon: <FiUsers className="text-purple-500 text-2xl" />
    },
    {
      title: 'Published',
      value: 36,
      icon: <FiCheckCircle className="text-emerald-500 text-2xl" />
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
            <h2 className="text-xl font-bold dark:text-white">{stat.value}</h2>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Overview;
