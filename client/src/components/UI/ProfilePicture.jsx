import React, { useRef, useState } from "react";

const ProfilePicture = ({ user, handleProfilePicClick, fileInputRef, handleProfilePicChange, size = "large" }) => {
  const [loaded, setLoaded] = useState(false);
  
  const sizes = {
    large: "w-16 h-16",
    small: "w-10 h-10"
  };

  return (
    <div 
      className={`relative cursor-pointer ${sizes[size]}`} 
      onClick={handleProfilePicClick}
    >
      {!loaded && (
        <div className={`absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse ${sizes[size]}`} />
      )}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-md scale-110 transition-all duration-300"></div>
      <img
        src={
          user.profilePicture
            ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
            : "https://i.pravatar.cc/100"
        }
        alt="Profile"
        className={`relative rounded-full border-2 border-white dark:border-gray-800 shadow-md transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${sizes[size]}`}
        onLoad={() => setLoaded(true)}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleProfilePicChange}
      />
    </div>
  );
};

export default ProfilePicture;