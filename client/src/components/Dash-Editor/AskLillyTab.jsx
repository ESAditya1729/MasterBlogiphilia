import { useState, useEffect, useRef } from 'react';
import { FiSend, FiFileText, FiX, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const AskLillyTab = ({ blogData }) => {
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Hi there! I'm Lilly, your AI-powered blog writing assistant. I can help you with:\n\n✨ Title suggestions\n✨ Content optimization\n✨ SEO improvements\n✨ Writing tips\n✨ Audience engagement strategies\n\nWhat would you like help with today?",
      sender: 'lilly',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    // Add user message
    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString(),
      ...(filePreview && { attachment: filePreview })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare form data if file exists
      let requestBody = {
        prompt: input,
        blogData: {
          title: blogData?.title,
          category: blogData?.category,
          tags: blogData?.tags
        }
      };

      // Include file content if available
      if (fileContent) {
        requestBody.fileContent = fileContent;
      }

      // Call backend API
      const response = await fetch('/api/assistant/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      
      const aiResponse = {
        id: Date.now() + 1,
        text: data.text,
        sender: 'lilly',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your request. Please try again later or rephrase your question.",
        sender: 'lilly',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setFile(null);
      setFilePreview(null);
      setFileContent('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      inputRef.current?.focus();
    }
  };

  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      
      if (file.type.includes('text') || file.type.includes('pdf')) {
        reader.readAsText(file);
      } else if (file.type.includes('image')) {
        // For images, we'll just use the filename
        resolve(`[Image: ${file.name}]`);
      } else {
        resolve(`[File: ${file.name}]`);
      }
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file size (limit to 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert('Please upload a file smaller than 2MB for optimal performance');
      return;
    }

    try {
      const content = await extractTextFromFile(selectedFile);
      setFileContent(content);
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(selectedFile.name);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error processing file. Please try another file format.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Suggested questions for first-time users
  const suggestedQuestions = [
    "Suggest a catchy title for my blog about " + (blogData?.category || "this topic"),
    "How can I improve my introduction paragraph?",
    "What SEO keywords should I include for better ranking?",
    "Help me make this content more engaging for readers",
    "Can you suggest a better structure for my blog post?"
  ];

  // Features list for help section
  const features = [
    "Title generation & optimization",
    "SEO keyword suggestions",
    "Content structure improvement",
    "Grammar and style enhancements",
    "Audience engagement tips",
    "File analysis (text, PDF, images)"
  ];

  return (
    <div className={`h-full flex flex-col rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Chat Header */}
      <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
            <FiMessageSquare className="text-lg" />
          </div>
          <div>
            <h3 className="font-medium text-lg">Lilly - Blog Assistant</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your AI-powered writing companion
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-purple-400' : 'hover:bg-gray-100 text-purple-600'}`}
          aria-label="Help"
        >
          <FiHelpCircle className="text-lg" />
        </button>
      </div>

      {/* Help Section */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">How to use Lilly</h4>
                <button 
                  onClick={() => setShowHelp(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <FiX />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className={`mr-2 mt-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs italic">
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Tip: You can upload files for me to analyze (text, PDF, or images)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="max-w-md">
              <div className={`p-4 rounded-full mx-auto mb-4 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`} style={{ width: 'fit-content' }}>
                <FiMessageSquare className={`text-3xl mx-auto ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className="font-medium text-lg mb-2">How can I help with your blog today?</h3>
              <p className="text-sm mb-6">Ask me about writing, SEO, or content suggestions</p>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                {suggestedQuestions.map((question, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer text-left ${darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                    } shadow-sm`}
                    onClick={() => {
                      setInput(question);
                      inputRef.current?.focus();
                    }}
                  >
                    <div className="flex items-center">
                      <span className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>💡</span>
                      <span>{question}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 relative ${message.sender === 'user'
                  ? darkMode
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-none'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-br-none'
                  : darkMode
                  ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                  : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {message.attachment && (
                  <div className="mb-3">
                    {typeof message.attachment === 'string' && message.attachment.startsWith('data:image') ? (
                      <div className="relative">
                        <img 
                          src={message.attachment} 
                          alt="Attachment" 
                          className="max-w-full h-auto rounded-lg max-h-48 object-contain border border-gray-300 dark:border-gray-600"
                        />
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-700'}`}>
                          Attachment
                        </div>
                      </div>
                    ) : (
                      <div className={`p-3 rounded-lg flex items-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <FiFileText className="mr-3 flex-shrink-0" />
                        <span className="truncate">{message.attachment}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.text}</div>
                <div className={`absolute bottom-1 right-2 text-xs ${message.sender === 'user' ? 'text-purple-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {message.sender === 'lilly' && (
                  <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    Lilly
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-[85%] rounded-xl rounded-bl-none p-4 ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'} animate-pulse`} style={{ animationDelay: '0ms' }} />
                <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'} animate-pulse`} style={{ animationDelay: '200ms' }} />
                <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'} animate-pulse`} style={{ animationDelay: '400ms' }} />
                <span className="ml-2 text-sm">Lilly is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        {filePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between mb-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-inner`}
          >
            <div className="flex items-center truncate">
              {typeof filePreview === 'string' && filePreview.startsWith('data:image') ? (
                <>
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-300 dark:border-gray-600"
                  />
                  <span className="font-medium">Image ready</span>
                </>
              ) : (
                <>
                  <FiFileText className="mr-3 text-lg flex-shrink-0" />
                  <span className="truncate font-medium">{filePreview}</span>
                </>
              )}
            </div>
            <button 
              onClick={removeFile}
              className={`p-1 rounded-full hover:scale-110 transition-transform ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              aria-label="Remove file"
            >
              <FiX className="text-lg" />
            </button>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for title suggestions, SEO help, or content feedback..."
              className={`w-full rounded-xl px-5 py-3 pr-12 focus:outline-none transition-all ${darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 hover:bg-gray-600' 
                : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 hover:border-gray-400'
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${darkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
              aria-label="Attach file"
            >
              <FiFileText className="text-lg" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx,image/*"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading || (!input.trim() && !file)}
            whileHover={(!isLoading && (input.trim() || file)) ? { scale: 1.05 } : {}}
            whileTap={(!isLoading && (input.trim() || file)) ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl transition-all ${isLoading || (!input.trim() && !file)
              ? darkMode
                ? 'bg-gray-700 text-gray-500'
                : 'bg-gray-200 text-gray-400'
              : darkMode
              ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 shadow-md'
              : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500 shadow-md'
            }`}
            aria-label="Send message"
          >
            <FiSend className="text-lg" />
          </motion.button>
        </form>
        
        <div className={`mt-3 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Lilly may produce inaccurate information. Verify important details.
        </div>
      </div>
    </div>
  );
};

export default AskLillyTab;