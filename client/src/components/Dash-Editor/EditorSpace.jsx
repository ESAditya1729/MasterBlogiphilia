import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const EditorSpace = ({ blogData = {}, setBlogData }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: blogData?.content || '',  // Safe access
    onUpdate: ({ editor }) => {
      setBlogData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 focus:outline-none prose dark:prose-invert max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && blogData?.content !== editor.getHTML()) {
      editor.commands.setContent(blogData?.content || '');
    }
  }, [blogData?.content, editor]);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-md border shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Write Your Blog</h2>
      </div>

      <div className="border rounded-md bg-white dark:bg-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditorSpace;
