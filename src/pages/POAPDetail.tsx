import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientBlobBackground from '../components/GradientBlobBackground';
import { useWallet } from '../hooks/useWallet';

// Define all POAPs data
const allPoaps = [
  // UX Master POAPs (now part of "All" but not a separate category)
  {
    id: 1,
    title: "Web3 Pioneer",
    description: "First steps into blockchain development",
    gifUrl: "/1.gif",
    category: "ux"
  },
  {
    id: 2,
    title: "UX Master",
    description: "Excellence in user experience design",
    gifUrl: "/2.gif",
    category: "ux"
  },
  {
    id: 3,
    title: "Security Expert",
    description: "Blockchain security certification",
    gifUrl: "/3.gif",
    category: "ux"
  },
  
  // Forum POAPs
  {
    id: 4,
    title: "Forum Contributor",
    description: "Active participation in community discussions",
    gifUrl: "/Forum1.gif",
    category: "forum"
  },
  {
    id: 5,
    title: "Forum Moderator",
    description: "Helping maintain quality discussions",
    gifUrl: "/Forum2.gif",
    category: "forum"
  },
  {
    id: 6,
    title: "Topic Expert",
    description: "Recognized expertise in specific topics",
    gifUrl: "/Forum3.gif",
    category: "forum"
  },
  {
    id: 7,
    title: "Community Builder",
    description: "Fostering community growth and engagement",
    gifUrl: "/Forum4.gif",
    category: "forum"
  },
  {
    id: 8,
    title: "Thought Leader",
    description: "Driving innovative discussions",
    gifUrl: "/Forum5.gif",
    category: "forum"
  },
  {
    id: 9,
    title: "Forum Champion",
    description: "Exceptional contributions to forum discussions",
    gifUrl: "/Forum6.gif",
    category: "forum"
  },
  
  // Reading Club POAPs
  {
    id: 10,
    title: "Book Explorer",
    description: "First reading club participation",
    gifUrl: "/4.gif",
    category: "reading"
  },
  {
    id: 11,
    title: "Literature Enthusiast",
    description: "Regular reading club member",
    gifUrl: "/5.gif",
    category: "reading"
  },
  {
    id: 12,
    title: "Book Sage",
    description: "Insightful contributions to book discussions",
    gifUrl: "/6.gif",
    category: "reading"
  },
  {
    id: 13,
    title: "Reading Mentor",
    description: "Guiding others through literary journeys",
    gifUrl: "/7.gif",
    category: "reading"
  },
  {
    id: 14,
    title: "Book Club Host",
    description: "Organizing and facilitating reading discussions",
    gifUrl: "/8.gif",
    category: "reading"
  },
  {
    id: 15,
    title: "Literary Scholar",
    description: "Deep analysis and interpretation of texts",
    gifUrl: "/9.gif",
    category: "reading"
  },
  {
    id: 16,
    title: "Reading Champion",
    description: "Completing multiple reading challenges",
    gifUrl: "/11.gif",
    category: "reading"
  },
  
  // Coming Soon POAPs
  {
    id: 'placeholder-1',
    title: "Coming Soon",
    description: "Stay tuned for our next POAP series",
    gifUrl: "/7.gif",
    category: "coming-soon",
    comingSoon: true
  },
  {
    id: 'placeholder-2',
    title: "Coming Soon",
    description: "New achievements awaiting",
    gifUrl: "/8.gif",
    category: "coming-soon",
    comingSoon: true
  },
  {
    id: 'placeholder-3',
    title: "Coming Soon",
    description: "Future milestones to unlock",
    gifUrl: "/9.gif",
    category: "coming-soon",
    comingSoon: true
  }
];

