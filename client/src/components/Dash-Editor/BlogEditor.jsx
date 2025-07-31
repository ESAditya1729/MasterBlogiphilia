import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/extension-floating-menu';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import DOMPurify from 'dompurify';

// Import local components with correct paths
import EditorToolbar from './EditorToolbar';
import MetadataPanel from './MetadataPanel';
import PreviewPane from './PreviewPane';
import StatusBar from './StatusBar';
import EditorNavbar from './EditorNavbar';
import LoadingOverlay from './LoadingOverlay';
import ErrorDialog from './ErrorDialog';

// Import your API functions (make sure BlogApi.js exists in the same directory)
import { saveBlogApi, loadBlogApi, formatApiError } from './BlogApi';

const MAX_CONTENT_LENGTH = 100000;

const BlogEditor = ({ blogId, onSaveSuccess }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    excerpt: '',
    genre: '',
    content: '',
    tags: [],
    seoKeywords: [],
    featuredImage: '',
    status: 'draft',
    author: localStorage.getItem('username') || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [wordCount, setWordCount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-md bg-gray-100 p-4 font-mono text-sm',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          return 'Write something amazing...';
        },
      }),
      CharacterCount.configure({
        limit: MAX_CONTENT_LENGTH,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: blogData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setBlogData(prev => ({ ...prev, content: html }));
      setWordCount(countWords(editor.getText()));
      setIsDirty(true);
    },
  });

  // Count words in plain text
  const countWords = useCallback((text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, []);

  // Load blog data if editing existing blog
  useEffect(() => {
    if (blogId) {
      const loadBlog = async () => {
        setIsLoading(true);
        try {
          const data = await loadBlogApi(blogId);
          setBlogData(data);
          if (editor) {
            editor.commands.setContent(data.content);
          }
          setWordCount(countWords(editor?.getText() || ''));
          setIsDirty(false);
          setLastSaved(new Date(data.updatedAt || data.createdAt));
        } catch (err) {
          setError(formatApiError(err));
        } finally {
          setIsLoading(false);
        }
      };
      loadBlog();
    }
  }, [blogId, editor, countWords]);

  // Handle metadata changes
  const handleMetadataChange = (field, value) => {
    setBlogData(prev => {
      const newData = { ...prev, [field]: value };
      // For array fields, ensure we're working with arrays
      if (['tags', 'seoKeywords'].includes(field)) {
        newData[field] = Array.isArray(value) ? value : value.split(',').map(item => item.trim());
      }
      return newData;
    });
    setIsDirty(true);
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    setIsLoading(true);
    try {
      // In a real app, you would upload the image to your server here
      // For demo purposes, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      handleMetadataChange('featuredImage', imageUrl);
      
      // Insert image into editor at current position
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save blog (draft or publish)
  const handleSave = async (publish = false) => {
    if (!editor) return;
    
    setIsLoading(true);
    try {
      // Get the latest content from editor
      const content = editor.getHTML();
      const dataToSave = { ...blogData, content, status: publish ? 'published' : 'draft' };
      
      const savedBlog = await saveBlogApi(dataToSave, blogId, publish);
      
      setBlogData(savedBlog);
      setIsDirty(false);
      setLastSaved(new Date());
      
      if (onSaveSuccess) {
        onSaveSuccess(savedBlog);
      }
      
      return savedBlog;
    } catch (err) {
      setError(formatApiError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Confirm before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (!editor) {
    return <div className="flex justify-center items-center h-screen">Initializing editor...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation Bar */}
      <EditorNavbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        onPublish={() => handleSave(true)}
        isDirty={isDirty}
        status={blogData.status}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Metadata Panel (left sidebar) */}
        <MetadataPanel 
          data={blogData}
          onChange={handleMetadataChange}
          onImageUpload={handleImageUpload}
        />
        
        {/* Editor/Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'editor' ? (
            <>
              {/* Editor Toolbar */}
              <EditorToolbar editor={editor} />
              
              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-6 bg-white">
                {/* Title input (outside the editor) */}
                <input
                  type="text"
                  value={blogData.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  placeholder="Blog Title"
                  className="w-full text-4xl font-bold mb-6 p-2 border-none outline-none focus:ring-2 focus:ring-blue-200 rounded"
                />
                
                {/* Excerpt input */}
                <textarea
                  value={blogData.excerpt}
                  onChange={(e) => handleMetadataChange('excerpt', e.target.value)}
                  placeholder="Write a short excerpt..."
                  className="w-full text-lg mb-6 p-2 border-none outline-none focus:ring-2 focus:ring-blue-200 rounded resize-none"
                  rows={3}
                />
                
                {/* Floating menu for adding content */}
                {editor && (
                  <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex items-center space-x-1 bg-white shadow-lg rounded-md p-1 border border-gray-200">
                      <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                      >
                        H1
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                      >
                        H2
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </FloatingMenu>
                )}
                
                {/* Bubble menu for formatting selected text */}
                {editor && (
                  <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex items-center space-x-1 bg-white shadow-lg rounded-md p-1 border border-gray-200">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="19" y1="4" x2="10" y2="4"></line>
                          <line x1="14" y1="20" x2="5" y2="20"></line>
                          <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                          <line x1="4" y1="21" x2="20" y2="21"></line>
                        </svg>
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleLink({ href: 'https://example.com' }).run()}
                        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </button>
                    </div>
                  </BubbleMenu>
                )}
                
                {/* The actual editor content */}
                <EditorContent 
                  editor={editor} 
                  className="prose max-w-none focus:outline-none min-h-[300px]"
                />
              </div>
            </>
          ) : (
            <PreviewPane 
              title={blogData.title}
              excerpt={blogData.excerpt}
              content={blogData.content}
              featuredImage={blogData.featuredImage}
              author={blogData.author}
              genre={blogData.genre}
              tags={blogData.tags}
            />
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        wordCount={wordCount}
        characterCount={editor.storage.characterCount?.characters() || 0}
        lastSaved={lastSaved}
        status={blogData.status}
      />
      
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}
      
      {/* Error Dialog */}
      {error && (
        <ErrorDialog 
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default BlogEditor;