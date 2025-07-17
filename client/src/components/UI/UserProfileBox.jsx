import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import UserListModal from "../Modals/UserListModals";
import { UsersIcon, UserPlusIcon } from "@heroicons/react/24/solid";

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

  const colors = darkMode
    ? {
        bg: "bg-gradient-to-br from-gray-800 to-gray-900",
        text: "text-gray-100",
        border: "border-gray-700",
        shadow: "shadow-lg shadow-black/30",
        stats: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent",
        card: "bg-gray-800",
        button: "bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white",
        tabBg: "bg-gray-800/50",
        tabText: "text-gray-300",
        tabHover: "hover:text-white",
      }
    : {
        bg: "bg-gradient-to-br from-white to-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
        shadow: "shadow-lg shadow-gray-300/30",
        stats: "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
        card: "bg-white",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
        tabBg: "bg-gray-100/50",
        tabText: "text-gray-600",
        tabHover: "hover:text-gray-900",
      };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        if (!res.ok) throw new Error("Failed to fetch full user profile");
        const data = await res.json();
        setUser(data);
        setBio(data.bio || "");
      } catch (err) {
        console.error("Failed to fetch full user profile:", err);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSave = async () => {
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
  };

  const handleProfilePicClick = () => fileInputRef.current.click();

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await fetch(
        "${process.env.REACT_APP_API_BASE_URL}/api/users/upload-profile-picture",
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
  };

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

  const renderLevelBar = () => (
    <div className="flex items-center gap-1 mb-1 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i < userLevel
              ? "bg-gradient-to-b from-indigo-500 to-purple-500"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
      <div
        className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowFollowers(true)}
      >
        <span className="flex items-center gap-1 text-base font-bold text-indigo-600 dark:text-indigo-400">
          <UsersIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:animate-pulse" />
          {user.followersCount || 0}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 tracking-wide group-hover:underline">
          Followers
        </span>
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 rounded" />

      <div
        className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowFollowing(true)}
      >
        <span className="flex items-center gap-1 text-base font-bold text-indigo-600 dark:text-indigo-400">
          <UserPlusIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:animate-pulse" />
          {user.followingCount || 0}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 tracking-wide group-hover:underline">
          Following
        </span>
      </div>
    </div>
  );

  return (
    <div className="sticky top-0 z-20">
      <motion.div
        className={`border ${colors.border} ${colors.shadow} ${colors.card} backdrop-blur-sm bg-opacity-90 transition-all duration-300 ${
          isScrolled ? "rounded-b-2xl py-2 px-4" : "rounded-2xl py-4 px-4"
        }`}
        animate={{
          boxShadow: isScrolled
            ? darkMode
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : darkMode
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Collapsed Header - Only shown when scrolled */}
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    user.profilePicture
                      ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
                      : "https://i.pravatar.cc/100"
                  }
                  alt="Profile"
                  className="rounded-full border-2 border-white dark:border-gray-800 w-10 h-10 shadow-md"
                />
              </div>
              <h3 className={`font-bold ${colors.text} text-md`}>
                {user.username}
              </h3>
            </div>
            <div className="flex items-center gap-4">{renderStats()}</div>
          </motion.div>
        )}

        {/* Expanded Content - Hidden when scrolled */}
        {!isScrolled && (
          <>
            {/* Header and Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="relative cursor-pointer"
                  onClick={handleProfilePicClick}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-md scale-110 transition-all duration-300"></div>
                  <img
                    src={
                      user.profilePicture
                        ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
                        : "https://i.pravatar.cc/100"
                    }
                    alt="Profile"
                    className="relative rounded-full border-2 border-white dark:border-gray-800 w-16 h-16 shadow-md"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </div>
                <div>
                  <h3 className={`font-bold ${colors.text} text-lg`}>
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {joinDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">{renderLevelBar()}</div>
            </div>

            <div className="mt-2 flex justify-center">{renderStats()}</div>

            {/* Bio Section */}
            <div className="mt-4">
              {editing ? (
                <>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-xl border ${colors.border} dark:bg-gray-700 ${colors.text} text-sm resize-none font-sans`}
                    placeholder="Write something about yourself..."
                    maxLength="500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSave}
                      className={`px-4 py-1.5 text-sm rounded-xl ${colors.button} transition shadow-md`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className={`px-4 py-1.5 text-sm rounded-xl border ${colors.border} ${colors.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className={`text-sm font-sans leading-relaxed ${
                      bio ? colors.text : "text-gray-400 italic"
                    }`}
                  >
                    {bio || "No bio added yet."}
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1 mt-2 text-xs rounded-xl bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-gray-600 transition shadow-sm"
                  >
                    Edit Bio
                  </button>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <SearchBar />
            </div>
          </>
        )}

        {/* Tab Menu - Always visible */}
        <div className={`${isScrolled ? "mt-1" : "mt-6"} flex justify-center`}>
          <div
            className={`flex items-center gap-1 p-1 ${colors.tabBg} backdrop-blur-sm rounded-full shadow-inner`}
          >
            {[
              { key: "featured", label: "Featured" },
              { key: "genre", label: "Genres" },
              { key: "saved", label: "Saved" },
              { key: "visited", label: "Recent" },
              { key: "followers", label: "Following" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "text-white"
                    : `${colors.tabText} ${colors.tabHover}`
                }`}
              >
                {activeTab === tab.key && (
                  <motion.span
                    layoutId="glowingTabBg"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-500/30"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">
                  {tab.label}
                </span>
                {activeTab === tab.key && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-pink-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

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

export default UserProfileBox;