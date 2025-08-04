import { useState, useRef, useEffect } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiImage,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiAlignJustify,
  FiCode,
  FiMinus,
  FiType,
  FiX,
  FiCheck,
  FiDroplet,
  FiPenTool,
} from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { HexColorPicker } from "react-colorful";

/**
 * Divider component for separating toolbar button groups
 */
const Divider = () => (
  <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />
);

/**
 * ButtonGroup component to group related toolbar buttons
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 */
const ButtonGroup = ({ children }) => (
  <div className="flex items-center space-x-1">{children}</div>
);

/**
 * ModalButton component for consistent modal buttons
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.variant="primary"] - Button variant (primary/secondary)
 */
const ModalButton = ({
  onClick,
  children,
  disabled = false,
  variant = "primary",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md flex items-center ${
      variant === "primary"
        ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
);

/**
 * Main Toolbar component for the editor
 * @param {Object} props - Component props
 * @param {Object} props.editor - Tiptap editor instance
 */
const Toolbar = ({ editor }) => {
  // State for modal visibility and input values
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentHighlight, setCurrentHighlight] = useState("#FFFF00");

  // Refs for handling click outside
  const emojiPickerRef = useRef(null);
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);

  // Effect to handle click outside of pickers and modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setIsEmojiPickerOpen(false);
      }
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setIsColorPickerOpen(false);
      }
      if (
        highlightPickerRef.current &&
        !highlightPickerRef.current.contains(event.target)
      ) {
        setIsHighlightPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Return null if editor is not available
  if (!editor) return null;

  /**
   * Toggle text mark (bold, italic, underline)
   * @param {string} mark - Mark type to toggle
   */
  const toggleMark = (mark) => editor.chain().focus().toggleMark(mark).run();

  /**
   * Set text alignment
   * @param {string} align - Alignment value (left, center, right, justify)
   */
  const setAlignment = (align) =>
    editor.chain().focus().setTextAlign(align).run();

  /**
   * Toggle list type
   * @param {string} type - List type (bullet or ordered)
   */
  const toggleList = (type) =>
    editor
      .chain()
      .focus()
      [`toggle${type === "bullet" ? "Bullet" : "Ordered"}List`]()
      .run();

  /**
   * Add horizontal rule to the editor
   */
  const addHorizontalRule = () =>
    editor.chain().focus().setHorizontalRule().run();

  /**
   * Toggle code block
   */
  const addCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  /**
   * Toggle heading level
   * @param {number} level - Heading level (1-6)
   */
  const addHeading = (level) =>
    editor.chain().focus().toggleHeading({ level }).run();

  /**
   * Add link to selected text
   */
  const addLink = () => {
    if (linkUrl) {
      // If text is selected, set link to that text
      if (editor.view.state.selection.empty) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setIsLinkModalOpen(false);
      setLinkUrl("");
    }
  };

  /**
   * Add image by URL
   */
  const addImageByUrl = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: "User uploaded image" })
        .run();
      setIsImageModalOpen(false);
      setImageUrl("");
    }
  };

  /**
   * Add emoji at current cursor position
   * @param {Object} emojiData - Emoji data from picker
   */
  const addEmoji = (emojiData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setIsEmojiPickerOpen(false);
  };

  /**
   * Set text color
   * @param {string} color - Hex color value
   */
  const setTextColor = (color) => {
    setCurrentColor(color);
    editor.chain().focus().setColor(color).run();
  };

  /**
   * Set highlight color
   * @param {string} color - Hex color value
   */
  const setHighlightColor = (color) => {
    setCurrentHighlight(color);
    editor.chain().focus().setHighlight({ color }).run();
  };

  /**
   * Reset text or highlight color
   * @param {string} type - Type to reset ('text' or 'highlight')
   */
  const resetColor = (type) => {
    if (type === "text") {
      editor.chain().focus().unsetColor().run();
      setCurrentColor("#000000");
    } else {
      editor.chain().focus().unsetHighlight().run();
      setCurrentHighlight("#FFFF00");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-1 py-2">
          {/* TEXT FORMATTING BUTTONS */}
          <ButtonGroup>
            <button
              onClick={() => toggleMark("bold")}
              className={`toolbar-btn ${
                editor.isActive("bold")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Bold"
            >
              <FiBold className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleMark("italic")}
              className={`toolbar-btn ${
                editor.isActive("italic")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Italic"
            >
              <FiItalic className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleMark("underline")}
              className={`toolbar-btn ${
                editor.isActive("underline")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Underline"
            >
              <FiUnderline className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* HEADING BUTTONS */}
          <ButtonGroup>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => addHeading(level)}
                className={`toolbar-btn ${
                  editor.isActive("heading", { level })
                    ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                aria-label={`Heading ${level}`}
              >
                <span className="font-semibold">H{level}</span>
              </button>
            ))}
          </ButtonGroup>

          <Divider />

          {/* ALIGNMENT BUTTONS */}
          <ButtonGroup>
            <button
              onClick={() => setAlignment("left")}
              className={`toolbar-btn ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Align left"
            >
              <FiAlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment("center")}
              className={`toolbar-btn ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Align center"
            >
              <FiAlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment("right")}
              className={`toolbar-btn ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Align right"
            >
              <FiAlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAlignment("justify")}
              className={`toolbar-btn ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Justify"
            >
              <FiAlignJustify className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* LIST & BLOCK BUTTONS */}
          <ButtonGroup>
            <button
              onClick={() => toggleList("bullet")}
              className={`toolbar-btn ${
                editor.isActive("bulletList")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
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
              className={`toolbar-btn ${
                editor.isActive("codeBlock")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
              aria-label="Code block"
            >
              <FiCode className="w-4 h-4" />
            </button>
          </ButtonGroup>

          <Divider />

          {/* COLOR PICKERS */}
          <ButtonGroup>
            {/* TEXT COLOR PICKER */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorPickerOpen(!isColorPickerOpen);
                  setIsHighlightPickerOpen(false);
                  // Get current color if text is selected
                  if (editor.isActive("textStyle")) {
                    setCurrentColor(
                      editor.getAttributes("textStyle").color || "#000000"
                    );
                  }
                }}
                className={`toolbar-btn ${
                  editor.isActive("textStyle")
                    ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                aria-label="Text color"
              >
                <FiDroplet className="w-4 h-4" />
              </button>
              {isColorPickerOpen && (
                <div
                  ref={colorPickerRef}
                  className="absolute z-50 mt-1 left-0 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HexColorPicker
                    color={currentColor}
                    onChange={setTextColor}
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetColor("text");
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Reset
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsColorPickerOpen(false);
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* HIGHLIGHT COLOR PICKER */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHighlightPickerOpen(!isHighlightPickerOpen);
                  setIsColorPickerOpen(false);
                  // Get current highlight if text is selected
                  if (editor.isActive("highlight")) {
                    setCurrentHighlight(
                      editor.getAttributes("highlight").color || "#FFFF00"
                    );
                  }
                }}
                className={`toolbar-btn ${
                  editor.isActive("highlight")
                    ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
                aria-label="Text highlight"
              >
                <FiPenTool className="w-4 h-4" />
              </button>
              {isHighlightPickerOpen && (
                <div
                  ref={highlightPickerRef}
                  className="absolute z-50 mt-1 left-0 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HexColorPicker
                    color={currentHighlight}
                    onChange={setHighlightColor}
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetColor("highlight");
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Reset
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHighlightPickerOpen(false);
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ButtonGroup>

          <Divider />

          {/* MEDIA BUTTONS */}
          <ButtonGroup>
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className={`toolbar-btn ${
                editor.isActive("link")
                  ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                  : ""
              }`}
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
                <div
                  ref={emojiPickerRef}
                  className="absolute z-50 mt-1 left-0 shadow-lg rounded overflow-hidden"
                >
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

      {/* LINK MODAL */}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") addLink();
                if (e.key === "Escape") setIsLinkModalOpen(false);
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <ModalButton
                onClick={() => setIsLinkModalOpen(false)}
                variant="secondary"
              >
                <FiX className="mr-1" /> Cancel
              </ModalButton>
              <ModalButton onClick={addLink} disabled={!linkUrl}>
                <FiCheck className="mr-1" /> Add
              </ModalButton>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-3 dark:text-white">
              Add Image
            </h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") addImageByUrl();
                if (e.key === "Escape") setIsImageModalOpen(false);
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <ModalButton
                onClick={() => setIsImageModalOpen(false)}
                variant="secondary"
              >
                <FiX className="mr-1" /> Cancel
              </ModalButton>
              <ModalButton onClick={addImageByUrl} disabled={!imageUrl}>
                <FiCheck className="mr-1" /> Add
              </ModalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;