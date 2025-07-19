import React, { useRef } from 'react';

const ProfilePicture = ({ user, handleProfilePicClick, fileInputRef, handleProfilePicChange }) => {
  return (
    <div className="relative">
      <img
        src={user.profilePicture || '/avatars/default.png'}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg cursor-pointer"
        onClick={handleProfilePicClick}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfilePicChange}
      />
    </div>
  );
};

export default ProfilePicture;
