import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import UserListModal from "../Modals/UserListModals";
import { getThemeColors } from "./ThemeColor";
import LevelBar from "./LevelBar";
import UserStats from "./UserStats";
import BioSection from "./BioSection";
import TabMenu from "./TabMenu";
import CollapsedHeader from "./CollapsedHeader";
import ProfilePicture from "./ProfilePicture";

// Animation configuration
const MOTION_CONFIG = {
  scrollTransition: {
    type: "spring",
    damping: 20,
    stiffness: 250,
  },
  collapseTransition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
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

  const colors = getThemeColors(darkMode);

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkDark = () => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setLoggedInUserId(payload.userId);
    }
  }, []);

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
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setBio(data.bio || "");
        if (data.profilePicture) {
          const img = new Image();
          img.src = `${process.env.REACT_APP_API_BASE_URL}${data.profilePicture}`;
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
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
      console.error("Bio update failed:", err);
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
          headers: { Authorization: `Bearer ${token}` },
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

  const userLevel = Math.min(Math.floor((user.followers?.length || 0) / 10) + 1, 10);
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
        className={`border ${colors.border} ${colors.shadow} ${colors.card} backdrop-blur-sm bg-opacity-90 px-4`}
        animate={{
          scale: isScrolled ? 0.985 : 1,
          boxShadow: isScrolled
            ? darkMode
              ? "0 4px 6px -1px rgba(0,0,0,0.3)"
              : "0 4px 6px -1px rgba(0,0,0,0.1)"
            : darkMode
            ? "0 10px 15px -3px rgba(0,0,0,0.3)"
            : "0 10px 15px -3px rgba(0,0,0,0.1)",
        }}
        transition={MOTION_CONFIG.scrollTransition}
      >
        {isScrolled ? (
          <CollapsedHeader
            user={user}
            colors={colors}
            setShowFollowers={setShowFollowers}
            setShowFollowing={setShowFollowing}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION_CONFIG.collapseTransition}
          >
            <div className="flex items-center justify-between py-4">
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
              <LevelBar userLevel={userLevel} />
            </div>

            <div className="mt-2 flex justify-center">
              <UserStats
                user={user}
                setShowFollowers={setShowFollowers}
                setShowFollowing={setShowFollowing}
                colors={colors}
              />
            </div>

            <BioSection
              bio={bio}
              editing={editing}
              colors={colors}
              handleSave={handleSave}
              setBio={setBio}
              setEditing={setEditing}
            />

            <div className="mt-4">
              <SearchBar />
            </div>
          </motion.div>
        )}

        <TabMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          colors={colors}
          isScrolled={isScrolled}
        />

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
