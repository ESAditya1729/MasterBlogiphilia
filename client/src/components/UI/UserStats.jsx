import React from "react";
import { UsersIcon, UserPlusIcon } from "@heroicons/react/24/solid";

const UserStats = ({ user, setShowFollowers, setShowFollowing, colors }) => {
  return (
    <div className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
      <div
        className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowFollowers(true)}
      >
        <span className="flex items-center gap-1 text-base font-bold text-indigo-600 dark:text-indigo-400">
          <UsersIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:animate-pulse" />
          {user.followersCount || 0}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 tracking-wide group-hover:underline">
          Followers
        </span>
      </div>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 rounded" />

      <div
        className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
        onClick={() => setShowFollowing(true)}
      >
        <span className="flex items-center gap-1 text-base font-bold text-indigo-600 dark:text-indigo-400">
          <UserPlusIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:animate-pulse" />
          {user.followingCount || 0}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 tracking-wide group-hover:underline">
          Following
        </span>
      </div>
    </div>
  );
};

export default UserStats;