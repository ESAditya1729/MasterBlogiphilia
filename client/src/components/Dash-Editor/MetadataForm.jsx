import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// ============================================================================
// COMPONENT: FloatingLabelInput 
// Reusable input component with floating label and validation
// ============================================================================
const FloatingLabelInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  error, 
  maxLength, 
  helpText,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <label 
          htmlFor={id}
          className={`text-xs font-medium ${
            isFocused ? 'text-blue-600 dark:text-blue-400' : 
            error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {label}
        </label>
        {maxLength && (
          <span className={`text-xs ${
            value.length > maxLength * 0.9 ? 'text-amber-500' : 
            value.length > maxLength * 0.7 ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      
      <input
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full border px-4 pt-4 pb-3 rounded-xl bg-white dark:bg-gray-900 ${
          error ? 'border-red-500 focus:ring-red-500' : 
          isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-opacity-30 transition-all`}
        {...props}
      />
      
      {helpText && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {helpText}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT: TagInput
// Input for managing tags with suggestions
// ============================================================================
const TagInput = ({ 
  id, 
  label, 
  values = [], 
  setValues, 
  maxItems = 5, 
  error, 
  placeholder = "Type and press Enter...",
  suggestions = []
}) => {
  const [input, setInput] = useState('');
  const inputRef = React.useRef(null);

  const addValue = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && values.length < maxItems && !values.includes(trimmedInput)) {
      setValues([...values, trimmedInput]);
      setInput('');
    }
  };

  const removeValue = (val) => {
    setValues(values.filter(v => v !== val));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
        <span className="text-xs text-gray-400">
          {values.length} / {maxItems} used
        </span>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap mb-2 min-h-10">
        {values.map((val) => (
          <div
            key={val}
            className="flex items-center gap-1 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white px-3 py-1 rounded-full text-sm"
          >
            {val}
            <XCircle
              className="w-4 h-4 cursor-pointer hover:text-blue-800 dark:hover:text-blue-200"
              onClick={() => removeValue(val)}
            />
          </div>
        ))}
      </div>
      
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ''}
        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-900 ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30`}
      />
      
      {error && (
        <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT: FieldTab
// Individual tab component for each form field
// ============================================================================
const FieldTab = ({ 
  field, 
  isActive, 
  onClick, 
  hasError,
  icon
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
        isActive
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : `border-transparent ${hasError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-gray-700 dark:hover:text-gray-300`
      }`}
    >
      <span className="text-lg">{icon}</span>
      {field}
    </button>
  );
};

// ============================================================================
// COMPONENT: MetadataForm
// Main form component with tabbed fields
// ============================================================================
const MetadataForm = ({
  title = '',
  excerpt = '',
  genre = '',
  tags = [],
  seoKeywords = [],
  setTitle,
  setExcerpt,
  setGenre,
  setTags,
  setSeoKeywords,
  errors = {}
}) => {
  // Field tabs configuration
  const fieldTabs = [
    {
      id: 'title',
      label: 'Blog Title',
      icon: '📝',
      component: (
        <FloatingLabelInput
          id="title"
          label="Blog Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          error={errors.title}
          helpText="Make it catchy and descriptive"
        />
      )
    },
    {
      id: 'excerpt',
      label: 'Excerpt',
      icon: '✏️',
      component: (
        <FloatingLabelInput
          id="excerpt"
          label="Excerpt *"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={200}
          error={errors.excerpt}
          helpText="Brief summary of your post"
        />
      )
    },
    {
      id: 'genre',
      label: 'Genre',
      icon: '🏷️',
      component: (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Genre *
          </div>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
          >
            <option value="">Select a genre</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          {errors.genre && (
            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              {errors.genre}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: '🔖',
      component: (
        <TagInput
          id="tags"
          label="Tags"
          values={tags}
          setValues={setTags}
          maxItems={5}
          error={errors.tags}
          placeholder="Add up to 5 tags..."
        />
      )
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: '🔍',
      component: (
        <div className="space-y-4">
          <TagInput
            id="seoKeywords"
            label="SEO Keywords"
            values={seoKeywords}
            setValues={setSeoKeywords}
            maxItems={10}
            error={errors.seoKeywords}
            placeholder="Add SEO keywords..."
          />
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <div className="font-medium">SEO Tips:</div>
            <ul className="mt-1 space-y-1">
              <li>• Use keywords naturally in your content</li>
              <li>• Include 3-5 primary keywords</li>
              <li>• Add long-tail keyword phrases</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const [activeTab, setActiveTab] = useState(fieldTabs[0].id);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Field Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
        {fieldTabs.map((tab) => (
          <FieldTab
            key={tab.id}
            field={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            hasError={errors[tab.id]}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      
      {/* Active Field Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {fieldTabs.find(tab => tab.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MetadataForm;