import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHash, FiArrowRight } from "react-icons/fi";

export const TrendingGenres = ({ genres = [], loading = false, error = null, onViewAll }) => {
  // Transform genres data to match component expectations
  const transformedGenres = genres.map(genre => ({
    name: genre._id || genre.name || 'Unknown Genre',
    posts: genre.count || 0,
    totalViews: genre.totalViews || 0,
    totalLikes: genre.totalLikes || 0
  }));

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
          disabled={loading || error}
        >
          View All <FiArrowRight className="ml-1" />
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-500 dark:text-red-400">
          Error loading genres: {error}
        </p>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse h-20"
            />
          ))}
        </div>
      ) : transformedGenres.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No trending genres available</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {transformedGenres.map((genre, idx) => (
            <motion.div
              key={`${genre.name}-${idx}`}
              className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 border border-purple-200 dark:border-gray-700 shadow-sm"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <h4 className="font-medium text-purple-800 dark:text-white capitalize">
                {genre.name}
              </h4>
              {/* <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {genre.posts} post{genre.posts !== 1 && "s"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {genre.totalViews} views
                </p>
              </div> */}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};