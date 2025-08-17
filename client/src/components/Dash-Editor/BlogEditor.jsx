import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiUpload, FiCheckCircle, FiX, FiZap } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import api from "./BlogApi";
import { toast } from "react-toastify";
import BlogEditorNavbar from "./EditorNavbar";
import BlogEditorTabs from "./BlogEditorTabs";
import EditorSpace from "./EditorSpace";
import MetadataForm from "./MetadataForm";
import AskLillyTab from "./AskLillyTab";
import "./Styles.css";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("contents");
  const { mode } = useTheme();
  const darkMode = mode === "dark";
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedBlogUrl, setPublishedBlogUrl] = useState("");

  // Enhanced initial state with all required fields
  const [blogData, setBlogData] = useState({
    _id: id || null,
    title: "",
    content: "",
    genre: "",
    tags: [],
    excerpt: "",
    seoKeywords: [],
    coverImage: "",
    status: "draft",
    author: "",
    isFeatured: false,
    views: 0,
    likes: 0,
    isLiked: false,
    wordCount: 0,
    createdAt: "",
    updatedAt: "",
  });

  // Initialize editor and fetch data if needed
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Set author for new posts
        if (!id) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser?.username) {
                setBlogData((prev) => ({
                  ...prev,
                  author: parsedUser.username,
                }));
              }
            } catch (err) {
              console.error("Failed to parse user from localStorage", err);
            }
          }
          setIsLoading(false);
          return;
        }

        // Fetch existing post data
        setIsLoading(true);
        console.log("Fetching blog with ID:", id);

        const response = await api.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${id}`
        );
        console.log("API Response:", response);

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "No data received from server"
          );
        }

        const blog = response.data.data;
        console.log("Blog data:", blog);

        setBlogData({
          _id: blog._id,
          title: blog.title || "",
          content: blog.content || "",
          genre: blog.genre || "",
          tags: blog.tags || [],
          excerpt: blog.excerpt || "",
          seoKeywords: blog.seoKeywords || [],
          coverImage: blog.coverImage || "",
          status: blog.status || "draft",
          author: blog.author?.username || blog.author || "", // Handle both object and string author
          isFeatured: blog.isFeatured || false,
          views: blog.views || 0,
          likes: blog.likes || 0,
          isLiked: blog.isLiked || false,
          wordCount: blog.wordCount || 0,
          createdAt: blog.createdAt || "",
          updatedAt: blog.updatedAt || "",
        });
      } catch (err) {
        console.error("Error initializing editor:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to load blog post"
        );
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    initializeEditor();
  }, [id, navigate]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Current blogData state:", blogData);
  }, [blogData]);

  const validateForm = () => {
    const errors = {};
    if (!blogData.title.trim()) errors.title = "Title is required";
    if (!blogData.excerpt.trim()) errors.excerpt = "Excerpt is required";
    if (!blogData.genre.trim()) errors.genre = "Genre is required";
    if (blogData.excerpt.length > 200)
      errors.excerpt = "Excerpt must be 200 characters or less";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (isPublishingAction = false) => {
    if (!validateForm()) {
      toast.error("Please fix form errors before saving");
      return;
    }

    if (isPublishingAction && !showPublishConfirm) {
      setShowPublishConfirm(true);
      return;
    }

    if (isSaving || isPublishing) return;

    isPublishingAction ? setIsPublishing(true) : setIsSaving(true);
    if (isPublishingAction) setShowPublishConfirm(false);

    try {
      const payload = {
        ...blogData,
        status: isPublishingAction ? "published" : "draft",
        lastUpdated: new Date().toISOString(),
      };

      // Remove unnecessary fields before sending
      delete payload.views;
      delete payload.likes;
      delete payload.isLiked;
      delete payload.createdAt;
      delete payload.updatedAt;

      const response = blogData._id
        ? await api.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${blogData._id}`,
            payload
          )
        : await api.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/blogs`,
            payload
          );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Invalid response from server"
        );
      }

      const savedBlog = response.data.data;
      console.log("Saved blog:", savedBlog);

      // Update state with full response including server-generated fields
      setBlogData((prev) => ({
        ...prev,
        ...savedBlog,
        author: savedBlog.author?.username || savedBlog.author || prev.author,
      }));

      if (isPublishingAction) {
        setPublishedBlogUrl(
          `/blog/${
            savedBlog.slug || savedBlog._id
          }`
        );
        setShowSuccessModal(true);
      } else {
        toast.success("Draft saved successfully");
        if (!blogData._id) {
          window.history.replaceState(null, "", `/editor/${savedBlog._id}`);
          setBlogData((prev) => ({ ...prev, _id: savedBlog._id }));
        }
      }

      return savedBlog;
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        `Failed to ${isPublishingAction ? "publish" : "save"}: ${
          err.response?.data?.message || err.message || "Please try again"
        }`
      );
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!blogData.title.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        seoKeywords: "Please enter a title first",
      }));
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const { data } = await api.post("/ai/generate-keywords", {
        title: blogData.title,
        excerpt: blogData.excerpt,
      });

      setBlogData((prev) => ({
        ...prev,
        seoKeywords: [...new Set([...prev.seoKeywords, ...data.keywords])],
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate keywords");
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleCoverImageUpload = async (file) => {
    try {
      if (isUploading) return;
      setIsUploading(true);

      console.log("handleCoverImageUpload called with:", file);

      // --- File Extraction ---
      const actualFile =
        (file instanceof File && file) ||
        (file?.file instanceof File && file.file) ||
        (Array.isArray(file) && file[0] instanceof File && file[0]) ||
        file?.originFileObj || // Ant Design
        null;

      if (!actualFile) {
        toast.error("Invalid file selected");
        return;
      }

      // --- Validation ---
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(actualFile.type)) {
        toast.error("Only JPEG, PNG, WEBP, or GIF images are allowed");
        return;
      }

      if (actualFile.size > maxSize) {
        toast.error("Image must be smaller than 5MB");
        return;
      }

      // --- Prepare Request ---
      const formData = new FormData();
      formData.append("image", actualFile);
      formData.append("blogId", blogData._id);

      console.log("FormData:", {
        image: { name: actualFile.name, size: actualFile.size, type: actualFile.type },
        blogId: blogData._id
      });

      // --- Upload ---
      const { data } = await api.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/media/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // --- Update State ---
      setBlogData((prev) => ({
        ...prev,
        coverImage: data.url,
        coverImagePublicId: data.public_id,
      }));

      toast.success("Cover image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to upload cover image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-pulse mb-4">
            <FiZap className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading your draft...
          </div>
          {id && (
            <div className="text-sm text-gray-500 mt-2">
              Loading blog ID: {id}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <BlogEditorNavbar
          blogData={blogData}
          onSave={() => handleSave(false)}
          onPublish={() => handleSave(true)}
          isSubmitting={isSaving || isPublishing}
          onCoverImageUpload={handleCoverImageUpload}
        />
      </header>

      {/* Publish Confirmation Dialog */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FiUpload className="text-green-500" />
                Ready to Publish?
              </h3>
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Your blog will be visible to the public. Are you sure you want to
              publish?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Continue Editing
              </button>
              <button
                onClick={() => handleSave(true)}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <FiCheckCircle className="mx-auto text-green-500" size={60} />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Blog Published Successfully!
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Your post is now live for the world to see.
              </p>

              {publishedBlogUrl && (
                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-md break-all text-left">
                  <span className="font-medium">Direct Link:</span>
                  <a
                    href={publishedBlogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    {window.location.origin}
                    {publishedBlogUrl}
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    window.open(publishedBlogUrl, "_blank");
                    setShowSuccessModal(false);
                  }}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Live Blog
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    window.location.reload();
                  }}
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Continue Writing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs and Action Buttons */}
          <div
            className={`sticky top-16 z-10 ${
              darkMode ? "bg-gray-900" : "bg-white"
            } border-b border-gray-200 dark:border-gray-800`}
          >
            <div className="flex flex-col">
              {/* Tabs */}
              <div className="pt-2">
                <BlogEditorTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
              <br />
              {/* Action Buttons */}
              <div className="flex justify-center px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Cover Image Upload */}
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all cursor-pointer ${
                      isSaving || isPublishing || isUploading
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverImageUpload(e.target.files[0])}
                      className="hidden"
                      disabled={isSaving || isPublishing || isUploading}
                    />
                    <FiUpload className="h-4 w-4" />
                    <span>{isUploading ? "Uploading..." : "Cover Image"}</span>
                  </label>

                  {/* Save Draft Button */}
                  <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving || isPublishing || !blogData}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                      isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FiSave className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                  </button>

                  {/* Publish Button */}
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isPublishing || isSaving || !blogData}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isPublishing
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FiUpload className="h-4 w-4" />
                    <span>{isPublishing ? "Publishing..." : "Publish"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Content */}
          <main className="py-6">
            {activeTab === "contents" && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <EditorSpace
                  blogData={blogData}
                  setBlogData={setBlogData}
                  key={blogData._id} // Force re-render when blog changes
                />
              </div>
            )}

            {activeTab === "metadata" && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <MetadataForm
                  title={blogData.title}
                  excerpt={blogData.excerpt}
                  genre={blogData.genre}
                  tags={blogData.tags}
                  seoKeywords={blogData.seoKeywords}
                  setTitle={(val) =>
                    setBlogData((prev) => ({ ...prev, title: val }))
                  }
                  setExcerpt={(val) =>
                    setBlogData((prev) => ({ ...prev, excerpt: val }))
                  }
                  setGenre={(val) =>
                    setBlogData((prev) => ({ ...prev, genre: val }))
                  }
                  setTags={(val) =>
                    setBlogData((prev) => ({ ...prev, tags: val }))
                  }
                  setSeoKeywords={(val) =>
                    setBlogData((prev) => ({ ...prev, seoKeywords: val }))
                  }
                  errors={formErrors}
                  onGenerateSuggestions={handleGenerateKeywords}
                  isGenerating={isGeneratingKeywords}
                />
              </div>
            )}

            {activeTab === "askLilly" && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <AskLillyTab
                  blogData={blogData}
                  onApplySuggestions={(suggestions) => {
                    setBlogData((prev) => ({ ...prev, ...suggestions }));
                    toast.success("Suggestions applied successfully");
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;