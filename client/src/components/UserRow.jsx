// components/UserRow.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const UserRow = ({ userData, onFollowChange }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  const isSelf = user._id === userData._id;

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/follow/${userData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to toggle follow state");
      }

      setIsFollowing((prev) => !prev);
      onFollowChange && onFollowChange(userData._id, !isFollowing);
    } catch (error) {
      console.error("Follow toggle error:", error);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center space-x-3">
        <img
          src={userData.profilePicture || "/default-profile.png"}
          className="w-10 h-10 rounded-full object-cover"
          alt={`${userData.username}'s profile`}
        />
        <Link to={`/profile/${userData._id}`} className="text-blue-600 font-medium">
          {userData.username}
        </Link>
      </div>

      {!isSelf && (
        <button
          onClick={handleFollowToggle}
          className={`text-sm px-3 py-1 rounded transition ${
            isFollowing
              ? "bg-red-200 text-red-700 hover:bg-red-300"
              : "bg-blue-200 text-blue-700 hover:bg-blue-300"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserRow;
