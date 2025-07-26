import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  ArrowLeft,
  LogIn,
  MailWarning,
  CheckCircle,
  Key,
  Mail,
} from "lucide-react";
import loginIllustration from "../assets/Login-blogging.svg";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({
    type: "",
    text: "",
    details: "",
    action: null,
  });
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "", details: "", action: null });
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        let errorDetails = "Please check your credentials and try again.";
        if (res.status === 401) {
          errorDetails = "The email or password you entered is incorrect.";
        } else if (res.status === 404) {
          errorDetails =
            "Account not found. Would you like to sign up instead?";
        }

        throw {
          message: "Login Failed",
          details: data.message || errorDetails,
          action:
            res.status === 404
              ? {
                  text: "Create Account",
                  path: "/signup",
                }
              : null,
        };
      }

      // Use AuthContext's login function
      const loginSuccess = await login(formData.email, formData.password, true);

      if (loginSuccess) {
        setMessage({
          type: "success",
          text: "Welcome Back!",
          details: "Redirecting you to your dashboard...",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        throw new Error("Failed to initialize session");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Login Error",
        details: err.details || "Something went wrong. Please try again.",
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/70 to-emerald-50/70 dark:from-slate-900/95 dark:to-slate-800/95 px-4 py-16 sm:py-10 relative overflow-hidden"
    >
      {/* Floating gradient circles */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-indigo-300/50 dark:bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-300/50 dark:bg-emerald-600/20 blur-3xl"></div>
      </div>

      {/* Dark/Light Mode Toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-4 sm:top-4 p-2 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-md hover:shadow-lg backdrop-blur-sm transition-all z-20"
        aria-label="Toggle dark mode"
      >
        {mode === "dark" ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </motion.button>

      {/* Back to Home Button */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-slate-700/90 shadow-md hover:shadow-lg backdrop-blur-sm transition-all text-sm border-2 border-emerald-400 dark:border-emerald-500 z-20"
      >
        <motion.div
          animate={{ x: isHovering ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <span className="text-emerald-600 dark:text-emerald-400">Home</span>
      </motion.button>

      {/* Main Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          damping: 10,
        }}
        className="max-w-6xl w-full bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm mt-8 sm:mt-0"
      >
        {/* Mobile Illustration (Top) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:hidden h-52 bg-gradient-to-r from-indigo-100/70 to-violet-100/70 dark:from-slate-700/90 dark:to-slate-600/90 flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 dark:opacity-[0.03]">
            <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-indigo-300/30 blur-xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-violet-300/30 blur-xl"></div>
          </div>
          <motion.img
            src={loginIllustration}
            alt="Login Illustration"
            className="h-full w-auto object-contain z-10 px-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full p-8 md:p-12"
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="p-3 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 mb-3">
              <LogIn className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
              Welcome Back
            </h2>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
              Continue your blogging journey with us
            </p>
          </motion.div>

          {/* Message Display */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              className={`mb-6 p-4 rounded-xl ${
                message.type === "error"
                  ? "bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50"
                  : "bg-green-50/80 dark:bg-green-900/30 border border-green-200/50 dark:border-green-800/50"
              } backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                {message.type === "error" ? (
                  <MailWarning className="flex-shrink-0 w-5 h-5 mt-0.5 text-red-500 dark:text-red-400" />
                ) : (
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500 dark:text-green-400" />
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
                      className="inline-flex items-center mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {message.action.text}
                      <ArrowLeft className="ml-1 w-4 h-4 rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-white transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="pt-2"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {loading && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                )}
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Log In
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-slate-600 dark:text-slate-400 gap-2"
          >
            <Link
              to="/forgot-password"
              className="text-indigo-600/90 dark:text-indigo-400/90 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
            <div>
              New to Blogiphilia?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create account
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Desktop Illustration (Right Side) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-100/70 to-violet-100/70 dark:from-slate-700/90 dark:to-slate-600/90 items-center justify-center p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 dark:opacity-[0.03]">
            <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-violet-300/30 dark:bg-violet-600/10 blur-3xl"></div>
          </div>
          <motion.img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-w-[80%] h-auto z-10"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              type: "spring",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Login;