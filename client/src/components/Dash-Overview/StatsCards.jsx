import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiBookOpen } from "react-icons/fi";

export const StatsCards = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, blogRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/stats/user-stats`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/stats/published-blogs`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (!userRes.ok || !blogRes.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const userData = await userRes.json();
        const blogData = await blogRes.json();

        const formattedStats = [
          {
            title: "Total Blogiphilians",
            value: userData.totalUsers,
            trend: "+12%",
            trendColor: "text-green-500",
            icon: <FiUsers size={20} />,
          },
          {
            title: "New Users (7 days)",
            value: userData.newUsers,
            trend: "+8%",
            trendColor: "text-green-500",
            icon: <FiTrendingUp size={20} />,
          },
          {
            title: "Published Blogs",
            value: blogData.totalPublishedBlogs || 0,
            // trend: "+10%",
            // trendColor: "text-green-500",
            icon: <FiBookOpen size={20} />,
          },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading stats...</p>;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className={`relative p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md border-l-4 ${
            idx === 0
              ? "border-blue-500"
              : idx === 1
              ? "border-green-500"
              : "border-purple-500"
          }`}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div
              className={`p-3 rounded-lg ${
                idx === 0
                  ? "bg-blue-100 dark:bg-blue-900"
                  : idx === 1
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-purple-100 dark:bg-purple-900"
              }`}
            >
              {stat.icon}
            </div>
            <span className={`text-xs font-medium ${stat.trendColor}`}>
              {stat.trend}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {stat.title}
            </p>
            <h2 className="text-2xl font-bold dark:text-white mt-1">
              {stat.value}
            </h2>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
