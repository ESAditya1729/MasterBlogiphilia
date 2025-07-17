import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, TextStyle, Color],
    content: "",
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-lg max-w-none min-h-[300px] p-4 outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
    },
  });

  const handleTagChange = (e) => {
    const raw = e.target.value;
    const formatted = raw
      .split(" ")
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
      .join(" ");
    setTags(formatted);
  };

  const setColor = (color) => {
    editor?.chain().focus().setColor(color).run();
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm">
      {/* Title Input */}
      <div className="mb-8">
        <label className="block text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 text-center">
          Blog Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all"
        />
      </div>

      {/* Dropdowns for Language & Genre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 text-center">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all"
          >
            <option value="">Select a language</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="bengali">Bengali</option>
          </select>
        </div>

        <div>
          <label className="block text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 text-center">
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all"
          >
            <option value="">Select a genre</option>
            <option value="fiction">Fiction</option>
            <option value="poetry">Poetry</option>
            <option value="memoir">Memoir</option>
            <option value="tech">Tech</option>
          </select>
        </div>
      </div>

      {/* Tags Input */}
      <div className="mb-8">
        <label className="block text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 text-center">
          Tags <span className="text-sm font-normal text-gray-500">(separated by space, auto # prefixed)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={handleTagChange}
          placeholder="e.g. dream love war"
          className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 transition-all"
        />
      </div>

      {/* Toolbar */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-center shadow-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all text-base flex items-center gap-2 ${
            editor?.isActive("bold")
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 00-4 4v4a4 4 0 008 0V8a4 4 0 00-4-4zm-2 8a2 2 0 114 0v4a2 2 0 11-4 0v-4zm6-8a4 4 0 014 4v4a4 4 0 01-8 0V8a4 4 0 014-4zm2 8a2 2 0 10-4 0v4a2 2 0 104 0v-4z" clipRule="evenodd" />
          </svg>
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-5 py-2.5 rounded-lg italic transition-all text-base flex items-center gap-2 ${
            editor?.isActive("italic")
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2H5a1 1 0 000 2h2zm4-1a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm3-1a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
          </svg>
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-5 py-2.5 rounded-lg underline transition-all text-base flex items-center gap-2 ${
            editor?.isActive("underline")
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Underline
        </button>

        {/* Color Picker */}
        <div className="ml-2 flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Text Color:</span>
          <div className="flex gap-2">
            {["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#000000", "#ffffff"].map((color) => (
              <button
                key={color}
                onClick={() => setColor(color)}
                className={`w-7 h-7 rounded-full border-2 ${color === '#ffffff' ? 'border-gray-300' : 'border-white'} shadow-md hover:scale-110 transition-transform`}
                style={{ backgroundColor: color }}
                title={color}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-teal-500/10 p-0 min-h-[300px] transition-all duration-200 overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count and Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600 dark:text-gray-400 text-base">
          Characters: <span className="font-bold">{charCount}</span>
        </div>
        <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-lg">
          Publish Blog
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;