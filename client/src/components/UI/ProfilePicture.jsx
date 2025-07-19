import React from 'react';

const ProfilePicture = ({ user }) => {
  return (
    <div className="relative">
      <img
        src={user.profilePicture || '/avatars/default.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
      />
    </div>
  );
};

export default ProfilePicture;
