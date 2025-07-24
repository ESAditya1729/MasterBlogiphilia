
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Router>
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
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
