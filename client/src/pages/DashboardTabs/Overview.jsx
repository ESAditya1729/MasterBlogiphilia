import { useState } from "react";
import { motion } from "framer-motion";

import BlogViewModal from "../../components/modals/BlogViewModal";
import ViewAllPostsModal from "../../components/modals/ViewAllPostsModal";
import ViewAllGenresModal from "../../components/modals/ViewAllGenresModal";

import {
  OverviewHeader,
  StatsCards,
  TrendingPosts,
  TrendingGenres,
  SearchSection,
  HelpSection
} from "../../components/Dash-Overview";


const Overview = () => {
  const [selectedBlogId, setSelectedBlogId] = useState(null); 
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllGenres, setShowAllGenres] = useState(false);

  // TODO: Replace with API calls
  // const stats = [
  //   {
  //     title: "Total Users",
  //     value: 1024,
  //     trend: "+12%",
  //     trendColor: "text-green-500",
  //     icon: <span>👤</span>, // Replace with your real icon component
  //   },
  //   {
  //     title: "Total Posts",
  //     value: 345,
  //     trend: "+8%",
  //     trendColor: "text-green-500",
  //     icon: <span>📝</span>,
  //   },
  //   {
  //     title: "Comments",
  //     value: 892,
  //     trend: "+5%",
  //     trendColor: "text-green-500",
  //     icon: <span>💬</span>,
  //   },
  // ];

  const trendingPosts = [
    {
      id: "1",
      title: "Understanding React Server Components",
      author: "John Doe",
      views: 3400,
    },
    {
      id: "2",
      title: "Advanced CSS Techniques for 2025",
      author: "Jane Smith",
      views: 2780,
    },
  ];

  const trendingGenres = [
    {
      id: "tech",
      name: "Technology",
      postCount: 102,
    },
    {
      id: "design",
      name: "Design",
      postCount: 88,
    },
  ];

  return (
    <div className="space-y-8">
      <OverviewHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <StatsCards />

          <TrendingPosts
            posts={trendingPosts}
            onViewAll={() => setShowAllPosts(true)}
            onPostClick={setSelectedBlogId}
          />

          <TrendingGenres
            genres={trendingGenres}
            onViewAll={() => setShowAllGenres(true)}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="sticky top-6 space-y-8">
            <SearchSection />
            <HelpSection />
          </div>
        </div>
      </div>

      {/* Modals */}
      <BlogViewModal
        blogId={selectedBlogId}
        onClose={() => setSelectedBlogId(null)}
      />

      <ViewAllPostsModal
        posts={trendingPosts}
        isOpen={showAllPosts}
        onClose={() => setShowAllPosts(false)}
      />

      <ViewAllGenresModal
        genres={trendingGenres}
        isOpen={showAllGenres}
        onClose={() => setShowAllGenres(false)}
      />
    </div>
  );
};

export default Overview;
