import React, { useState } from 'react';
import FeaturedBlogs from './tabs/FeaturedBlogs';
import GenreDropdown from './tabs/GenreSelector';
import SavedBlogs from './tabs/SavedBlogs';
import RecentlyVisited from './tabs/RecentlyVisited';
import FollowerBlogs from './tabs/FollowersBlogs';

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const tabs = [
    { key: 'featured', label: 'Featured Blogs' },
    { key: 'genre', label: 'Choose Genre ▾' },
    { key: 'saved', label: 'My Saved Blogs' },
    { key: 'visited', label: 'Recently Visited' },
    { key: 'followers', label: 'Blogs from My Followers' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'featured':
        return <FeaturedBlogs />;
      case 'genre':
        return <GenreDropdown />;
      case 'saved':
        return <SavedBlogs />;
      case 'visited':
        return <RecentlyVisited />;
      case 'followers':
        return <FollowerBlogs />;
      default:
        return <FeaturedBlogs />;
    }
  };

  return (
    <div className="w-full z-30">
      {/* Sticky Tab Header */}
      <div className="sticky top-[360px] z-30 backdrop-blur-md bg-transparent pt-2 pb-1">
        <div className="flex items-center gap-3 px-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === 'genre') {
                  setShowGenreDropdown((prev) => !prev);
                } else {
                  setShowGenreDropdown(false);
                }
              }}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200
                ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/40 animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-indigo-300 hover:to-purple-300 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Dropdown Panel */}
      {showGenreDropdown && activeTab === 'genre' && (
        <div className="z-20 px-4 py-2">
          <GenreDropdown />
        </div>
      )}

      {/* Tab Content Area */}
      <div className="p-4">{renderTabContent()}</div>
    </div>
  );
};

export default TabsSection;
