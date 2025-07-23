import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyBlogiphilia from './components/WhyBlogiphila';
import HowItWorks from "./components/HowItWorks";
import FeaturesPreview from './components/FeaturesPreview';
import JoinEarlyWriters from './components/JoinEarlyWriters';
import Footer from './components/Footer';
function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <WhyBlogiphilia />
      <HowItWorks />
      <FeaturesPreview />
      <JoinEarlyWriters />
      <Footer/>
    </div>
  );
}

export default App;
