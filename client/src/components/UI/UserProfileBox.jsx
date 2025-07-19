import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import UserListModal from "../Modals/UserListModals";
import { getThemeColors } from "./ThemeColor";
import LevelBar from "./LevelBar";
import UserStats from "./UserStats";
import BioSection from "./BioSection";
import ProfilePicture from "./ProfilePicture";
import ActivityStats from "./ActivityStats";
const MOTION_CONFIG = {
  scrollTransition: {
    type: "spring",
    damping: 20,
    stiffness: 250,
  },
};

const UserProfileBox = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const fileInputRef = useRef();

  const colors = getThemeColors(darkMode);

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
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handleSave = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/bio`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bio }),
        }
      );

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

  const handleProfilePicClick = () => {
  fileInputRef.current?.click();
};

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
    <div className="z-10 mt-4">
      <motion.div
        className={`border ${colors.border} ${colors.shadow} ${colors.card} backdrop-blur-sm bg-opacity-90 px-4`}
        transition={MOTION_CONFIG.scrollTransition}
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

        {/* ⬇️ NEW ACTIVITY STATS SECTION */}
        <ActivityStats
          stats={{
            posts: user.totalPosts || 0,
            likes: user.totalLikes || 0,
            comments: user.totalComments || 0,
            saved: user.savedPosts?.length || 0,
          }}
          colors={colors}
        />

        <div className="mt-8 px-2">
          <h3
            className={`text-sm font-medium text-gray-600 dark:text-gray-400 mb-2`}
          ></h3>
          <SearchBar />
          <br />
          <br />
        </div>

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
      <br />
      <br />
    </div>
  );
};

export default React.memo(UserProfileBox);
