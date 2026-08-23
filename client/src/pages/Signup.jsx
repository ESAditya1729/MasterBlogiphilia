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
  Eye,
  EyeOff,
} from "lucide-react";
import signupIllustration from "../assets/Signup-blogging.png";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; 

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const { completeAuth } = useAuth();

  const { email, username, password, confirmPassword } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordScore = (pw) => {
    if (!pw) return -1;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const passwordScore = getPasswordScore(password);
  const strengthMeta = [
    { label: "Too short", bar: "bg-slate-300", text: "text-slate-500" },
    { label: "Weak", bar: "bg-red-500", text: "text-red-500" },
    { label: "Fair", bar: "bg-orange-400", text: "text-orange-500" },
    { label: "Good", bar: "bg-amber-400", text: "text-amber-500" },
    { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
  ][Math.max(0, passwordScore)];

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
        const serverMessage = data.error || data.message;
        if (res.status === 400 && serverMessage?.toLowerCase().includes("email")) {
          const emailError = new Error("Email already in use");
          emailError.details = "This email is already registered. Would you like to log in instead?";
          emailError.action = { text: "Go to Login", path: "/login" };
          throw emailError;
        }
        throw new Error(serverMessage || "Registration failed");
      }

      // Establish session from the signup response
      const result = completeAuth(
        {
          token: data.token,
          user: data.user,
        },
        true // remember me
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to initialize session");
      }

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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-16 sm:py-10 relative"
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
        className="max-w-6xl w-full bg-white/90 dark:bg-slate-800 rounded-2xl shadow-xl shadow-violet-950/10 dark:shadow-black/40 flex flex-col md:flex-row overflow-hidden border border-gray-200/80 dark:border-slate-700/60 backdrop-blur-sm mt-8 sm:mt-0"
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
                className="w-full px-4 py-3 bg-gray-50/80 dark:bg-slate-700/50 border border-gray-200 hover:border-violet-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 focus:bg-white dark:focus:bg-slate-700/70 dark:border-slate-600 dark:text-white transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/80 dark:bg-slate-700/50 border border-gray-200 hover:border-violet-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 focus:bg-white dark:focus:bg-slate-700/70 dark:border-slate-600 dark:text-white transition-all duration-200"
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-11 bg-gray-50/80 dark:bg-slate-700/50 border border-gray-200 hover:border-violet-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 focus:bg-white dark:focus:bg-slate-700/70 dark:border-slate-600 dark:text-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength meter */}
              {passwordScore >= 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex flex-1 gap-1.5">
                    {[0, 1, 2, 3].map((seg) => (
                      <div
                        key={seg}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          seg < Math.max(1, passwordScore)
                            ? strengthMeta.bar
                            : "bg-gray-200 dark:bg-slate-600/60"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strengthMeta.text}`}>
                    {strengthMeta.label}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-11 bg-gray-50/80 dark:bg-slate-700/50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:bg-white dark:focus:bg-slate-700/70 dark:border-slate-600 dark:text-white transition-all duration-200 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-300 hover:border-red-400 focus:border-red-400"
                      : "hover:border-violet-300 focus:border-violet-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1.5">
                  Passwords don't match yet
                </p>
              )}
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
