import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Feather,
} from "lucide-react";
import Logo from "../utils/Logo";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Overview", icon: Home, path: "/dashboard" },
    { label: "Library", icon: BookOpen, path: "/dashboard/library" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/full-profile`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data) {
          throw new Error("No profile data received");
        }

        // Map the backend response to expected frontend structure
        const profileData = {
          username: response.data.username,
          email: response.data.email,
          profilePicture: response.data.profilePicture || "/default-profile.jpg",
          bio: response.data.bio,
          followersCount: response.data.followersCount || 0,
          followingCount: response.data.followingCount || 0,
          createdAt: response.data.createdAt
        };

        setUserProfile(profileData);
      } catch (err) {
        console.error("Profile fetch error:", {
          error: err,
          response: err.response,
          config: err.config
        });
        
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 p-4 hidden md:flex flex-col justify-between transition-all duration-300 relative overflow-hidden`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 border-r-2 border-transparent pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-20"></div>
        <div className="absolute inset-y-0 left-0 w-0.5 bg-emerald-400/30"></div>
      </div>

      {/* Top Section - Profile and Nav */}
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative group">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            ) : error ? (
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <User size={20} className="text-red-500" />
              </div>
            ) : (
              <>
                <img
                  src={userProfile?.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-emerald-400/30 hover:border-emerald-400/50 transition-all"
                />
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {userProfile?.username || "Profile"}
                  </div>
                )}
              </>
            )}
          </div>
          {!isCollapsed && (
            <div className="text-center">
              {loading ? (
                <>
                  <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto"></div>
                </>
              ) : error ? (
                <div className="text-red-500 text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  {error}
                  <button 
                    onClick={() => window.location.reload()}
                    className="block mt-1 text-emerald-600 hover:underline text-xs"
                  >
                    Click to retry
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">
                    {userProfile?.username || "User"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                    {userProfile?.email || "No email"}
                  </p>
                  {userProfile?.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-2">
                      {userProfile.bio}
                    </p>
                  )}
                  <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{userProfile?.followersCount || 0} Followers</span>
                    <span>{userProfile?.followingCount || 0} Following</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full mb-6 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight
              size={20}
              className="text-slate-600 dark:text-slate-300 group-hover:text-emerald-500"
            />
          ) : (
            <ChevronLeft
              size={20}
              className="text-slate-600 dark:text-slate-300 group-hover:text-emerald-500"
            />
          )}
        </button>

        {/* Brand Logo Section */}
        <div
          className={`flex items-center gap-2 text-2xl font-bold text-emerald-600 mb-8 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {isCollapsed ? (
            <Feather
              size={26}
              className="text-emerald-600 hover:text-emerald-500 transition-colors"
            />
          ) : (
            <Logo />
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `group flex items-center ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                } py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              {!isCollapsed && <span>{label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-3 px-3"
          } py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors w-full`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;