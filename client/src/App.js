import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Layout/Header";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import BlogEditor from "./pages/BlogEditor";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (token && ["/login", "/signup"].includes(location.pathname)) {
      navigate("/home");
    }
  }, [location.pathname, navigate]);

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen ${
        isAuthPage ? "" : "dark:bg-gray-900 bg-white"
      }`}
    >
      {!isAuthPage && isAuthenticated && <Navbar onLogout={handleLogout} />}
      <div className={`${!isAuthPage && isAuthenticated ? "pt-16" : ""}`}>
        <div className="max-w-[68%] mx-auto">
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUp onSignUp={handleLogin} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <Home />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
          <Route
            path="/blog"
            element={
              isAuthenticated ? (
                <Blog />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
          <Route
            path="/write"
            element={
              isAuthenticated ? (
                <BlogEditor />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default redirects */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
