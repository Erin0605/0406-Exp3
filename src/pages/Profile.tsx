import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Award, Clock, BookOpen, Check, Filter, Calendar, Tag, ChevronDown, ChevronUp, X, Wallet, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const skillData = [
  { subject: 'UX Research', A: 8 },
  { subject: 'User Testing', A: 7 },
  { subject: 'AI-Driven Design', A: 6 },
  { subject: 'Financial UX', A: 9 },
  { subject: 'Prototyping', A: 8 },
];

// Mock activity data
const activityData = [
  {
    id: 1,
    name: "Web3 Development Fundamentals",
    category: "Web3",
    date: "2024-03-15",
    completed: true,
    poapMinted: true,
    poapImage: "/1.gif",
    poapTitle: "Web3 Pioneer",
    poapDescription: "Successfully completed the Web3 Development Fundamentals course, demonstrating proficiency in blockchain concepts and decentralized application development."
  },
  {
    id: 2,
    name: "UX Research Masterclass",
    category: "UX Design",
    date: "2024-03-20",
    completed: true,
    poapMinted: false,
    poapImage: "/2.gif",
    poapTitle: "UX Master",
    poapDescription: "Completed the UX Research Masterclass, showing expertise in user research methodologies and applying insights to design processes."
  },
  {
    id: 3,
    name: "Blockchain Security Workshop",
    category: "Security",
    date: "2024-03-25",
    completed: false,
    poapMinted: false,
    poapImage: "/3.gif",
    poapTitle: "Security Expert",
    poapDescription: "Participated in the Blockchain Security Workshop, gaining knowledge in smart contract vulnerabilities and security best practices."
  },
  {
    id: 4,
    name: "Smart Contract Development",
    category: "Web3",
    date: "2024-04-05",
    completed: true,
    poapMinted: true,
    poapImage: "/4.gif",
    poapTitle: "Smart Contract Developer",
    poapDescription: "Successfully developed and deployed smart contracts, demonstrating proficiency in Solidity programming and blockchain integration."
  },
  {
    id: 5,
    name: "Design Systems Workshop",
    category: "UX Design",
    date: "2024-04-12",
    completed: false,
    poapMinted: false,
    poapImage: "/5.gif",
    poapTitle: "Design Systems Architect",
    poapDescription: "Participated in the Design Systems Workshop, learning to create scalable and consistent design systems for complex applications."
  }
];

