import React, { useRef } from "react";

const ProfilePicture = ({ user, handleProfilePicClick, fileInputRef, handleProfilePicChange }) => {
  return (
    <div className="relative cursor-pointer" onClick={handleProfilePicClick}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-md scale-110 transition-all duration-300"></div>
      <img
        src={
          user.profilePicture
            ? `${process.env.REACT_APP_API_BASE_URL}${user.profilePicture}`
            : "https://i.pravatar.cc/100"
        }
        alt="Profile"
        className="relative rounded-full border-2 border-white dark:border-gray-800 w-16 h-16 shadow-md"
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