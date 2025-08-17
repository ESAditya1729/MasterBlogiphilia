import { motion } from 'framer-motion';

const ErrorMessage = ({ message, darkMode, fullScreen, onRetry }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen flex items-center justify-center' : ''} ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md p-6 text-center"
      >
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorMessage;