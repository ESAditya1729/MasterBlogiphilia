import { useEffect, useState } from "react";
import UserRow from "../UserRow";

const FollowingModal = ({ isOpen, onClose, userId }) => {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    fetchFollowing();
  }, [isOpen]);

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setFollowing(data.data);
    } catch (err) {
      console.error("Failed to load following", err);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Following</h2>
        <div className="max-h-96 overflow-y-auto">
          {following.map((user) => (
            <UserRow key={user._id} userData={user} />
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default FollowingModal;
