import { useState, useEffect } from "react";
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
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trendingGenres, setTrendingGenres] = useState([]);
  const [loading, setLoading] = useState({
    posts: true,
    genres: true
  });
  const [error, setError] = useState({
    posts: null,
    genres: null
  });

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(prev => ({ ...prev, posts: true }));
        setError(prev => ({ ...prev, posts: null }));
        
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/trending`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trending posts: ${res.status}`);
        }

        const data = await res.json();
        
        if (data && Array.isArray(data.data)) {
          setTrendingPosts(data.data);
        } else if (data && Array.isArray(data)) {
          setTrendingPosts(data);
        } else {
          throw new Error("Invalid posts data format received from API");
        }
      } catch (err) {
        console.error("Error fetching trending posts:", err);
        setError(prev => ({ ...prev, posts: err.message }));
        setTrendingPosts([]);
      } finally {
        setLoading(prev => ({ ...prev, posts: false }));
      }
    };

    const fetchTrendingGenres = async () => {
      try {
        setLoading(prev => ({ ...prev, genres: true }));
        setError(prev => ({ ...prev, genres: null }));
        
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/trending-genres`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trending genres: ${res.status}`);
        }

        const { data } = await res.json();
        
        if (data && Array.isArray(data)) {
          // Transform API response to match expected format
          const transformedGenres = data.map(genre => ({
            id: genre._id,
            name: genre._id,
            postCount: genre.count,
            totalViews: genre.totalViews,
            totalLikes: genre.totalLikes
          }));
          setTrendingGenres(transformedGenres);
        } else {
          throw new Error("Invalid genres data format received from API");
        }
      } catch (err) {
        console.error("Error fetching trending genres:", err);
        setError(prev => ({ ...prev, genres: err.message }));
        setTrendingGenres([]);
      } finally {
        setLoading(prev => ({ ...prev, genres: false }));
      }
    };

    // Fetch both posts and genres in parallel
    Promise.all([fetchTrendingPosts(), fetchTrendingGenres()]);
  }, []);

  return (
    <div className="space-y-8">
      <OverviewHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <StatsCards />

          <TrendingPosts
            posts={trendingPosts}
            loading={loading.posts}
            error={error.posts}
            onViewAll={() => setShowAllPosts(true)}
            onPostClick={setSelectedBlogId}
          />

          <TrendingGenres
            genres={trendingGenres}
            loading={loading.genres}
            error={error.genres}
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
        onPostClick={setSelectedBlogId}
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