import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Layout/Header";
import AnimatedWelcome from "../components/UI/AnimatedWelcome";
import UserProfileBox from "../components/UI/UserProfileBox";
import FeaturedBlogs from "../components/Layout/tabs/FeaturedBlogs";
import GenreBlogs from "../components/Layout/tabs/GenreBlogs";
import SavedBlogs from "../components/Layout/tabs/SavedBlogs";
import RecentlyVisited from "../components/Layout/tabs/RecentlyVisited";
import FollowersBlogs from "../components/Layout/tabs/FollowersBlogs";
import GenreDropdown from "../components/Layout/tabs/GenreSelector";

const Home = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const token = localStorage.getItem("authToken");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id;
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "featured":
        return <FeaturedBlogs userId={userId} />;
      case "genre":
        return (
          <div className="space-y-4">
            <GenreDropdown 
              selectedGenre={selectedGenre}
              onSelect={(genre) => setSelectedGenre(genre)} 
            />
            <GenreBlogs genre={selectedGenre} userId={userId} />
          </div>
        );
      case "saved":
        return <SavedBlogs userId={userId} />;
      case "visited":
        return <RecentlyVisited userId={userId} />;
      case "followers":
        return <FollowersBlogs userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="sticky top-[64px] z-40 bg-gradient-to-b from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <AnimatedWelcome />
          {userId && (
            <UserProfileBox
              userId={userId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Home;