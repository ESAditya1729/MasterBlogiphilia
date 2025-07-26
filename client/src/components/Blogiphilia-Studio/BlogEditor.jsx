import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import BlogMetaForm from "../components/BlogMetaForm";
import BlogContentEditor from "../components/BlogContentEditor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate } from "react-router-dom";

const BlogEditor = ({ initialData, authorId }) => {
  const { mode: darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor');

  const [blogData, setBlogData] = useState({
    title: initialData?.title || "",
    genre: initialData?.genre || "technology",
    tags: initialData?.tags || [],
    newTag: "",
    isPublished: initialData?.isPublished || false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  // Calculate reading time based on word count
  const calculateReadingTime = useCallback((content) => {
    if (!content) return 0;
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 200); // 200 words per minute
  }, []);

  // Memoized editor extensions with theme support
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "font-serif"
        }
      },
      paragraph: {
        HTMLAttributes: {
          class: darkMode ? "text-gray-100" : "text-gray-800"
        }
      }
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: darkMode 
          ? "text-blue-400 hover:text-blue-300 underline"
          : "text-blue-600 hover:text-blue-800 underline"
      }
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: "rounded-lg shadow-md my-4 max-w-full h-auto"
      }
    }),
    Placeholder.configure({
      placeholder: "Start writing your masterpiece...",
    }),
  ], [darkMode]);

  // Editor instance with theme support
  const editor = useEditor({
    extensions,
    content: initialData?.content || "<p></p>",
    editorProps: {
      attributes: {
        class: `prose max-w-none p-4 focus:outline-none min-h-[500px] ${
          darkMode 
            ? "dark:prose-invert bg-gray-800 text-gray-100" 
            : "bg-white text-gray-800"
        }`
      },
    },
    onUpdate: ({ editor }) => {
      if (errors.content) {
        setErrors(prev => ({ ...prev, content: "" }));
      }
      const content = editor.getHTML();
      setReadingTime(calculateReadingTime(content));
    },
  });

  // Force editor update when theme changes
  useEffect(() => {
    if (!editor) return;
    
    editor.setOptions({
      extensions,
      editorProps: {
        attributes: {
          class: `prose max-w-none p-4 focus:outline-none min-h-[500px] ${
            darkMode 
              ? "dark:prose-invert bg-gray-800 text-gray-100" 
              : "bg-white text-gray-800"
          }`
        },
      },
    });
  }, [darkMode, editor, extensions]);

  // Initialize reading time
  useEffect(() => {
    if (initialData?.content) {
      setReadingTime(calculateReadingTime(initialData.content));
    }
  }, [initialData?.content, calculateReadingTime]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!blogData.title.trim()) newErrors.title = "Title is required";
    if (!blogData.genre) newErrors.genre = "Genre is required";
    if (!editor?.getText().trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [blogData.title, blogData.genre, editor]);

  const uploadToCloudinary = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Image upload failed. Please try again.");
    }
  }, []);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.match("image.*")) {
        setErrors(prev => ({ ...prev, image: "Only image files are allowed" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }

      try {
        const imageUrl = await uploadToCloudinary(file);
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setErrors(prev => ({ ...prev, image: "" }));
      } catch (error) {
        setErrors(prev => ({ ...prev, image: error.message }));
      }
    },
    [editor, uploadToCloudinary]
  );

  const saveBlog = useCallback(
    async (publishStatus) => {
      if (!validate()) {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }

      setIsSubmitting(true);
      try {
        const content = editor.getHTML();
        const blogPayload = {
          title: blogData.title,
          genre: blogData.genre,
          tags: blogData.tags,
          content,
          isPublished: publishStatus,
          authorId,
        };

        const url = initialData?._id
          ? `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${initialData._id}`
          : `${process.env.REACT_APP_API_BASE_URL}/api/blogs`;
        const method = initialData?._id ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(blogPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save blog");
        }

        const savedBlog = await response.json();
        navigate(`/blogs/${savedBlog._id}`, {
          state: {
            message: publishStatus
              ? "Blog published successfully!"
              : "Draft saved successfully!",
          },
        });
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          server: err.message || "An unexpected error occurred. Please try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, editor, blogData, initialData, authorId, navigate, errors]
  );

  useEffect(() => {
    if (errors.server) {
      setErrors(prev => ({ ...prev, server: "" }));
    }
  }, [blogData, errors.server]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-[1800px] mx-auto rounded-xl transition-all duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {errors.server && (
          <div
            className={`p-4 border-l-4 ${
              darkMode
                ? "bg-red-900/30 border-red-500 text-red-300"
                : "bg-red-100 border-red-500 text-red-700"
            }`}
          >
            <p className="font-medium">{errors.server}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)]">
          {/* Sticky Metadata Column */}
          <div className={`lg:w-80 xl:w-96 flex-shrink-0 border-r ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } lg:h-full lg:sticky lg:top-0 lg:overflow-y-auto`}>
            <BlogMetaForm
              blogData={blogData}
              setBlogData={setBlogData}
              errors={errors}
              darkMode={darkMode}
              handleImageUpload={handleImageUpload}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              readingTime={readingTime}
            />
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'editor' && (
              <BlogContentEditor
                editor={editor}
                darkMode={darkMode}
                errors={errors}
                handleSaveDraft={() => saveBlog(false)}
                handlePublish={() => saveBlog(true)}
                isSubmitting={isSubmitting}
                blogTitle={blogData.title}
                handleImageUpload={handleImageUpload}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;