import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const getUserBadgeInfo = (percent) => {
  if (percent < 30) return { label: "Newbie", filename: "Newbie" };
  if (percent < 70) return { label: "Newbie", filename: "Newbie" };
  return { label: "Writer", filename: "Writer" };
};

const BadgeSystem = ({ user }) => {
  const profileCompletion = user?.profileCompletion || 0;
  const [badge, setBadge] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { label, filename } = getUserBadgeInfo(profileCompletion);

    const fetchBadgeImage = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const encodedFilename = encodeURIComponent(filename);
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/media/image/User-Badges/${encodedFilename}`;
        
        const res = await fetch(url);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (!data?.success) {
          throw new Error(data?.message || "Failed to fetch badge image");
        }

        setBadge({ 
          label, 
          image: data.imageUrl,
          publicId: data.imageInfo?.public_id 
        });
      } catch (err) {
        console.error("Error fetching badge image:", err);
        setError(err.message || "Error loading badge");
        setBadge({ 
          label, 
          image: "/default-badge.png",
          isFallback: true 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadgeImage();
  }, [profileCompletion]);

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const labelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center relative">
          <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full w-full h-full" />
          <div className="absolute inset-4 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-full animate-spin-slow" />
        </div>
        <div className="mt-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          Unlocking your badge...
        </div>
      </motion.div>
    );
  }

  if (error && !badge?.isFallback) {
    return (
      <motion.div 
        className="text-red-500 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col items-center"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40"
        variants={badgeVariants}
        whileHover="hover"
      >
        {/* Badge glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
        
        {/* Badge border */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-br from-purple-500 to-pink-500 p-1">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
            <img
              src={badge.image}
              alt={badge.label}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-badge.png";
                setError("Could not load badge image");
              }}
            />
          </div>
        </div>

        {/* Badge level indicator */}
        {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3].map((level) => (
              <div 
                key={level}
                className={`w-2 h-2 rounded-full ${profileCompletion >= (level * 33) ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        </div> */}
      </motion.div>

      {/* <motion.div 
        className="mt-4 text-center"
        variants={labelVariants}
      >
        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          {badge.label}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {profileCompletion}% profile complete
        </div>
        {badge?.isFallback && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            (Default badge displayed)
          </div>
        )}
      </motion.div> */}
    </motion.div>
  );
};

export default BadgeSystem;