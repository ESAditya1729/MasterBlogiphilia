import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import UserListModal from "../Modals/UserListModals";
import { getThemeColors } from "./ThemeColors";
import LevelBar from "./LevelBar";
import UserStats from "./UserStats";
import BioSection from "./BioSection";
import TabMenu from "./TabMenu";
import CollapsedHeader from "./CollapsedHeader";
import ProfilePicture from "./ProfilePicture";

// Animation configuration constants
const MOTION_CONFIG = {
  scrollTransition: {
    type: "spring",
    damping: 20,
    stiffness: 300
  },
  collapseTransition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1]
  }
};

const UserProfileBox = ({ userId, activeTab, setActiveTab }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const fileInputRef = useRef();
  const scrollTimeoutRef = useRef();

  const colors = getThemeColors(darkMode);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolled(window.scrollY > 50);
    }, 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  // Dark mode detection
  useEffect(() => {
    const modeCheck = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };
    
    modeCheck();
    const observer = new MutationObserver(modeCheck);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Get logged in user ID
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setLoggedInUserId(payload.userId);
    }
  }, []);

  // Fetch user profile with preloading
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/full-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch full user profile");
        const data = await res.json();
        setUser(data);
        setBio(data.bio || "");

        // Preload profile picture
        if (data.profilePicture) {
          const img = new Image();
          img.src = `${process.env.REACT_APP_API_BASE_URL}${data.profilePicture}`;
        }
      } catch (err) {
        console.error("Failed to fetch full user profile:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSave = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditing(false);
      } else {
        throw new Error("Failed to update bio");
      }
    } catch (err) {
      console.error("Error updating bio:", err);
    }
  }, [bio, userId]);

  const handleProfilePicClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleProfilePicChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUser((prev) => ({ ...prev, profilePicture: data.url }));
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload profile picture.");
    }
  }, []);

  if (!user) return null;

  const userLevel = Math.min(
    Math.floor((user.followers?.length || 0) / 10) + 1,
    10
  );
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date Unknown";

  return (
    <div className="sticky top-0 z-20">
      <motion.div
        className={`border ${colors.border} ${colors.shadow} ${colors.card} backdrop-blur-sm bg-opacity-90 will-change-transform ${
          isScrolled ? "rounded-b-2xl py-2 px-4" : "rounded-2xl py-4 px-4"
        }`}
        initial={false}
        animate={{
          boxShadow: isScrolled
            ? darkMode
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : darkMode
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          padding: isScrolled ? "0.5rem 1rem" : "1rem 1rem",
          borderRadius: isScrolled ? "0 0 1rem 1rem" : "1rem"
        }}
        transition={MOTION_CONFIG.scrollTransition}
        layout
      >
        {/* Collapsed Header - Only shown when scrolled */}
        {isScrolled && (
          <CollapsedHeader
            user={user}
            colors={colors}
            setShowFollowers={setShowFollowers}
            setShowFollowing={setShowFollowing}
          />
        )}

        {/* Expanded Content - Hidden when scrolled */}
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION_CONFIG.collapseTransition}
            layout
          >
            {/* Header and Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ProfilePicture
                  user={user}
                  handleProfilePicClick={handleProfilePicClick}
                  fileInputRef={fileInputRef}
                  handleProfilePicChange={handleProfilePicChange}
                />
                <div>
                  <h3 className={`font-bold ${colors.text} text-lg`}>
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {joinDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <LevelBar userLevel={userLevel} />
              </div>
            </div>

            <div className="mt-2 flex justify-center">
              <UserStats
                user={user}
                setShowFollowers={setShowFollowers}
                setShowFollowing={setShowFollowing}
                colors={colors}
              />
            </div>

            {/* Bio Section */}
            <BioSection
              bio={bio}
              editing={editing}
              colors={colors}
              handleSave={handleSave}
              setBio={setBio}
              setEditing={setEditing}
            />

            {/* Search Bar */}
            <div className="mt-4">
              <SearchBar />
            </div>
          </motion.div>
        )}

        {/* Tab Menu - Always visible */}
        <TabMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          colors={colors}
          isScrolled={isScrolled}
        />

        {/* Followers Modal */}
        {showFollowers && (
          <UserListModal
            title="Followers"
            type="followers"
            userId={userId}
            onClose={() => setShowFollowers(false)}
          />
        )}
        {showFollowing && (
          <UserListModal
            title="Following"
            type="following"
            userId={userId}
            onClose={() => setShowFollowing(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(UserProfileBox);