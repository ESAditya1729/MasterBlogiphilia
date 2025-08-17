import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyBlogiphilia from "./components/WhyBlogiphila";
import HowItWorks from "./components/HowItWorks";
import FeaturesPreview from "./components/FeaturesPreview";
import JoinEarlyWriters from "./components/JoinEarlyWriters";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard"; 
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from './pages/ProfilePage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogEditor from "./components/Dash-Editor/BlogEditor.jsx"
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from "./pages/ContactUs.jsx";



function App() {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
}

function AuthWrapper() {
  const { isAuthenticated, loading } = useAuth();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      setInitialCheckComplete(true);
    }
  }, [loading]);

  if (!initialCheckComplete) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HeroSection />
              <WhyBlogiphilia />
              <HowItWorks />
              <FeaturesPreview />
              <JoinEarlyWriters />
              <Footer />
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/editor" element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
        <Route path="/editor/:id" element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
        <Route path="/blog/:id" element={<PrivateRoute><BlogPostPage /></PrivateRoute>} />
      </Routes>
      
      {/* Add ToastContainer here */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
