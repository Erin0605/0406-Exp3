import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Award, Zap, Trophy } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import POAPShowcase from '../components/POAPShowcase';
import Background3D from '../components/Background3D';

const activities = [
  {
    id: 1,
    name: "Web3 Development Fundamentals",
    category: "Web3",
    date: "2024-03-15",
    price: "500",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3",
    participants: 156,
    poaps: 89
  },
  {
    id: 2,
    name: "UX Research Masterclass",
    category: "UX Design",
    date: "2024-03-20",
    price: "300",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2940",
    participants: 234,
    poaps: 145
  },
  {
    id: 3,
    name: "Blockchain Security Workshop",
    category: "Security",
    date: "2024-03-25",
    price: "450",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3",
    participants: 189,
    poaps: 112
  }
];

const stats = [
  { icon: Users, label: "Active Users", value: "12,345" },
  { icon: Award, label: "POAPs Issued", value: "45,678" },
  { icon: Zap, label: "Total Events", value: "890" },
  { icon: Trophy, label: "Skills Verified", value: "23,456" }
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Start the animation sequence
    const startAnimation = async () => {
      await controls.start("visible");
      setIsLoaded(true);
    };
    
    startAnimation();
  }, [controls]);

  // Variants for the opening animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: -30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 90,
        delay: 0.2
      }
    }
  };

  const expandVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 3D Background */}
      <Background3D />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          variants={expandVariants}
        >
          <motion.h1 
            variants={titleVariants}
            className="text-6xl font-bold mb-6"
          >
            Certify your Digital Experience
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl mb-8 text-gray-300"
          >
            Participate and we'll record your skills on the blockchain, showcase your growth journey.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <motion.button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="stats-grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* POAP Showcase Section */}
      <section className="relative py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured POAPs</h2>
            <p className="text-gray-400">Hover to explore our exclusive collection of achievement badges</p>
          </motion.div>
          <POAPShowcase />
        </div>
      </section>

      {/* Activities Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Latest Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ActivityCard activity={activity} />
                <div className="mt-4 flex justify-between items-center glass-card p-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-purple-400" />
                    <span>{activity.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-purple-400" />
                    <span>{activity.poaps} POAPs claimed</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;