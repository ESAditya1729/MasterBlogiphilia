import React, { useEffect, useState } from "react";
import { UsersIcon } from "@heroicons/react/24/outline";

const UserListModal = ({ title, type, userId, onClose, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId);
    } catch (err) {
      console.error("Failed to parse token:", err);
      setError("Authentication error");
      setLoading(false);
      return;
    }

    const fetchList = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/${type}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch ${type}`);
        }

        const response = await res.json();
        const processedUsers = response.data || [];

        setUsers(processedUsers);
      } catch (err) {
        console.error(err);
        setError(err.message || `Failed to load ${type}`);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [type, userId]);

  const handleFollowToggle = async (targetId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/follow/${targetId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Follow/unfollow failed");
      }

      if (type === "following") {
        // Remove from list on unfollow
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== targetId)
        );
      } else {
        // Toggle isFollowing flag for Followers list
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === targetId
              ? { ...user, isFollowing: !user.isFollowing }
              : user
          )
        );
      }

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Follow action failed:", err);
      setError(err.message || "Failed to update follow status");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-sm w-full shadow-xl relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-sm text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => {
              // For Following list, always show "Unfollow"
              const isFollowing = type === "following" ? true : user.isFollowing;

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.profilePicture
                          ? `${user.profilePicture}?v=${Date.now()}`
                          : "https://i.pravatar.cc/100"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium block">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user._id !== currentUserId && (
                    <button
                      onClick={() => handleFollowToggle(user._id)}
                      className={`text-xs px-3 py-1 rounded-full transition ${
                        isFollowing
                          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                      }`}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-6">
              <UsersIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No {type} to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
