import { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'; // Using FiMessageSquare instead of FiBot
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const AskLillyTab = ({ blogData }) => {
  const { mode } = useTheme();
  const darkMode = mode === 'dark';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(input, blogData),
        sender: 'lilly',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Sample response generator
  const generateAIResponse = (query, blog) => {
    const suggestions = [
      `For your blog about "${blog.title || 'this topic'}", consider adding:`,
      `- More examples in the introduction section`,
      `- Relevant statistics to support your claims`,
      `- Clearer transitions between paragraphs`,
      `- A call-to-action at the conclusion`
    ].join('\n');

    const responses = [
      suggestions,
      `I notice you haven't added many ${blog.tags?.length ? 'additional' : ''} tags. ` +
      `Consider adding more relevant tags like "${blog.genre || 'your genre'}-tips".`,
      `Your excerpt could be more compelling. Try starting with a question or surprising fact.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className={`h-full flex flex-col rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Chat Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            <FiMessageSquare className="text-lg" /> {/* Changed from FiBot to FiMessageSquare */}
          </div>
          <div>
            <h3 className="font-medium">Ask Lilly</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your AI writing assistant
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`h-full flex items-center justify-center text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div>
              <p className="font-medium">How can I help with your blog today?</p>
              <p className="text-sm mt-2">Ask me about writing, SEO, or content suggestions</p>
              <div className="mt-6 space-y-2 text-xs">
                <p>Try asking:</p>
                <p>"How can I improve my introduction?"</p>
                <p>"Suggest some tags for this post"</p>
                <p>"Help me make this more engaging"</p>
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
                className={`max-w-[80%] rounded-lg p-4 ${message.sender === 'user'
                  ? darkMode
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-blue-500 text-white rounded-br-none'
                  : darkMode
                  ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                  : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] rounded-lg rounded-bl-none p-4 ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex space-x-2">
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your blog..."
            className={`flex-1 rounded-full px-4 py-3 focus:outline-none ${darkMode 
              ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500' 
              : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-full ${isLoading || !input.trim()
              ? darkMode
                ? 'bg-gray-700 text-gray-500'
                : 'bg-gray-200 text-gray-400'
              : darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors`}
          >
            <FiSend className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskLillyTab;