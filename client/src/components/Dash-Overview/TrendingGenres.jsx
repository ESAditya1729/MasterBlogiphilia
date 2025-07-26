import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHash, FiArrowRight } from "react-icons/fi";

export const TrendingGenres = ({ onViewAll }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingGenres = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/blogs/trending-genres`);
        if (!res.ok) throw new Error("Failed to fetch genres");

        const data = await res.json();
        setGenres(data.length > 0 ? data : []);
      } catch (err) {
        console.error("Error fetching trending genres:", err);
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGenres();
  }, []);

  return (
    <motion.div
      className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold dark:text-white flex items-center">
          <FiHash className="mr-2 text-purple-500" />
          Trending Genres
        </h3>
        <button
          className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
          onClick={onViewAll}
        >
          View All <FiArrowRight className="ml-1" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading genres...</p>
      ) : genres.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No genres available</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {genres.map((genre, idx) => (
            <motion.div
              key={genre.name}
              className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 border border-purple-200 dark:border-gray-700 shadow-sm"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <h4 className="font-medium text-purple-800 dark:text-white capitalize">{genre.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {genre.posts} post{genre.posts !== 1 && "s"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
