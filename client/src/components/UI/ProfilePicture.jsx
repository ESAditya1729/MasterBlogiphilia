import React from "react";

const ProfilePicture = ({ user, handleProfilePicClick, fileInputRef, handleProfilePicChange }) => {
  return (
    <div className="relative">
      <img
        src={user.profilePicture ? `${user.profilePicture}?v=${Date.now()}` : "/default.jpg"}
        alt="Profile"
        className="w-16 h-16 rounded-full cursor-pointer"
        onClick={handleProfilePicClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePicChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
};

export default ProfilePicture;
