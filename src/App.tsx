import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import POAPDetail from './pages/POAPDetail';
import About from './pages/About';
import Activities from './pages/Activities';
import IntroAnimation from './components/IntroAnimation';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('hasVisitedEXP3');
    if (visited) {
      setHasVisited(true);
      setShowIntro(false);
    } else {
      // Set flag for future visits
      localStorage.setItem('hasVisitedEXP3', 'true');
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, hasVisited ? 500 : 0);
    
    return () => clearTimeout(timer);
  }, [hasVisited]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <Router>
      {/* Intro Animation - only shown on first visit */}
      {!hasVisited && showIntro && (
        <IntroAnimation onAnimationComplete={handleIntroComplete} />
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                opacity: 1
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <img src="/logo.png" alt="Logo" className="h-24" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black"
          >
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/poap/:id" element={<POAPDetail />} />
                <Route path="/records" element={<Profile />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/:id" element={<Activities />} />
                <Route path="/poap" element={<POAPDetail />} />
                <Route path="/login" element={<Home />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </AnimatePresence>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;