// SignUp.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiBook,
  FiEdit,
  FiStar,
} from "react-icons/fi";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { motion } from "framer-motion";
import centerImage from "../assets/SignUpPage-SideImage.jpg";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.5,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const starStyles = `
  @keyframes fall {
    0% { transform: translateY(-50px); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  .star {
    position: absolute;
    font-size: 1rem;
    color: gold;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
    animation: fall linear infinite;
  }
`;

const animatedTexts = [
  { text: "Read Boldly", Icon: FiBook },
  { text: "Write Freely", Icon: FiEdit },
  { text: "Blogiphilia", Icon: FiStar },
];

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      const userData = await response.json();
      onSignUp(userData.token); // ✅ Trigger app-wide login and navigation
    } catch (error) {
      setErrors({ server: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{starStyles}</style>
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 h-full relative bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center text-white overflow-hidden border-2 border-sky-glow rounded-xl animate-glow">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              ★
            </div>
          ))}

          <div className="mb-10 text-center space-y-4 z-10">
            {animatedTexts.map((item, index) => (
              <motion.div
                key={item.text}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="flex items-center justify-center gap-3 text-3xl font-extrabold drop-shadow-xl"
              >
                <item.Icon className="text-4xl" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <img
            src={centerImage}
            alt="Blog Illustration"
            className="h-64 w-64 object-contain rounded-xl shadow-lg border-2 border-white z-10"
          />
        </div>

        {/* Right Panel */}
        <div className="w-1/2 h-full flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-8 px-8">
            <h1 className="text-4xl font-bold text-center text-indigo-700">
              Blogiphilia
            </h1>
            <div className="text-center">
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Become a Blogiphilian Today
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Back for more inspiration?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </Link>
              </p>
            </div>

            {errors.server && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {errors.server}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  Icon={FiUser}
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                />
                <Input
                  Icon={FiMail}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <Input
                  Icon={FiLock}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <Input
                  Icon={FiLock}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
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
                >
                  Sign Up
                </Button>
              </div>
            </form>
            <p className="text-xs text-center text-gray-400 pt-4">
              © {new Date().getFullYear()} Blogiphilia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
