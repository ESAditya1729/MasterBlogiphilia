import React from "react";

const ProfilePicture = ({ user, handleProfilePicClick, fileInputRef, handleProfilePicChange }) => {
  return (
    <div className="relative">
      <img
        src={`${user.profilePicture}?v=${Date.now()}`} // 👈 busts cache
        alt="Profile"
        className="w-16 h-16 rounded-full cursor-pointer hover:opacity-80 border border-gray-300 shadow-sm"
        onClick={handleProfilePicClick}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ProfilePicture;
