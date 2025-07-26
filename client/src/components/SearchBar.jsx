import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { FiSearch, FiX, FiUserPlus } from "react-icons/fi";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

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

  const handleFollow = async (userId, isCurrentlyFollowing) => {
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
          console.log("Selected user:", user.username);
        }
        break;
      case "Escape":
        setIsFocused(false);
        break;
      default:
        break;
    }
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

  return (
    <div className="relative max-w-md mx-auto" ref={searchRef}>
      <div
        className={`relative flex items-center transition-all duration-200 ${
          isFocused ? "ring-2 ring-indigo-500" : ""
        } bg-white dark:bg-gray-800 rounded-lg shadow-sm`}
      >
        <FiSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="w-full pl-10 pr-8 py-3 text-gray-700 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-0 rounded-lg"
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
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden"
          role="listbox"
          ref={resultsRef}
        >
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </div>
              {results.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                  {results.map((user, index) => (
                    <li
                      key={user.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        index === activeIndex ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              user.profilePicture
                                ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${user.profilePicture}`
                                : "https://via.placeholder.com/40"
                            }
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </p>
                            {user.bio && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur on click
                            handleFollow(user.id, user.isFollowing);
                          }}
                          className={`text-sm px-3 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                            user.isFollowing
                              ? "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-red-100 hover:text-red-600"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
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
