import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ArrowRight, Mail, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (method) => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    console.log(`Logged in with ${method}`);
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Check if a nav item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div variants={itemVariants}>
              <img src="/logo.png" alt="EXP3 Logo" className="h-10" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div 
            variants={itemVariants}
            className="hidden md:flex items-center space-x-1"
          >
            <NavItem to="/records" label="Personal Records" isActive={isActive('/records')} />
            <NavItem to="/activities" label="Activities" isActive={isActive('/activities')} />
            <NavItem to="/poap" label="POAP" isActive={isActive('/poap')} />
            <NavItem to="/about" label="About" isActive={isActive('/about')} />
            
            {isLoggedIn ? (
              <Link to="/profile" className="ml-12">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors">
                  <User size={18} />
                </div>
              </Link>
            ) : (
              <div className="ml-12">
                <button 
                  onClick={handleLogin}
                  className="relative px-6 py-2 rounded-lg bg-[#7B5CF0] hover:bg-[#6a4dd8] transition-all duration-300 login-button-expand"
                >
                  <span>Login</span>
                  <span className="login-button-icon">
                    <ArrowRight size={16} />
                  </span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md">
          <MobileNavItem to="/records" label="Personal Records" isActive={isActive('/records')} onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem to="/activities" label="Activities" isActive={isActive('/activities')} onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem to="/poap" label="POAP" isActive={isActive('/poap')} onClick={() => setIsMenuOpen(false)} />
          <MobileNavItem to="/about" label="About" isActive={isActive('/about')} onClick={() => setIsMenuOpen(false)} />
          
          {isLoggedIn ? (
            <MobileNavItem to="/profile" label="Profile" isActive={isActive('/profile')} onClick={() => setIsMenuOpen(false)} />
          ) : (
            <button
              className="block w-full text-center px-3 py-2 rounded-lg text-base font-medium bg-[#7B5CF0] hover:bg-[#6a4dd8] transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogin();
              }}
            >
              Login
            </button>
          )}
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden max-w-md w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative p-6">
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1"
                >
                  <X size={20} />
                </button>
                
                <div className="flex justify-center mb-6">
                  <img src="/logo.png" alt="EXP3 Logo" className="h-12" />
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => handleLoginSuccess('Google')}
                    className="w-full bg-white text-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                    <span>Login with Google</span>
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-black text-gray-400">or</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleLoginSuccess('Wallet')}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-500 transition-colors"
                  >
                    <Wallet size={20} />
                    <span>Connect Wallet</span>
                  </button>
                </div>
                
                <p className="mt-6 text-sm text-gray-400 text-center">
                  By logging in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Desktop Navigation Item
const NavItem = ({ to, label, isActive }: { to: string; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'text-white border-b-2 border-purple-500' 
        : 'text-gray-300 hover:text-white hover:bg-black/20'
    }`}
  >
    {label}
  </Link>
);

// Mobile Navigation Item
const MobileNavItem = ({ 
  to, 
  label, 
  isActive, 
  onClick 
}: { 
  to: string; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      isActive 
        ? 'bg-purple-900/50 text-white' 
        : 'text-gray-300 hover:bg-black/30 hover:text-white'
    }`}
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Navbar;