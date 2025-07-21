import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Layout/Header";
import AnimatedWelcome from "../components/UI/AnimatedWelcome";
import TagoreQuote from "../components/UI/TagoreQuote";
import MiniProfileBar from "../components/UI/MiniProfileBar";
import TabMenu from "../components/UI/TabMenu";
import BadgeSystem from "../components/UI/BadgeSystem";
import WeeklyChallenge from "../components/Layout/tabs/WeeklyChallenge";

// Placeholder components for each tab
const Leaderboard = () => <div className="p-6">🏆 Leaderboard Content</div>;
const News = () => <div className="p-6">📰 Company News Content</div>;
const Profile = () => <div className="p-6">👤 Profile Content</div>;

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("leaderboard");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId || decoded.id;
        setUserId(id);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const colors = {
    tabBg: "bg-white dark:bg-gray-900",
    tabText: "text-gray-600 dark:text-gray-300",
    tabHover: "hover:text-purple-600 dark:hover:text-purple-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md">
        <Navbar />
      </div>

      {/* Scaled Content */}
      <div
        className="origin-top-left pt-16"
        style={{
          transform: 'scale(0.67)',
          transformOrigin: 'top left',
          width: '149.25%',
          height: '149.25%',
        }}
      >
        {/* Sticky Tagore Quote */}
        <div className="sticky top-[64px] z-40">
          <TagoreQuote />
        </div>

        {/* Sticky Welcome + Badge */}
        <div className="sticky top-[120px] z-30 w-full flex justify-between items-start px-8">
          <div className="flex-1 pl-44"> 
            <AnimatedWelcome />
            <div className="mt-4 flex justify-center">
              <div className="w-full max-w-5xl px-4 ml-30">
                <MiniProfileBar userId={userId} />
              </div>
            </div>
          </div>
          <div className="ml-12 flex-shrink-0">
            <BadgeSystem user={{ profileCompletion: 65 }} />
          </div>
        </div>

        {/* Sticky Tab Menu */}
        <div className="sticky top-[320px] z-10">
          <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} colors={colors} />
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-32 px-4 max-w-7xl mx-auto">
          {activeTab === "challenges" && <WeeklyChallenge />}
          {activeTab === "news" && <News />}
          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Home;
