import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { ListItem } from '@tiptap/extension-list-item';
import { useEffect, useState, useCallback } from "react";
import Toolbar from "./Toolbar";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, PenTool, Maximize2, Minimize2, Eye, EyeOff, Save, X } from "lucide-react";

const EditorSpace = ({ blogData = {}, setBlogData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        listItem: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline dark:text-blue-400',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg mx-auto shadow-md',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg shadow-md',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full my-4',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start my-2',
        },
      }),
      ListItem,
    ],
    content: blogData?.content || "",
    onUpdate: ({ editor }) => {
      setBlogData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: `min-h-[300px] p-4 focus:outline-none prose dark:prose-invert prose-headings:font-medium prose-img:mx-auto max-w-none ${
          isPreviewMode ? 'pointer-events-none' : ''
        }`,
      },
    },
  });

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const togglePreview = useCallback(() => {
    setShowPreviewModal(!showPreviewModal);
  }, [showPreviewModal]);

  const handleSave = useCallback(async () => {
    if (editor) {
      setIsSaving(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate save delay
        setBlogData(prev => ({ ...prev, content: editor.getHTML() }));
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 2000);
      } finally {
        setIsSaving(false);
      }
    }
  }, [editor, setBlogData]);

  useEffect(() => {
    if (editor && blogData?.content !== editor.getHTML()) {
      editor.commands.setContent(blogData?.content || "");
    }
  }, [blogData?.content, editor]);

  useEffect(() => {
    if (isFullscreen || showPreviewModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFullscreen, showPreviewModal]);

  if (!editor) {
    return (
      <div className="p-4 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="text-indigo-500 mb-4"
            >
              <Feather size={24} />
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Preparing your writing space...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Blurred Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
              onClick={() => setShowPreviewModal(false)}
            />

            {/* Modal Content */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className={`relative max-w-4xl w-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col ${isFullscreen ? 'mt-0' : 'mt-16'} bg-white dark:bg-gray-900`}
              >
                {/* Modal Header */}
                <div className={`flex justify-between items-center p-6 border-b ${isFullscreen ? 'border-gray-200 dark:border-gray-800' : ''}`}>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Preview Mode</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">How your blog will appear to readers</p>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Blog Content Preview */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Blog Metadata */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blogData.title || "Untitled Post"}</h1>
                    {blogData.excerpt && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-4">"{blogData.excerpt}"</p>
                    )}
                    {blogData.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blogData.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Blog Content */}
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: blogData.content || "<p>Your content will appear here...</p>" }}
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <motion.div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-40 m-0 p-0 rounded-none border-none'
            : ''
        }`}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 ${
          isFullscreen ? 'px-6 pt-6' : ''
        }`}>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="mr-3"
              whileHover={{ rotate: 15 }}
            >
              <Feather
                size={24}
                className="text-indigo-600 dark:text-indigo-400"
                strokeWidth={2}
              />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Blogiphilia
                </span>{" "}
                Editor
              </h2>
              <motion.div
                className="flex items-center mt-1"
                animate={{ opacity: [0.8, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <PenTool size={14} className="text-amber-500 dark:text-amber-400 mr-1" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Draft Mode</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3">
            <AnimatePresence>
              {showSaveIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30"
                >
                  Changes saved!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={togglePreview}
              className="flex items-center text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={18} className="mr-1.5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Preview</span>
            </motion.button>

            <motion.button
              onClick={handleSave}
              className="flex items-center text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSaving}
            >
              {isSaving ? (
                <motion.span
                  animate={{ opacity: [0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  Saving...
                </motion.span>
              ) : (
                <>
                  <Save size={16} className="mr-1.5" />
                  <span>Save</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={toggleFullscreen}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 size={18} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Maximize2 size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Editor Area */}
        <div className={`rounded-b-xl bg-white dark:bg-gray-800 relative transition-all ${
          isFullscreen 
            ? 'h-[calc(100vh-72px)]' 
            : ''
        }`}>
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Toolbar 
              editor={editor} 
              onSave={handleSave}
              onPreview={togglePreview}
              onFullscreen={toggleFullscreen}
            />
          </div>

          <div
            className={`overflow-y-auto relative ${
              isFullscreen 
                ? 'h-[calc(100%-56px)]' 
                : 'max-h-[calc(100vh-300px)]'
            }`}
          >
            <EditorContent editor={editor} className="pt-4 pb-8" />
          </div>
        </div>

        {/* Floating Actions */}
        {isFullscreen && (
          <motion.div 
            className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={handleSave}
              className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Save"
            >
              <Save size={20} />
            </motion.button>

            <motion.button
              onClick={toggleFullscreen}
              className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Exit fullscreen"
            >
              <Minimize2 size={20} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default EditorSpace;