// Add new category for wallet collection
const filterCategories = [
  { id: 'all', name: 'All', color: 'bg-gradient-to-r from-green-400 to-purple-500' },
  { id: 'wallet', name: 'My Collection', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { id: 'reading', name: 'Reading Club', color: 'bg-gradient-to-r from-green-400 to-green-600' },
  { id: 'forum', name: 'Forum', color: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
  { id: 'coming-soon', name: 'Coming Soon', color: 'bg-gradient-to-r from-gray-400 to-gray-600' }
];

// Mock wallet POAPs data - in a real app, this would come from an API
const walletPoaps = [
  {
    id: 'wallet-1',
    title: "DeFi Pioneer",
    description: "Early adopter of decentralized finance protocols",
    gifUrl: "/1.gif",
    category: "wallet",
    tokenId: "1234",
    mintedDate: "2024-02-15",
    chainId: 1
  },
  {
    id: 'wallet-2',
    title: "NFT Collector",
    description: "Active participant in the NFT ecosystem",
    gifUrl: "/2.gif",
    category: "wallet",
    tokenId: "5678",
    mintedDate: "2024-03-01",
    chainId: 137
  }
];

const POAPDetail = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPoaps, setFilteredPoaps] = useState(allPoaps);
  const [isLoading, setIsLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const { address, isConnected, connectWallet } = useWallet();

  // Update filtered POAPs based on active filter and wallet connection
  useEffect(() => {
    let poapsToShow = [];
    
    if (activeFilter === 'wallet') {
      if (isConnected) {
        poapsToShow = walletPoaps;
      } else {
        poapsToShow = [];
      }
    } else if (activeFilter === 'all') {
      poapsToShow = [...allPoaps, ...(isConnected ? walletPoaps : [])];
    } else {
      poapsToShow = allPoaps.filter(poap => poap.category === activeFilter);
    }
    
    setFilteredPoaps(poapsToShow);
    setAnimationKey(prev => prev + 1);
  }, [activeFilter, isConnected]);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = [];
      
      allPoaps.forEach(poap => {
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.src = poap.gifUrl;
          img.onload = resolve;
          img.onerror = reject;
        });
        imagePromises.push(promise);
      });
      
      Promise.all(imagePromises)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false)); // Continue even if some images fail to load
    };
    
    preloadImages();
  }, []);

  // Handle filter change
  const handleFilterChange = (filterId) => {
    if (filterId === 'wallet' && !isConnected) {
      connectWallet();
    } else {
      setActiveFilter(filterId);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Get card style based on category
  const getCardStyle = (category) => {
    switch(category) {
      case 'reading':
        return {
          bgColor: 'bg-green-900/10',
          borderColor: 'border-green-500/20'
        };
      case 'forum':
        return {
          bgColor: 'bg-purple-900/10',
          borderColor: 'border-purple-500/20'
        };
      case 'coming-soon':
        return {
          bgColor: 'bg-gray-800/30',
          borderColor: 'border-gray-600/20'
        };
      case 'wallet':
        return {
          bgColor: 'bg-blue-900/10',
          borderColor: 'border-blue-500/20'
        };
      default:
        return {
          bgColor: 'bg-purple-900/10',
          borderColor: 'border-purple-500/20'
        };
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 relative">
      {/* Dynamic Gradient Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`background-${animationKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-0"
        >
          <GradientBlobBackground category={activeFilter} />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <Link 
          to="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-purple-500 text-transparent bg-clip-text">
            POAP Collection Series
          </h1>
          <p className="text-gray-300 max-w-2xl mb-8">
            Explore our complete collection of achievement POAPs and connect your wallet to view your personal collection.
          </p>

          {/* Filter Tabs */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-purple-400" />
              <span className="text-gray-300">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {filterCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {category.name}
                  {category.id === 'wallet' && !isConnected && (
                    <span className="ml-2 text-xs bg-blue-500/20 px-2 py-0.5 rounded-full">Connect</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Wallet Connection Prompt */}
        {activeFilter === 'wallet' && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl mb-8"
          >
            <Wallet className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your Web3 wallet to view your POAP collection</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {filteredPoaps.map((poap) => {
                const cardStyle = getCardStyle(poap.category);
                
                return (
                  <motion.div
                    key={`poap-${poap.id}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className={`glass-card overflow-hidden rounded-xl transition-transform duration-300 ${poap.comingSoon ? 'opacity-70' : ''} ${cardStyle.bgColor} border ${cardStyle.borderColor}`}
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={poap.gifUrl}
                        alt={poap.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{poap.title}</h3>
                          <p className="text-gray-300">{poap.description}</p>
                          {poap.tokenId && (
                            <div className="mt-2 text-sm text-gray-400">
                              Token ID: #{poap.tokenId}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {poap.comingSoon && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-500">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Add wallet-specific empty state */}
              {activeFilter === 'wallet' && isConnected && filteredPoaps.length === 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20 col-span-3 glass-card rounded-xl"
                >
                  <h3 className="text-2xl font-bold mb-2">No POAPs Found</h3>
                  <p className="text-gray-400">
                    Your connected wallet ({address?.slice(0, 6)}...{address?.slice(-4)}) doesn't have any POAPs yet.
                    <br />
                    Participate in activities to earn POAPs!
                  </p>
                </motion.div>
              )}

              {filteredPoaps.length === 0 && activeFilter !== 'wallet' && (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20 col-span-3"
                >
                  <h3 className="text-2xl font-bold mb-2">No POAPs found</h3>
                  <p className="text-gray-400">No POAPs match the selected filter.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-8 rounded-xl backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold mb-6">Collection Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg transition-colors duration-700 ${
              activeFilter === 'reading' ? 'bg-green-900/20' : 
              activeFilter === 'forum' ? 'bg-purple-900/20' : 
              activeFilter === 'coming-soon' ? 'bg-blue-900/20' : 
              'bg-purple-900/20'
            }`}>
              <div className={`text-2xl font-bold mb-2 transition-colors duration-700 ${
                activeFilter === 'reading' ? 'text-green-400' : 
                activeFilter === 'forum' ? 'text-purple-400' : 
                activeFilter === 'coming-soon' ? 'text-blue-400' : 
                'text-green-400'
              }`}>16</div>
              <div className="text-gray-300">Unique POAPs</div>
            </div>
            <div className={`p-4 rounded-lg transition-colors duration-700 ${
              activeFilter === 'reading' ? 'bg-green-900/20' : 
              activeFilter === 'forum' ? 'bg-purple-900/20' : 
              activeFilter === 'coming-soon' ? 'bg-blue-900/20' : 
              'bg-purple-900/20'
            }`}>
              <div className={`text-2xl font-bold mb-2 transition-colors duration-700 ${
                activeFilter === 'reading' ? 'text-green-400' : 
                activeFilter === 'forum' ? 'text-purple-400' : 
                activeFilter === 'coming-soon' ? 'text-blue-400' : 
                'text-green-400'
              }`}>1,234</div>
              <div className="text-gray-300">Total Claimed</div>
            </div>
            <div className={`p-4 rounded-lg transition-colors duration-700 ${
              activeFilter === 'reading' ? 'bg-green-900/20' : 
              activeFilter === 'forum' ? 'bg-purple-900/20' : 
              activeFilter === 'coming-soon' ? 'bg-blue-900/20' : 
              'bg-purple-900/20'
            }`}>
              <div className={`text-2xl font-bold mb-2 transition-colors duration-700 ${
                activeFilter === 'reading' ? 'text-green-400' : 
                activeFilter === 'forum' ? 'text-purple-400' : 
                activeFilter === 'coming-soon' ? 'text-blue-400' : 
                'text-green-400'
              }`}>4.9/5</div>
              <div className="text-gray-300">User Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default POAPDetail;