import React from "react";
import { motion } from "framer-motion";
import Button from "../../UI/Button";

const WeeklyChallenge = () => {
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
        🎯 This Week’s Challenge
      </h2>

      {/* Challenge Theme */}
      <p className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
        Theme: <span className="italic">"Whispers of the Monsoon"</span>
      </p>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Capture the sights, sounds, or emotions of monsoon season in under 200 words. 
        This week’s challenge invites you to explore poetic imagery and sensory details. 
        Entries close on <strong>Sunday at 11:59 PM</strong>.
      </p>

      {/* Submit Button */}
      <Button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
        Submit Your Entry
      </Button>

      {/* Optional Leaderboard Snippet */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">Top Entries So Far</h3>
        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
          <li><strong>@rainydreams</strong> — *“Drenched in Midnight”*</li>
          <li><strong>@paperpetals</strong> — *“Whispers Through Leaves”*</li>
          <li><strong>@stormscribble</strong> — *“Petrichor Pulse”*</li>
        </ul>
      </div>

      {/* Past Challenges Link */}
      <div className="mt-6 text-sm text-right text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
        View Past Challenges →
      </div>
    </motion.div>
  );
};

export default WeeklyChallenge;
