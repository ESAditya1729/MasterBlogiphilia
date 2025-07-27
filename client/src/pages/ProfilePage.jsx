import React, { useEffect, useState } from "react";
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
import LoadingSpinner from "../utils/LoadingSpinner";
import FloatingBookElements from "../components/Dash-Profile/FloatingBookElements";
import ProfileHeader from "../components/Dash-Profile/ProfileHeader";
import ProfileStats from "../components/Dash-Profile/ProfileStats";
import ProfileTabs from "../components/Dash-Profile/ProfileTabs";
import ProfilePostsGrid from "../components/Dash-Profile/ProfilePostsGrid";
import ProfileDrafts from "../components/Dash-Profile/ProfileDrafts";
import ProfileAchievements from "../components/Dash-Profile/ProfileAchievements";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

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

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Enhanced isOwnProfile calculation
  const isOwnProfile = !userId || 
                     userId === user?._id || 
                     (userId.includes("-") && userId.split("-").pop() === user?._id);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Wait for user to be available if we don't have it yet
      if (!user && !userId) {
        return;
      }

      const token = localStorage.getItem("token");
      const currentUserId = user?._id;
      const idToFetch = userId || currentUserId;

      // Extract ID from URL if it's in slug format (username-id)
      const profileId = idToFetch.includes("-")
        ? idToFetch.split("-").pop()
        : idToFetch;

      // Verify if the extracted ID is valid
      if (!/^[0-9a-fA-F]{24}$/.test(profileId)) {
        throw new Error("Invalid user identifier");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${profileId}/full-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Generate clean URL (username-id format)
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

      // Update browser URL if different (without page reload)
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

      // Redirect to clean URL if ID was valid but URL wasn't in slug format
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
  };

  const handleProfileUpdate = (updatedFields) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }));

    if (updatedFields.bio || updatedFields.socialLinks) {
      fetchProfile();
    }
  };

  const handleFollowToggle = async () => {
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
  };

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  useEffect(() => {
    console.log("Current user:", user?._id);
    console.log("Profile user:", profile?._id);
    console.log("isOwnProfile:", isOwnProfile);
    
    // Only fetch if we have the necessary data
    if (user || userId) {
      fetchProfile();
    }
  }, [userId, user?._id]);

  if (authLoading || loading) return <LoadingSpinner fullScreen />;

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

  if (!profile || !initialLoadComplete) return <LoadingSpinner fullScreen />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <FloatingBookElements />

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
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
        {/* Profile Actions Section (URL Sharing + Follow) */}
        {/* Profile URL Sharing Section - ONLY shown for OWN profile */}
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
                />
              </div>
              <button
                onClick={copyProfileUrl}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center w-full sm:w-auto justify-center"
              >
                <FaCopy className="mr-2" />
                Copy
              </button>
            </div>
          </motion.div>
        )}

        {/* Follow Button - ONLY shown for OTHER profiles */}
        {!isOwnProfile && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-6 flex ${isMobile ? "justify-center" : "justify-end"} ${
              isMobile && mobileMenuOpen ? "block" : "hidden sm:block"
            }`}
          >
            <button
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium flex items-center justify-center ${
                isFollowing
                  ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
              }`}
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

        {/* Mobile Menu Overlay */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onUpdate={handleProfileUpdate}
          isMobile={isMobile}
        />

        {/* Profile Stats */}
        <ProfileStats
          postsCount={profile.postsCount || 0}
          followersCount={profile.followersCount || 0}
          followingCount={profile.followingCount || 0}
          readingTime={profile.readingTime || 0}
          isOwnProfile={isOwnProfile}
          onFollowersClick={() => {
            setActiveTab("followers");
            if (isMobile) setMobileMenuOpen(false);
          }}
          onFollowingClick={() => {
            setActiveTab("following");
            if (isMobile) setMobileMenuOpen(false);
          }}
          isMobile={isMobile}
        />

        {/* Profile Content Tabs */}
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

      {/* Decorative Floating Elements - Hidden on mobile for performance */}
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