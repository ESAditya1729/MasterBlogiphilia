import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect } from "react";
import Toolbar from "./Toolbar";
import { motion } from "framer-motion";
import { Feather, PenTool } from "lucide-react";

const EditorSpace = ({ blogData = {}, setBlogData }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: blogData?.content || "",
    onUpdate: ({ editor }) => {
      setBlogData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose dark:prose-invert max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && blogData?.content !== editor.getHTML()) {
      editor.commands.setContent(blogData?.content || "");
    }
  }, [blogData?.content, editor]);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-md border shadow-sm relative">
      <div className="flex justify-between items-center mb-2">
        <motion.div
          className="mx-auto max-w-max mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-end">
            <Feather
              size={20}
              className="text-violet-600 dark:text-violet-400 mr-2"
              strokeWidth={2}
            />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              <span className="text-emerald-500 dark:text-teal-400 font-bold">
                Blogiphilia
              </span>{" "}
              Editor
            </h2>
            <motion.span
              className="ml-2 text-xs text-amber-500 dark:text-amber-400 flex items-center"
              animate={{ opacity: [0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <PenTool size={12} className="mr-1" /> Draft Mode
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="border rounded-md bg-white dark:bg-gray-800 relative">
        <div className="sticky top-0 z-[100] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Toolbar editor={editor} />
        </div>

        <div
          className="overflow-y-auto relative z-0"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <EditorContent editor={editor} className="pt-2" />
        </div>
      </div>
    </div>
  );
};

export default EditorSpace;