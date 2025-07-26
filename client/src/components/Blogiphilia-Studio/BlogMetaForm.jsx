import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiType, FiBookmark, FiTag, FiClock, FiEdit } from 'react-icons/fi';

const BlogMetaForm = ({ 
  blogData, 
  setBlogData, 
  errors, 
  darkMode, 
  readingTime,
  activeTab,
  setActiveTab
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
    setBlogData(prev => ({ ...prev, newTag: value }));
  };

  const handleAddTag = () => {
    if (blogData.newTag.trim() && !blogData.tags.includes(blogData.newTag.trim())) {
      setBlogData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Navigation between editor and metadata
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden mb-6 flex border-b">
        <button
          onClick={() => handleTabChange('editor')}
          className={`flex-1 py-2 font-medium ${activeTab === 'editor' ? 
            (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
        >
          <FiEdit className="inline mr-2" />
          Editor
        </button>
        <button
          onClick={() => handleTabChange('metadata')}
          className={`flex-1 py-2 font-medium ${activeTab === 'metadata' ? 
            (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
        >
          <FiType className="inline mr-2" />
          Metadata
        </button>
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <div className="flex items-center mb-3">
            <FiType className={`mr-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            <label htmlFor="title" className={`block text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Blog Title *
            </label>
          </div>
          <motion.div whileHover={{ scale: 1.01 }}>
            <input
              type="text"
              id="title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'border-blue-400 bg-gray-700 text-white focus:border-blue-500' : 'border-blue-300 bg-white text-gray-800 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder="Enter blog title"
            />
          </motion.div>
          <AnimatePresence>
            {errors.title && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Genre Field */}
        <div>
          <div className="flex items-center mb-3">
            <FiBookmark className={`mr-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            <label htmlFor="genre" className={`block text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Genre *
            </label>
          </div>
          <motion.div whileHover={{ scale: 1.01 }}>
            <select
              id="genre"
              name="genre"
              value={blogData.genre}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'border-blue-400 bg-gray-700 text-white focus:border-blue-500' : 'border-blue-300 bg-white text-gray-800 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-all`}
            >
              <option value="">Select a genre</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
            </select>
          </motion.div>
          <AnimatePresence>
            {errors.genre && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.genre}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Tags Field */}
        <div>
          <div className="flex items-center mb-3">
            <FiTag className={`mr-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            <label htmlFor="tags" className={`block text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Tags (no spaces allowed)
            </label>
          </div>
          <div className="flex">
            <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
              <input
                type="text"
                id="newTag"
                value={blogData.newTag}
                onChange={handleTagInputChange}
                className={`w-full p-3 rounded-l-lg border-2 ${darkMode ? 'border-blue-400 bg-gray-700 text-white focus:border-blue-500' : 'border-blue-300 bg-white text-gray-800 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="e.g., react-tutorial"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={handleAddTag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-r-lg transition-all ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : ''}`}
            >
              Add
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <AnimatePresence>
              {blogData.tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                >
                  {tag}
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    whileHover={{ scale: 1.2 }}
                    className={`ml-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    &times;
                  </motion.button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Reading Time */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center mb-2">
            <FiClock className={`mr-2 text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Reading Time
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Estimated reading time
              </p>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {readingTime} min
              </p>
            </div>
            <div className={`text-xs p-2 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              ≈200 words/min
            </div>
          </div>
          <div className="mt-3">
            <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
              <motion.div 
                className={`h-full rounded-full ${readingTime > 10 ? 'bg-red-500' : readingTime > 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(readingTime * 10, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {readingTime > 10 
                ? "Long read (consider breaking into sections)" 
                : readingTime > 5 
                  ? "Medium read" 
                  : "Quick read"}
            </p>
          </div>
        </div>

        {/* SEO Preview (Bonus) */}
        {/* <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            SEO Preview
          </h3>
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm font-semibold truncate ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {blogData.title || "Your blog title will appear here"}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {blogData.genre ? `${blogData.genre.charAt(0).toUpperCase() + blogData.genre.slice(1)} • ` : ''}
              {readingTime} min read • {blogData.tags.slice(0, 3).join(', ')}
            </p>
          </div>
        </div> */}
      </div>
    </motion.div>
  );
};

export default BlogMetaForm;