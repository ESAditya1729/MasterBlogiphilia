import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import EmojiPicker from "emoji-picker-react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiList,
  FiImage,
  FiSave,
  FiEye,
  FiSend,
  FiX,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiCode,
  FiMinus
} from "react-icons/fi";
import { FaRegSmile } from "react-icons/fa";

const BlogContentEditor = ({
  editor,
  darkMode,
  errors,
  handleSaveDraft,
  handlePublish,
  isSubmitting,
  blogTitle,
  handleImageUpload,
  activeTab,
  setActiveTab
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [previewContent, setPreviewContent] = useState(null);

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkModalOpen(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  const handlePreview = () => {
    if (editor) {
      setPreviewContent({
        html: editor.getHTML(),
        title: blogTitle || "Blog Preview",
      });
    }
  };

  const closePreview = () => {
    setPreviewContent(null);
  };

  if (!editor) {
    return (
      <div className={`p-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full ${darkMode ? "bg-gray-800" : "bg-white"} border-l ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden flex border-b">
        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 py-3 font-medium ${activeTab === 'metadata' ? 
            (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
        >
          Metadata
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 font-medium ${activeTab === 'editor' ? 
            (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
            (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
        >
          Editor
        </button>
      </div>

      {/* Only show editor content when in editor tab or on desktop */}
      {(activeTab === 'editor' || window.innerWidth >= 1024) && (
        <>
          {/* Enhanced Toolbar */}
          <div
            className={`sticky top-0 z-10 border-b p-3 flex flex-wrap items-center gap-2 ${
              darkMode
                ? "border-gray-700 bg-gray-900"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("bold")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Bold"
                aria-label="Bold"
              >
                <FiBold size={18} />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("italic")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Italic"
                aria-label="Italic"
              >
                <FiItalic size={18} />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("underline")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Underline"
                aria-label="Underline"
              >
                <FiUnderline size={18} />
              </button>
            </div>

            <div className="h-6 w-px mx-1 bg-gray-300 dark:bg-gray-600" />

            {/* Text Alignment */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive({ textAlign: 'left' })
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Align Left"
                aria-label="Align Left"
              >
                <FiAlignLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive({ textAlign: 'center' })
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Align Center"
                aria-label="Align Center"
              >
                <FiAlignCenter size={18} />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive({ textAlign: 'right' })
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Align Right"
                aria-label="Align Right"
              >
                <FiAlignRight size={18} />
              </button>
            </div>

            <div className="h-6 w-px mx-1 bg-gray-300 dark:bg-gray-600" />

            {/* Lists and Links */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("bulletList")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Bullet List"
                aria-label="Bullet List"
              >
                <FiList size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("link")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Link"
                aria-label="Link"
              >
                <FiLink size={18} />
              </button>
            </div>

            <div className="h-6 w-px mx-1 bg-gray-300 dark:bg-gray-600" />

            {/* Insert Elements */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => document.getElementById("image-upload").click()}
                className={`p-2 rounded-md transition-all ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Insert Image"
                aria-label="Insert Image"
              >
                <FiImage size={18} />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={`p-2 rounded-md transition-all ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Horizontal Rule"
                aria-label="Horizontal Rule"
              >
                <FiMinus size={18} />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded-md transition-all ${
                  editor.isActive("codeBlock")
                    ? darkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                    : darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Code Block"
                aria-label="Code Block"
              >
                <FiCode size={18} />
              </button>
            </div>

            <div className="h-6 w-px mx-1 bg-gray-300 dark:bg-gray-600" />

            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-md transition-all ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Emoji"
                aria-label="Emoji"
              >
                <FaRegSmile size={18} />
              </button>
              {showEmojiPicker && (
                <div className="fixed z-50 mt-2 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={400}
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                      theme={darkMode ? "dark" : "light"}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className={`absolute top-2 right-2 p-1 rounded-full ${
                        darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label="Close emoji picker"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="relative h-full">
              <EditorContent
                editor={editor}
                className={`prose max-w-none min-h-[calc(100vh-200px)] p-6 focus:outline-none ${
                  darkMode
                    ? "prose-invert bg-gray-800 text-gray-300"
                    : "bg-white text-gray-800"
                }`}
              />
              {errors.content && (
                <p className="mt-2 ml-6 text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`sticky bottom-0 p-4 flex flex-wrap justify-end gap-3 ${
              darkMode ? "bg-gray-900 border-t border-gray-700" : "bg-gray-50 border-t border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={handlePreview}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              disabled={isSubmitting}
            >
              <FiEye className="mr-2" size={16} />
              Preview
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-blue-700 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              <FiSave className="mr-2" size={16} />
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              <FiSend className="mr-2" size={16} />
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </>
      )}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className={`p-6 rounded-lg shadow-xl w-96 max-w-[95vw] ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Add Link
              </h3>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className={`w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                disabled={!linkUrl}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  !linkUrl
                    ? "bg-blue-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div
            className={`p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {previewContent.title}
              </h2>
              <button
                onClick={closePreview}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
                aria-label="Close preview"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <article
                className={`prose dark:prose-invert max-w-none ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
                dangerouslySetInnerHTML={{ __html: previewContent.html }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogContentEditor;