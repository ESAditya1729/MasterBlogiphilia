import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  ArrowLeft,
  UserPlus,
  MailWarning,
  CheckCircle,
} from "lucide-react";
import signupIllustration from "../assets/Signup-blogging.png";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; // Added AuthContext import

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
    details: "",
    action: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const { login } = useAuth();

  const { email, username, password, confirmPassword } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        type: "error",
        text: "Invalid email",
        details: "Please enter a valid email address",
      });
      return false;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setMessage({
        type: "error",
        text: "Invalid username",
        details:
          "Username must be 3-20 characters (letters, numbers, underscores)",
      });
      return false;
    }

    // Password validation
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Weak password",
        details: "For your security, please use at least 8 characters.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password mismatch",
        details: "The passwords you entered don't match. Please try again.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "", details: "", action: null });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw {
            message: "Email already in use",
            details:
              "This email is already registered. Would you like to log in instead?",
            action: {
              text: "Go to Login",
              path: "/login",
            },
          };
        }
        throw new Error(data.message || "Registration failed");
      }

      // Use AuthContext login instead of direct localStorage
      const loginSuccess = await login(
        {
          token: data.token,
          user: data.user,
        },
        true
      ); // true for remember me

      if (loginSuccess) {
        setMessage({
          type: "success",
          text: "Welcome to Blogiphilia!",
          details:
            "Your account has been created successfully. Redirecting you to your dashboard...",
        });

        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error("Failed to initialize session");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Registration error",
        details:
          err.details ||
          "We couldn't complete your registration. Please try again.",
        action: err.action,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 px-4 py-16 sm:py-10 relative"
    >
      {/* Dark/Light Mode Toggle - Using theme context */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-4 sm:top-4 p-2 rounded-full bg-white dark:bg-slate-700 shadow-md hover:shadow-lg transition-all z-10"
        aria-label="Toggle dark mode"
      >
        {mode === "dark" ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>

      {/* Back to Home Button */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 left-4 sm:top-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-md hover:shadow-lg transition-all text-sm border-2 border-emerald-400 dark:border-emerald-500 z-10"
      >
        <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-emerald-600 dark:text-emerald-400">Home</span>
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-6xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200 dark:border-slate-700 mt-8 sm:mt-0"
      >
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="md:w-1/2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-violet-300 dark:bg-violet-600 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-indigo-300 dark:bg-indigo-600 blur-3xl"></div>
          </div>
          <img
            src={signupIllustration}
            alt="Sign Up Illustration"
            className="max-w-[80%] h-auto z-10"
          />
        </motion.div>

        {/* Right: Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <UserPlus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl font-bold text-center text-violet-600 dark:text-violet-400">
              Join Blogiphilia
            </h2>
          </motion.div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
            Start your writing journey with us
          </p>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-4 rounded-lg ${
                message.type === "error"
                  ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {message.type === "error" ? (
                  <MailWarning className="w-5 h-5 mt-0.5 text-red-500 dark:text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 dark:text-green-400" />
                )}
                <div>
                  <h4
                    className={`font-medium ${
                      message.type === "error"
                        ? "text-red-700 dark:text-red-300"
                        : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {message.text}
                  </h4>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                    {message.details}
                  </p>
                  {message.action && (
                    <Link
                      to={message.action.path}
                      className="inline-block mt-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      {message.action.text} →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white transition-all duration-200"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-center mt-6 text-slate-600 dark:text-slate-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              Log In
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Signup;
