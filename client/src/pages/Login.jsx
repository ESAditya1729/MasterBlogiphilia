import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.server) {
      setErrors((prev) => ({ ...prev, server: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          (response.status === 401 ? "Invalid email or password" : "Login failed")
        );
      }

      const remember = e.target.elements.remember?.checked;

      // ✅ Save token in storage
      if (remember) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      // ✅ Call App-provided login handler
      if (onLogin) {
        onLogin(data.token);
      }

    } catch (error) {
      setErrors({
        server: error.message.includes("Failed to fetch")
          ? "Network error. Please check your connection"
          : error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-700 via-indigo-800 to-purple-900 px-4">
      <div className="w-full max-w-md p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 border border-white/30 transition-all duration-300 hover:shadow-purple-500/40 hover:ring-purple-400">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Welcome back to Blogiphilia
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-300 hover:text-indigo-200 underline"
              state={{ from: location.state?.from }}
            >
              create a new account
            </Link>
          </p>
        </div>

        {errors.server && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mt-4">
            {errors.server}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input
              Icon={FiMail}
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoFocus
              autoComplete="email"
              required
            />
            <Input
              Icon={FiLock}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-100">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 text-indigo-400 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-indigo-300 hover:text-indigo-100 underline"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              icon={FiArrowRight}
              iconPosition="right"
              disabled={isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-gray-300 mt-6">
          © {new Date().getFullYear()} Blogiphilia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
