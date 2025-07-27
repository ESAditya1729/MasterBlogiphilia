import { motion } from "framer-motion";
import { FiAward, FiStar, FiZap, FiTrendingUp } from "react-icons/fi";

const achievements = [
  {
    id: 1,
    title: "Novice Writer",
    description: "Published your first post",
    icon: <FiAward className="text-amber-500" />,
    unlocked: true,
    progress: 100
  },
  {
    id: 2,
    title: "Engaging Author",
    description: "Receive 50 likes on a single post",
    icon: <FiStar className="text-purple-500" />,
    unlocked: false,
    progress: 35
  },
  {
    id: 3,
    title: "Prolific Writer",
    description: "Publish 10 posts",
    icon: <FiZap className="text-blue-500" />,
    unlocked: false,
    progress: 60
  },
  {
    id: 4,
    title: "Top Performer",
    description: "Featured on the Blogiphilia homepage",
    icon: <FiTrendingUp className="text-green-500" />,
    unlocked: false,
    progress: 0
  }
];

const AchievementCard = ({ achievement }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-5 rounded-xl border ${
      achievement.unlocked
        ? "bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-900/10 dark:to-amber-900/20 border-amber-200 dark:border-amber-800"
        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
    }`}
  >
    <div className="flex items-start">
      <div className={`p-3 rounded-lg mr-4 ${
        achievement.unlocked
          ? "bg-amber-100 dark:bg-amber-900/30"
          : "bg-gray-100 dark:bg-gray-600"
      }`}>
        {achievement.icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${
          achievement.unlocked
            ? "text-amber-700 dark:text-amber-300"
            : "text-gray-800 dark:text-white"
        }`}>
          {achievement.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {achievement.description}
        </p>
        {achievement.unlocked ? (
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            Unlocked
          </span>
        ) : (
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 1 }}
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const ProfileAchievements = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
      <FiAward className="mr-2 text-amber-500" />
      Writing Achievements
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard 
          key={achievement.id} 
          achievement={achievement} 
        />
      ))}
    </div>

    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
      <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
        Keep writing to unlock more achievements!
      </h3>
      <p className="text-sm text-purple-600 dark:text-purple-400">
        Each achievement brings you closer to becoming a Blogiphilia featured author.
      </p>
    </div>
  </div>
);

export default ProfileAchievements;