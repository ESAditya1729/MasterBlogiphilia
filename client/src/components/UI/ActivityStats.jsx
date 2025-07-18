import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// Define theme-aware badge colors
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
const BADGE_COLORS = [
  "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-200",
  "bg-pink-100 text-pink-600 dark:bg-pink-800 dark:text-pink-200",
  "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200",
];

const sampleData = [
  { name: "Tech", value: 0 },
  { name: "Travel", value: 0 },
  { name: "Lifestyle", value: 0 },
  { name: "Poetry", value: 0 },
  { name: "Others", value: 0 },
];

// Default badge for now
const defaultBadges = [
  { name: "🎉 Newbie", description: "Welcome to Blogiphilia!" },
  // Future: Add logic to show more badges
];

const ActivityStats = ({ colors }) => {
  const total = sampleData.reduce((sum, item) => sum + item.value, 0);
  const hasActivity = total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mt-6 p-4 rounded-xl border ${colors.border} ${colors.shadow} bg-white dark:bg-gray-900`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
        Activity Summary
      </h3>

      {/* Chart Section */}
      {hasActivity ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={sampleData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              animationDuration={800}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {sampleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "6px",
                border: "none",
              }}
              labelStyle={{ color: "#a5b4fc" }}
            />
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "0.85rem", color: colors.text }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 h-32 flex flex-col justify-center items-center">
          <span className="text-sm">No activity data yet.</span>
          <span className="text-xs italic mt-1">
            Start posting to see your stats here!
          </span>
        </div>
      )}

      {/* Badges Section */}
      <div className="mt-6">
        <h4 className={`text-md font-medium mb-2 ${colors.text}`}>Badges</h4>
        <div className="flex flex-wrap gap-2">
          {defaultBadges.map((badge, index) => (
            <div
              key={index}
              className={`px-3 py-1 text-sm rounded-full shadow-sm ${BADGE_COLORS[index % BADGE_COLORS.length]}`}
              title={badge.description}
            >
              {badge.name}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityStats;