// Mock blockchain networks
const networks = [
  { id: 'ethereum', name: 'Ethereum', icon: '🔷', gasPrice: '25 gwei' },
  { id: 'polygon', name: 'Polygon', icon: '🟣', gasPrice: '80 gwei' },
  { id: 'optimism', name: 'Optimism', icon: '🔴', gasPrice: '0.001 gwei' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', gasPrice: '0.1 gwei' }
];

const Profile = () => {
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Transaction flow states
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('polygon');
  const [transactionStep, setTransactionStep] = useState(0); // 0: initial, 1: processing, 2: success, 3: error
  const [gasFee, setGasFee] = useState(1);
  const [transactionSpeed, setTransactionSpeed] = useState('standard'); // slow, standard, fast
  
  // Join activity modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [availableActivities, setAvailableActivities] = useState([
    {
      id: 6,
      name: "Advanced Blockchain Architecture",
      category: "Web3",
      date: "2024-05-10",
      slots: 15,
      price: "450 EX3",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3"
    },
    {
      id: 7,
      name: "Web3 UX Integration Workshop",
      category: "UX Design",
      date: "2024-05-15",
      slots: 8,
      price: "350 EX3",
      image: "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"
    }
  ]);

  // Sort and filter activities
  const filteredActivities = activityData
    .filter(activity => {
      if (filterCategory !== 'all' && activity.category !== filterCategory) return false;
      if (filterStatus === 'completed' && !activity.completed) return false;
      if (filterStatus === 'incomplete' && activity.completed) return false;
      if (filterStatus === 'minted' && !activity.poapMinted) return false;
      if (filterStatus === 'mintable' && (!activity.completed || activity.poapMinted)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'category') {
        return sortDirection === 'asc' 
          ? a.category.localeCompare(b.category) 
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle view POAP
  const handleViewPOAP = (activity) => {
    setSelectedActivity(activity);
    setViewModalOpen(true);
  };
  
  // Handle mint POAP
  const handleMintPOAP = (activity) => {
    setSelectedActivity(activity);
    setMintModalOpen(true);
    setTransactionStep(0);
  };
  
  // Connect wallet
  const connectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
    }, 1000);
  };
  
  // Process transaction
  const processTransaction = () => {
    setTransactionStep(1); // Processing
    
    // Simulate transaction processing
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() < 0.9) {
        setTransactionStep(2); // Success
        
        // Update the activity data to show minted
        const updatedActivityData = activityData.map(activity => {
          if (activity.id === selectedActivity.id) {
            return { ...activity, poapMinted: true };
          }
          return activity;
        });
        
        // In a real app, you would update this in a database
        // For this demo, we're just simulating the update
      } else {
        setTransactionStep(3); // Error
      }
    }, 2000);
  };
  
  // Handle join activity
  const handleJoinActivity = () => {
    setJoinModalOpen(true);
  };
  
  // Join specific activity
  const joinActivity = (activity) => {
    // In a real app, you would make an API call to join the activity
    // For this demo, we're just closing the modal
    setJoinModalOpen(false);
    
    // Show a success message or redirect to activity details
    alert(`Successfully joined: ${activity.name}`);
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
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2
      }
    }
  };

  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-900/20 rounded-xl p-8 mb-8 glossy-card"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-purple-500/50"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2 text-center md:text-left">John Doe</h1>
              <p className="text-purple-400 mb-2 text-center md:text-left">UX Designer</p>
              <p className="text-gray-300 max-w-2xl text-center md:text-left">
                Passionate about creating user-centered designs and exploring the intersection of AI and UX.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-purple-900/20 rounded-xl p-8 glossy-card"
          >
            <h2 className="text-2xl font-bold mb-6">Skill Radar</h2>
            <div className="flex justify-center">
              <RadarChart width={300} height={300} data={skillData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" stroke="#ffffff80" />
                <PolarRadiusAxis stroke="#ffffff20" />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </div>
          </motion.div>

          {/* Learning Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-purple-900/20 rounded-xl p-8 glossy-card"
          >
            <h2 className="text-2xl font-bold mb-6">Learning Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-800/20 rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-300">Courses Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-800/20 rounded-lg">
                <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-300">Certificates Earned</div>
              </div>
              <div className="text-center p-4 bg-purple-800/20 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">150</div>
                <div className="text-sm text-gray-300">Hours Learned</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Records Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-purple-900/20 rounded-xl p-8 glossy-card mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4 md:mb-0">
              Activity Records
            </motion.h2>
            
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <button 
                onClick={toggleFilters}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-800/50 transition-colors mb-2 md:mb-0"
              >
                <Filter size={16} />
                <span>Filter & Sort</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <button 
                onClick={handleJoinActivity}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 rounded-lg transition-colors"
              >
                <span>Join New Activity</span>
                <ArrowRight size={16} />
              </button>
              
              {showFilters && (
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg mt-2 w-full md:absolute md:right-0 md:mt-10 md:w-72 z-10">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-purple-900/20 border border-purple-800/50 rounded-md px-3 py-2 text-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="Web3">Web3</option>
                      <option value="UX Design">UX Design</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-purple-900/20 border border-purple-800/50 rounded-md px-3 py-2 text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="incomplete">Incomplete</option>
                      <option value="minted">POAP Minted</option>
                      <option value="mintable">Ready to Mint</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleSort('date')}
                        className={`flex-1 px-2 py-1 rounded-md ${sortBy === 'date' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                      >
                        Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                      <button 
                        onClick={() => toggleSort('name')}
                        className={`flex-1 px-2 py-1 rounded-md ${sortBy === 'name' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                      >
                        Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                      <button 
                        onClick={() => toggleSort('category')}
                        className={`flex-1 px-2 py-1 rounded-md ${sortBy === 'category' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                      >
                        Category {sortBy === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Activity List - Desktop */}
          <motion.div variants={itemVariants} className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/30">
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">POAP</th>
                  <th className="text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr 
                    key={activity.id} 
                    className="border-b border-purple-800/20 hover:bg-purple-800/10 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{activity.name}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300">
                        <Tag size={12} className="mr-1" />
                        {activity.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      <span className="inline-flex items-center">
                        <Calendar size={14} className="mr-2 text-purple-400" />
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {activity.completed ? (
                        <span className="inline-flex items-center text-green-400">
                          <Check size={16} className="mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-gray-400">In Progress</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {activity.poapMinted ? (
                        <span className="inline-flex items-center text-purple-400">
                          <Award size={16} className="mr-1" />
                          Minted
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Minted</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {activity.completed && !activity.poapMinted ? (
                        <button 
                          onClick={() => handleMintPOAP(activity)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Mint POAP
                        </button>
                      ) : activity.poapMinted ? (
                        <button 
                          onClick={() => handleViewPOAP(activity)}
                          className="bg-purple-900/50 hover:bg-purple-900/70 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          View POAP
                        </button>
                      ) : (
                        <button className="bg-gray-700/50 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed">
                          Mint POAP
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          {/* Activity List - Mobile */}
          <motion.div variants={itemVariants} className="md:hidden space-y-4">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-purple-900/10 rounded-lg p-4 border border-purple-800/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{activity.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300">
                    {activity.category}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-300 mb-3">
                  <Calendar size={14} className="mr-1 text-purple-400" />
                  {new Date(activity.date).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    {activity.completed ? (
                      <span className="inline-flex items-center text-green-400 text-sm">
                        <Check size={14} className="mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">In Progress</span>
                    )}
                  </div>
                  
                  <div>
                    {activity.poapMinted ? (
                      <span className="inline-flex items-center text-purple-400 text-sm">
                        <Award size={14} className="mr-1" />
                        POAP Minted
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">POAP Not Minted</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {activity.completed && !activity.poapMinted ? (
                    <button 
                      onClick={() => handleMintPOAP(activity)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors w-full"
                    >
                      Mint POAP
                    </button>
                  ) : activity.poapMinted ? (
                    <button 
                      onClick={() => handleViewPOAP(activity)}
                      className="bg-purple-900/50 hover:bg-purple-900/70 text-white px-4 py-2 rounded-md transition-colors w-full"
                    >
                      View POAP
                    </button>
                  ) : (
                    <button className="bg-gray-700/50 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed w-full">
                      Mint POAP
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Pagination */}
          {filteredActivities.length > 0 && (
            <motion.div variants={itemVariants} className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-400">
                Showing {filteredActivities.length} of {activityData.length} activities
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md bg-purple-900/30 text-gray-300 hover:bg-purple-900/50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-md bg-purple-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded-md bg-purple-900/30 text-gray-300 hover:bg-purple-900/50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 rounded-md bg-purple-900/30 text-gray-300 hover:bg-purple-900/50 transition-colors">
                  Next
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Empty state */}
          {filteredActivities.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 bg-purple-900/10 rounded-lg border border-purple-800/20"
            >
              <Award className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No activities found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Try adjusting your filters or check back later for new activities.
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* View POAP Modal */}
        <AnimatePresence>
          {viewModalOpen && selectedActivity && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden max-w-lg w-full"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative">
                  <button 
                    onClick={() => setViewModalOpen(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-purple-300">{selectedActivity.poapTitle}</h3>
                    <p className="text-gray-400 mb-6">{selectedActivity.name}</p>
                    
                    <div className="flex justify-center mb-6">
                      <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-purple-600/30 shadow-lg shadow-purple-500/20">
                        <img 
                          src={selectedActivity.poapImage} 
                          alt={selectedActivity.poapTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-300">{selectedActivity.poapDescription}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Issued On:</span>
                        <span>{new Date(selectedActivity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Token ID:</span>
                        <span className="font-mono">EXP3-{selectedActivity.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blockchain:</span>
                        <span>Polygon</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-purple-800/30">
                      <button 
                        onClick={() => setViewModalOpen(false)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Mint POAP Modal */}
        <AnimatePresence>
          {mintModalOpen && selectedActivity && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden max-w-lg w-full"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative">
                  <button 
                    onClick={() => setMintModalOpen(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-center">Mint POAP</h3>
                    <p className="text-gray-400 mb-6 text-center">{selectedActivity.name}</p>
                    
                    {/* Transaction Steps */}
                    <div className="mb-6">
                      {/* Step 1: Connect Wallet */}
                      <div className={`p-4 rounded-lg mb-4 ${transactionStep === 0 ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-gray-900/20'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs mr-2">1</span>
                            Connect Wallet
                          </h4>
                          {walletConnected && <CheckCircle size={16} className="text-green-400" />}
                        </div>
                        
                        {transactionStep === 0 && !walletConnected && (
                          <button 
                            onClick={connectWallet}
                            className="mt-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 w-full justify-center"
                          >
                            <Wallet size={16} />
                            Connect Wallet
                          </button>
                        )}
                        
                        {walletConnected && (
                          <div className="text-sm text-gray-400 mt-2">
                            Wallet connected: 0x71C...8F3e
                          </div>
                        )}
                      </div>
                      
                      {/* Step 2: Select Network */}
                      <div className={`p-4 rounded-lg mb-4 ${transactionStep === 0 && walletConnected ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-gray-900/20'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs mr-2">2</span>
                            Select Network
                          </h4>
                        </div>
                        
                        {transactionStep === 0 && walletConnected && (
                          <div className="mt-2">
                            <select 
                              value={selectedNetwork}
                              onChange={(e) => setSelectedNetwork(e.target.value)}
                              className="w-full bg-purple-900/20 border border-purple-800/50 rounded-md px-3 py-2 text-white"
                            >
                              {networks.map(network => (
                                <option key={network.id} value={network.id}>
                                  {network.icon} {network.name} - Gas: {network.gasPrice}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        {transactionStep > 0 && (
                          <div className="text-sm text-gray-400 mt-2 flex items-center">
                            <span className="mr-2">
                              {networks.find(n => n.id === selectedNetwork)?.icon}
                            </span>
                            {networks.find(n => n.id === selectedNetwork)?.name}
                          </div>
                        )}
                      </div>
                      
                      {/* Step 3: Gas Fee */}
                      <div className={`p-4 rounded-lg mb-4 ${transactionStep === 0 && walletConnected ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-gray-900/20'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs mr-2">3</span>
                            Gas Fee
                          </h4>
                        </div>
                        
                        {transactionStep === 0 && walletConnected && (
                          <div className="mt-2">
                            <div className="flex gap-2 mb-2">
                              <button 
                                onClick={() => { setGasFee(0.5); setTransactionSpeed('slow'); }}
                                className={`flex-1 px-3 py-2 rounded-md text-center ${transactionSpeed === 'slow' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                              >
                                Slow<br />
                                <span className="text-sm text-gray-300">~5 min</span>
                              </button>
                              <button 
                                onClick={() => { setGasFee(1); setTransactionSpeed('standard'); }}
                                className={`flex-1 px-3 py-2 rounded-md text-center ${transactionSpeed === 'standard' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                              >
                                Standard<br />
                                <span className="text-sm text-gray-300">~2 min</span>
                              </button>
                              <button 
                                onClick={() => { setGasFee(2); setTransactionSpeed('fast'); }}
                                className={`flex-1 px-3 py-2 rounded-md text-center ${transactionSpeed === 'fast' ? 'bg-purple-600' : 'bg-purple-900/30'}`}
                              >
                                Fast<br />
                                <span className="text-sm text-gray-300">~30 sec</span>
                              </button>
                            </div>
                            
                            <div className="text-sm text-gray-400 mt-2">
                              Estimated cost: {gasFee.toFixed(2)} MATIC (${(gasFee * 0.75).toFixed(2)} USD)
                            </div>
                          </div>
                        )}
                        
                        {transactionStep > 0 && (
                          <div className="text-sm text-gray-400 mt-2">
                            {transactionSpeed.charAt(0).toUpperCase() + transactionSpeed.slice(1)} speed - {gasFee.toFixed(2)} MATIC
                          </div>
                        )}
                      </div>
                      
                      {/* Step 4: Confirmation */}
                      <div className={`p-4 rounded-lg mb-4 ${transactionStep === 1 ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-gray-900/20'}`}>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs mr-2">4</span>
                            Transaction Status
                          </h4>
                        </div>
                        
                        {transactionStep === 1 && (
                          <div className="mt-4 flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-gray-300">Processing transaction...</p>
                          </div>
                        )}
                        
                        {transactionStep === 2 && (
                          <div className="mt-4 flex flex-col items-center text-green-400">
                            <CheckCircle size={32} className="mb-2" />
                            <p>Transaction successful!</p>
                          </div>
                        )}
                        
                        {transactionStep === 3 && (
                          <div className="mt-4 flex flex-col items-center text-red-400">
                            <AlertCircle size={32} className="mb-2" />
                            <p>Transaction failed. Please try again.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        onClick={() => setMintModalOpen(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      
                      {transactionStep === 0 && walletConnected && (
                        <button 
                          onClick={processTransaction}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition-colors"
                        >
                          Confirm & Mint
                        </button>
                      )}
                      
                      {transactionStep === 2 && (
                        <button 
                          onClick={() => {
                            setMintModalOpen(false);
                            // Update the activity data to show minted
                            const updatedActivity = { ...selectedActivity, poapMinted: true };
                            setSelectedActivity(updatedActivity);
                          }}
                          className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-md transition-colors"
                        >
                          View POAP
                        </button>
                      )}
                      
                      {transactionStep === 3 && (
                        <button 
                          onClick={() => setTransactionStep(0)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition-colors"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Join Activity Modal */}
        <AnimatePresence>
          {joinModalOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden max-w-2xl w-full"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative">
                  <button 
                    onClick={() => setJoinModalOpen(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-center">Available Activities</h3>
                    <p className="text-gray-400 mb-6 text-center">Join a new activity to earn POAPs and build your skills</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {availableActivities.map(activity => (
                        <div 
                          key={activity.id}
                          className="bg-purple-900/10 rounded-lg overflow-hidden border border-purple-800/20 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="h-32 overflow-hidden">
                            <img 
                              src={activity.image}
                              alt={activity.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs">
                                {activity.category}
                              </span>
                            </div>
                            
                            <h4 className="font-medium mb-2">{activity.name}</h4>
                            
                            <div className="flex justify-between text-sm text-gray-400 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-purple-400" />
                                {new Date(activity.date).toLocaleDateString()}
                              </div>
                              <div>
                                {activity.slots} slots left
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="text-purple-300 font-medium">
                                {activity.price}
                              </div>
                              <button 
                                onClick={() => joinActivity(activity)}
                                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
                              >
                                Join Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => setJoinModalOpen(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Profile;