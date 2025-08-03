import { useState, useRef, useEffect } from 'react';
import { 
  FiBold, FiItalic, FiUnderline, FiLink, 
  FiImage, FiAlignLeft, FiAlignCenter, 
  FiAlignRight, FiList, FiAlignJustify,
  FiCode, FiMinus, FiType, FiX, FiCheck
} from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

// Custom divider component for consistent styling
const Divider = () => (
  <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />
);

// Button group component for better organization
const ButtonGroup = ({ children }) => (
  <div className="flex items-center space-x-1">{children}</div>
);

const Toolbar = ({ editor }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const emojiPickerRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsEmojiPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  // Editor actions
  const toggleMark = (mark) => editor.chain().focus().toggleMark(mark).run();
  const setAlignment = (align) => editor.chain().focus().setTextAlign(align).run();
  const toggleList = (type) => editor.chain().focus()[`toggle${type === 'bullet' ? 'Bullet' : 'Ordered'}List`]().run();
  const addHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
  const addCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const addHeading = (level) => editor.chain().focus().toggleHeading({ level }).run();

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setIsLinkModalOpen(false);
      setLinkUrl('');
    }
  };

  const addImageByUrl = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setIsImageModalOpen(false);
      setImageUrl('');
    }
  };

  const addEmoji = (emojiData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-1 py-2">
          {/* Text Formatting */}
          <ButtonGroup>
            <button
              onClick={() => toggleMark('bold')}
              className={`toolbar-btn ${editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Bold"
            >
              <FiBold className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleMark('italic')}
              className={`toolbar-btn ${editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Italic"
            >
              <FiItalic className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleMark('underline')}
              className={`toolbar-btn ${editor.isActive('underline') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Underline"
            >
              <FiUnderline className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* Headings */}
          <ButtonGroup>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => addHeading(level)}
                className={`toolbar-btn ${editor.isActive('heading', { level }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
                aria-label={`Heading ${level}`}
              >
                <span className="font-semibold">H{level}</span>
              </button>
            ))}
          </ButtonGroup>

          <Divider />

          {/* Alignment */}
          <ButtonGroup>
            <button
              onClick={() => setAlignment('left')}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Align left"
            >
              <FiAlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Align center"
            >
              <FiAlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment('right')}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Align right"
            >
              <FiAlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment('justify')}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Justify"
            >
              <FiAlignJustify className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* Lists & Blocks */}
          <ButtonGroup>
            <button
              onClick={() => toggleList('bullet')}
              className={`toolbar-btn ${editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Bullet list"
            >
              <FiList className="w-4 h-4" />
            </button>
            <button
              onClick={addHorizontalRule}
              className="toolbar-btn"
              aria-label="Horizontal rule"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <button
              onClick={addCodeBlock}
              className={`toolbar-btn ${editor.isActive('codeBlock') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Code block"
            >
              <FiCode className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* Media */}
          <ButtonGroup>
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className={`toolbar-btn ${editor.isActive('link') ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
              aria-label="Add link"
            >
              <FiLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="toolbar-btn"
              aria-label="Add image"
            >
              <FiImage className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="toolbar-btn"
                aria-label="Add emoji"
              >
                <span className="text-sm">😊</span>
              </button>
              {isEmojiPickerOpen && (
                <div ref={emojiPickerRef} className="absolute z-50 mt-1 left-0">
                  <EmojiPicker 
                    onEmojiClick={addEmoji} 
                    width={300} 
                    height={400}
                    skinTonesDisabled
                    searchDisabled={false}
                  />
                </div>
              )}
            </div>
          </ButtonGroup>
        </div>
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Add Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
              <button 
                onClick={addLink}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                disabled={!linkUrl}
              >
                <FiCheck className="inline mr-1" /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Add Image</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
              <button 
                onClick={addImageByUrl}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                disabled={!imageUrl}
              >
                <FiCheck className="inline mr-1" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;