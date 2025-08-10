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
 */
const ButtonGroup = ({ children }) => (
  <div className="flex items-center space-x-1">{children}</div>
);

/**
 * Toolbar button component
 */
const ToolbarButton = ({ active, onClick, children, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md flex items-center justify-center transition-colors ${
      active
        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

/**
 * Main Toolbar component for the editor
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

  // Handle click outside of pickers and modals
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

  if (!editor) return null;

  // Text formatting actions
  const toggleMark = (mark) => editor.chain().focus().toggleMark(mark).run();
  const setAlignment = (align) =>
    editor.chain().focus().setTextAlign(align).run();
  const toggleList = (type) =>
    editor
      .chain()
      .focus()
      [`toggle${type === "bullet" ? "Bullet" : "Ordered"}List`]()
      .run();
  const addHorizontalRule = () =>
    editor.chain().focus().setHorizontalRule().run();
  const addCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  // Heading actions
  const setHeading = (level) => {
    if (editor.isActive("heading", { level })) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  // Link actions
  const addLink = () => {
    if (linkUrl) {
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

  // Image actions
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

  // Color actions
  const setTextColor = (color) => {
    setCurrentColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const setHighlightColor = (color) => {
    setCurrentHighlight(color);
    editor.chain().focus().setHighlight({ color }).run();
  };

  const resetColor = (type) => {
    if (type === "text") {
      editor.chain().focus().unsetColor().run();
      setCurrentColor("#000000");
    } else {
      editor.chain().focus().unsetHighlight().run();
      setCurrentHighlight("#FFFF00");
    }
  };

  // Emoji actions
  const addEmoji = (emojiData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-1 py-2">
          {/* TEXT FORMATTING */}
          <ButtonGroup>
            <ToolbarButton
              active={editor.isActive("bold")}
              onClick={() => toggleMark("bold")}
              ariaLabel="Bold"
            >
              <FiBold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("italic")}
              onClick={() => toggleMark("italic")}
              ariaLabel="Italic"
            >
              <FiItalic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive("underline")}
              onClick={() => toggleMark("underline")}
              ariaLabel="Underline"
            >
              <FiUnderline className="w-4 h-4" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider />

          {/* HEADINGS */}
          <ButtonGroup>
            {[
              { level: 1, size: "text-2xl" },
              { level: 2, size: "text-xl" },
              { level: 3, size: "text-lg" },
            ].map(({ level, size }) => (
              <ToolbarButton
                key={level}
                active={editor.isActive("heading", { level })}
                onClick={() => {
                  // Toggle between heading and paragraph
                  if (editor.isActive("heading", { level })) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().setHeading({ level }).run();
                  }
                }}
                ariaLabel={`Heading ${level}`}
              >
                <span className={`font-bold ${size}`}>H{level}</span>
              </ToolbarButton>
            ))}
          </ButtonGroup>

          <Divider />

          {/* ALIGNMENT */}
          <ButtonGroup>
            <ToolbarButton
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => setAlignment("left")}
              ariaLabel="Align left"
            >
              <FiAlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => setAlignment("center")}
              ariaLabel="Align center"
            >
              <FiAlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => setAlignment("right")}
              ariaLabel="Align right"
            >
              <FiAlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() => setAlignment("justify")}
              ariaLabel="Justify"
            >
              <FiAlignJustify className="w-4 h-4" />
            </ToolbarButton>
          </ButtonGroup>

          <Divider />

          {/* LISTS & BLOCKS */}
<ButtonGroup>
  {/* Bullet List */}
  <ToolbarButton
    active={editor.isActive("bulletList")}
    onClick={() => editor.chain().focus().toggleBulletList().run()}
    ariaLabel="Bullet list"
    className={editor.isActive("bulletList") ? "bg-blue-100 dark:bg-blue-900" : ""}
  >
    <FiList className="w-4 h-4" />
  </ToolbarButton>

  {/* Ordered List */}
  <ToolbarButton
    active={editor.isActive("orderedList")}
    onClick={() => editor.chain().focus().toggleOrderedList().run()}
    ariaLabel="Numbered list"
    className={editor.isActive("orderedList") ? "bg-blue-100 dark:bg-blue-900" : ""}
  >
    <span className="text-sm font-bold">1.</span>
  </ToolbarButton>

  {/* Horizontal Rule */}
  <ToolbarButton
    onClick={() => editor.chain().focus().setHorizontalRule().run()}
    ariaLabel="Horizontal rule"
  >
    <FiMinus className="w-4 h-4" />
  </ToolbarButton>

  {/* Code Block */}
  <ToolbarButton
    active={editor.isActive("codeBlock")}
    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    ariaLabel="Code block"
    className={editor.isActive("codeBlock") ? "bg-blue-100 dark:bg-blue-900" : ""}
  >
    <FiCode className="w-4 h-4" />
  </ToolbarButton>
</ButtonGroup>

          <Divider />

          {/* COLORS */}
          <ButtonGroup>
            {/* TEXT COLOR */}
            <div className="relative">
              <ToolbarButton
                active={editor.isActive("textStyle")}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorPickerOpen(!isColorPickerOpen);
                  setIsHighlightPickerOpen(false);
                  if (editor.isActive("textStyle")) {
                    setCurrentColor(
                      editor.getAttributes("textStyle").color || "#000000"
                    );
                  }
                }}
                ariaLabel="Text color"
              >
                <FiDroplet className="w-4 h-4" />
              </ToolbarButton>
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

            {/* HIGHLIGHT COLOR */}
            <div className="relative">
              <ToolbarButton
                active={editor.isActive("highlight")}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHighlightPickerOpen(!isHighlightPickerOpen);
                  setIsColorPickerOpen(false);
                  if (editor.isActive("highlight")) {
                    setCurrentHighlight(
                      editor.getAttributes("highlight").color || "#FFFF00"
                    );
                  }
                }}
                ariaLabel="Text highlight"
              >
                <FiPenTool className="w-4 h-4" />
              </ToolbarButton>
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

          {/* MEDIA */}
          <ButtonGroup>
            <ToolbarButton
              active={editor.isActive("link")}
              onClick={() => setIsLinkModalOpen(true)}
              ariaLabel="Add link"
            >
              <FiLink className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setIsImageModalOpen(true)}
              ariaLabel="Add image"
            >
              <FiImage className="w-4 h-4" />
            </ToolbarButton>
            <div className="relative">
              <ToolbarButton
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                ariaLabel="Add emoji"
              >
                <span className="text-sm">😊</span>
              </ToolbarButton>
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
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-md flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                onClick={addLink}
                disabled={!linkUrl}
                className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <FiCheck className="mr-1" /> Add
              </button>
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
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 rounded-md flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                onClick={addImageByUrl}
                disabled={!imageUrl}
                className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <FiCheck className="mr-1" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
