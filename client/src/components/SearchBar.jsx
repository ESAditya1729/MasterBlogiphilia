import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { FiSearch, FiX, FiUserPlus, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  const fetchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/search?query=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 401) {
        console.error("Unauthorized. Please log in again.");
        return;
      }

      const data = await res.json();
      setResults(data);
      setActiveIndex(-1); // Reset active index on new results
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchUsers, 500);

  useEffect(() => {
    debouncedFetch(query);
    return debouncedFetch.cancel;
  }, [query]);

  const handleFollow = async (userId, isCurrentlyFollowing, e) => {
    e.stopPropagation(); // Prevent triggering profile navigation
    try {
      const method = isCurrentlyFollowing ? "DELETE" : "POST";

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/follow/${userId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setResults((prevResults) =>
          prevResults.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  isFollowing: !isCurrentlyFollowing,
                  followersCount: data.followerCount,
                }
              : user
          )
        );
      }
    } catch (err) {
      console.error("Follow/Unfollow failed", err);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (!results.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < results.length) {
          const user = results[activeIndex];
          handleViewProfile(user.id);
        }
        break;
      case "Escape":
        setIsFocused(false);
        break;
      default:
        break;
    }
  };

  const handleViewProfile = (userId) => {
    onClose?.(); // Close the modal first if onClose prop exists
    navigate(`/profile/${userId}`);
    setIsFocused(false);
    setQuery("");
  };

  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const activeItem = resultsRef.current.children[activeIndex];
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  // Function to generate initials from username
  const getInitials = (username) => {
    if (!username) return "";
    const parts = username.split(/[ -]/);
    let initials = "";
    
    for (let i = 0; i < Math.min(2, parts.length); i++) {
      if (parts[i].length > 0) {
        initials += parts[i][0].toUpperCase();
      }
    }
    
    return initials;
  };

  // Function to generate a consistent color based on user ID or username
  const getAvatarColor = (id) => {
    const colors = [
      "bg-indigo-500", "bg-pink-500", "bg-purple-500", "bg-blue-500",
      "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-teal-500"
    ];
    const hash = id ? id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  return (
    <div className="relative max-w-md w-full mx-auto" ref={searchRef}>
      <div
        className={`relative flex items-center transition-all duration-200 ${
          isFocused ? "ring-2 ring-indigo-500 shadow-lg" : ""
        } bg-white dark:bg-gray-800 rounded-lg shadow-sm`}
      >
        <FiSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="w-full pl-10 pr-8 py-3 text-gray-700 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-0 rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search bloggers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isFocused && (isLoading || results.length > 0)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {(isLoading || (results.length > 0 && isFocused)) && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
          role="listbox"
          ref={resultsRef}
        >
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </div>
              {results.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                  {results.map((user, index) => (
                    <li
                      key={user.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        index === activeIndex ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          {user.profilePicture ? (
                            <img
                              src={`${user.profilePicture}`}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(user.id)}`}
                            >
                              {getInitials(user.username)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.username}
                            </p>
                            {user.bio && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleFollow(user.id, user.isFollowing, e)}
                          className={`text-sm px-3 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                            user.isFollowing
                              ? "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          } whitespace-nowrap`}
                        >
                          {user.isFollowing ? (
                            <span>Following</span>
                          ) : (
                            <>
                              <FiUserPlus size={14} />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No users found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;