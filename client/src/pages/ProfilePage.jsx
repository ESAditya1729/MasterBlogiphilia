import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiFeather,
  FiBookmark,
  FiLink2,
  FiUserPlus,
  FiUserMinus,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

// Components
import LoadingSpinner from "../utils/LoadingSpinner";
import FloatingBookElements from "../components/Dash-Profile/FloatingBookElements";
import ProfileHeader from "../components/Dash-Profile/ProfileHeader";
import ProfileStats from "../components/Dash-Profile/ProfileStats";
import ProfileTabs from "../components/Dash-Profile/ProfileTabs";
import ProfilePostsGrid from "../components/Dash-Profile/ProfilePostsGrid";
import ProfileDrafts from "../components/Dash-Profile/ProfileDrafts";
import ProfileAchievements from "../components/Dash-Profile/ProfileAchievements";
import FollowersModal from "../components/modals/FollowersModal";
import FollowingModal from "../components/modals/FollowingModal";

/**
 * Animation variants for floating decorative elements
 */
const floatingElements = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const floatingElement = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 0.8,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

/**
 * ProfilePage Component - Displays a user's profile with posts, stats, and other information
 */
const ProfilePage = () => {
  // Hooks and context
  const { user, loading: authLoading } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [postCounts, setPostCounts] = useState({ published: 0, draft: 0, archived: 0 });
  const [postsCountError, setPostsCountError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [followUpdate, setFollowUpdate] = useState({});
  const [publishedPostsCount, setPublishedPostsCount] = useState(0);
  const [postsCountLoading, setPostsCountLoading] = useState(true);

  // Derived state
  const isOwnProfile =
    !userId ||
    userId === user?._id ||
    (userId.includes("-") && userId.split("-").pop() === user?._id);

  /**
   * Extracts the profile ID from the URL parameter or current user
   * Handles both "username-id" and plain ID formats
   */
  const getProfileId = useCallback(() => {
    if (!user && !userId) return null;
    const currentUserId = user?._id;
    const idToFetch = userId || currentUserId;
    return idToFetch.includes("-") ? idToFetch.split("-").pop() : idToFetch;
  }, [user, userId]);

  /**
   * Fetches the user's profile data from the API
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user && !userId) return;

      const token = localStorage.getItem("token");
      const currentUserId = user?._id;
      const profileId = getProfileId();

      // Validate the profile ID format
      if (!/^[0-9a-fA-F]{24}$/.test(profileId)) {
        throw new Error("Invalid user identifier");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${profileId}/full-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Create SEO-friendly URL
      const usernameSlug = response.data.username
        ? encodeURIComponent(
            response.data.username
              .replace(/\s+/g, "-")
              .replace(/[^\w\-]+/g, "")
              .toLowerCase()
          )
        : "user";

      const cleanUrl = `/profile/${usernameSlug}-${response.data._id}`;
      const fullUrl = `${window.location.origin}${cleanUrl}`;

      // Update URL if needed without reloading
      if (window.location.pathname !== cleanUrl) {
        window.history.replaceState(null, "", cleanUrl);
      }

      // Check if current user is following this profile
      const currentUserFollowing = response.data.followers?.some(
        (follower) => follower._id === currentUserId
      );

      setProfile(response.data);
      setIsFollowing(currentUserFollowing || false);
      setProfileUrl(fullUrl);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch profile"
      );
      console.error("Profile fetch error:", err);

      // Handle URL format correction
      if (
        err.message === "Invalid user identifier" &&
        userId &&
        !userId.includes("-")
      ) {
        navigate(`/profile/user-${userId}`, { replace: true });
      }
    } finally {
      setInitialLoadComplete(true);
      setLoading(false);
    }
  }, [user, userId, navigate, getProfileId]);

  /**
   * Fetches the count of published posts for the user
   */
  const fetchPublishedPostsCount = useCallback(async (targetUserId) => {
  try {
    setPostsCountLoading(true);
    setPostsCountError(null); // Reset error state
    
    const profileId = targetUserId || getProfileId();
    
    // Validate user ID exists before making the request
    if (!profileId) {
      throw new Error("No user ID available for post count fetch");
    }

    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/blogs/post-counts/${profileId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check for both success flag and valid data
    if (!response.data?.success || !response.data.data) {
      throw new Error(response.data?.error || "Invalid response format");
    }

    // Handle different response formats
    const countsData = response.data.data;
    let publishedCount = 0;

    if (typeof countsData === 'number') {
      // Simple count response: { data: 15 }
      publishedCount = countsData;
    } else if (typeof countsData === 'object' && countsData.published !== undefined) {
      // Detailed counts response: { data: { published: 15, draft: 3 } }
      publishedCount = countsData.published;
    }

    setPublishedPostsCount(publishedCount);
    setPostCounts(typeof countsData === 'object' ? countsData : { published: publishedCount });

  } catch (err) {
    console.error("Posts count fetch error:", err.message);
    setPostsCountError(err.message);
    setPublishedPostsCount(0);
    setPostCounts({ published: 0 });
    
    // Show user-friendly error message
    toast.error(err.response?.data?.error || "Failed to load post counts");
  } finally {
    setPostsCountLoading(false);
  }
}, [getProfileId]);

  /**
   * Handles updating the profile state after edits
   */
  const handleProfileUpdate = useCallback(
    (updatedFields) => {
      setProfile((prev) => ({
        ...prev,
        ...updatedFields,
      }));

      // Refetch if bio or social links were updated
      if (updatedFields.bio || updatedFields.socialLinks) {
        fetchProfile();
      }
    },
    [fetchProfile]
  );

  /**
   * Toggles follow status for the profile
   */
  const handleFollowToggle = useCallback(async () => {
    if (!user || !profile) return;

    if (!user) {
      toast.info("Please login to follow users");
      navigate("/login");
      return;
    }

    try {
      setIsFollowLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/follow/${profile._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFollowing(response.data.isFollowing);
      setProfile((prev) => ({
        ...prev,
        followersCount: response.data.followersCount,
        followingCount: response.data.followingCount,
      }));

      toast.success(
        response.data.isFollowing
          ? `Now following ${profile.username}`
          : `Unfollowed ${profile.username}`
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update follow status"
      );
    } finally {
      setIsFollowLoading(false);
    }
  }, [user, profile, navigate]);

  /**
   * Handles follow changes from modals
   */
  const handleFollowChange = useCallback(
    (userId, newState) => {
      setFollowUpdate((prev) => ({
        ...prev,
        [userId]: newState,
      }));
      fetchProfile(); // Refresh profile data after follow change
    },
    [fetchProfile]
  );

  /**
   * Copies the profile URL to clipboard
   */
  const copyProfileUrl = useCallback(() => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  }, [profileUrl]);

  // Effect to load profile and posts count
  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
      if (getProfileId()) {
        await fetchPublishedPostsCount(getProfileId());
      }
    };

    if (user || userId) {
      loadData();
    }
  }, [userId, user?._id, fetchProfile, fetchPublishedPostsCount, getProfileId]);

  // Effect to refresh profile after follow updates
  useEffect(() => {
    if (Object.keys(followUpdate).length > 0) {
      fetchProfile();
    }
  }, [followUpdate, fetchProfile]);

  // Loading state
  if (authLoading || loading) return <LoadingSpinner fullScreen />;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Profile Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all w-full sm:w-auto"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Wait for initial load to complete
  if (!profile || !initialLoadComplete) return <LoadingSpinner fullScreen />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <FloatingBookElements />

      {/* Mobile menu toggle button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <FiX className="text-gray-700 dark:text-gray-200 text-xl" />
          ) : (
            <FiMenu className="text-gray-700 dark:text-gray-200 text-xl" />
          )}
        </button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10"
      >
        {/* Profile URL Sharing (visible only to profile owner) */}
        {isOwnProfile && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ${
              isMobile && mobileMenuOpen ? "block" : "hidden sm:block"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center w-full">
                <FiLink2 className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 mr-2 truncate text-sm sm:text-base"
                  onClick={(e) => e.target.select()}
                  aria-label="Profile URL"
                />
              </div>
              <button
                onClick={copyProfileUrl}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center w-full sm:w-auto justify-center"
                aria-label="Copy profile URL"
              >
                <FaCopy className="mr-2" />
                Copy
              </button>
            </div>
          </motion.div>
        )}

        {/* Follow Button (visible to other users) */}
        {!isOwnProfile && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-6 flex ${
              isMobile ? "justify-center" : "justify-end"
            } ${isMobile && mobileMenuOpen ? "block" : "hidden sm:block"}`}
          >
            <button
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium flex items-center justify-center ${
                isFollowing
                  ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
              }`}
              aria-label={isFollowing ? "Unfollow user" : "Follow user"}
            >
              {isFollowLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : isFollowing ? (
                <>
                  <FiUserMinus className="mr-2" />
                  <span className="hidden sm:inline">Following</span>
                  <span className="sm:hidden">Following</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" />
                  <span className="hidden sm:inline">Follow</span>
                  <span className="sm:hidden">Follow</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Mobile menu overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
            role="button"
            aria-label="Close menu"
            tabIndex={0}
          />
        )}

        {/* Profile Header Section */}
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onUpdate={handleProfileUpdate}
          isMobile={isMobile}
        />

        {/* Profile Stats Section */}
        <ProfileStats
          postsCount={postsCountLoading ? "..." : publishedPostsCount}
          followersCount={profile.followersCount || 0}
          followingCount={profile.followingCount || 0}
          readingTime={profile.readingTime || 0}
          isOwnProfile={isOwnProfile}
          onPostsClick={() => setActiveModal("posts")}
          onFollowersClick={() => setActiveModal("followers")}
          onFollowingClick={() => setActiveModal("following")}
          onReadingClick={() => setActiveModal("reading")}
        />

        {/* Main Content Area with Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
        >
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (isMobile) setMobileMenuOpen(false);
            }}
            isOwnProfile={isOwnProfile}
            isMobile={isMobile}
          />

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {/* Posts Tab Content */}
              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfilePostsGrid userId={profile._id} isMobile={isMobile} />
                </motion.div>
              )}

              {/* Drafts Tab Content (only visible to owner) */}
              {activeTab === "drafts" && isOwnProfile && (
                <motion.div
                  key="drafts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileDrafts isMobile={isMobile} />
                </motion.div>
              )}

              {/* Achievements Tab Content */}
              {activeTab === "achievements" && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileAchievements
                    achievements={profile.achievements || []}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <FollowersModal
        isOpen={activeModal === "followers"}
        onClose={() => setActiveModal(null)}
        userId={profile._id}
        onFollowChange={handleFollowChange}
      />

      <FollowingModal
        isOpen={activeModal === "following"}
        onClose={() => setActiveModal(null)}
        userId={profile._id}
        onFollowChange={handleFollowChange}
      />

      {/* Decorative floating elements (desktop only) */}
      {!isMobile && (
        <motion.div
          variants={floatingElements}
          initial="hidden"
          animate="visible"
          className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        >
          <motion.div
            variants={floatingElement}
            className="absolute top-20 left-10 text-purple-300 dark:text-purple-800 text-6xl opacity-30"
          >
            <FiBookOpen />
          </motion.div>
          <motion.div
            variants={floatingElement}
            className="absolute bottom-32 right-16 text-indigo-300 dark:text-indigo-800 text-5xl opacity-30"
          >
            <FiFeather />
          </motion.div>
          <motion.div
            variants={floatingElement}
            className="absolute top-1/3 right-24 text-pink-300 dark:text-pink-800 text-7xl opacity-30"
          >
            <FiBookmark />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
