import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Users, Award, Calendar, Tag, Check, Filter, ChevronDown, ChevronUp, X, CreditCard, Wallet } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Background3D from '../components/Background3D';

// Define activity categories with their colors
const categories = [
  { id: 'all', name: 'All', color: 'bg-purple-500' },
  { id: 'design', name: 'Design', color: 'bg-pink-500' },
  { id: 'web3', name: 'Web3', color: 'bg-blue-500' },
  { id: 'uxui', name: 'UX/UI', color: 'bg-green-500' },
  { id: 'bookclub', name: 'Book Club', color: 'bg-amber-500' },
  { id: 'security', name: 'Security', color: 'bg-red-500' }
];

// Sample activities data
const activities = [
  {
    id: 1,
    name: "Web3 Development Fundamentals",
    categories: ["web3", "design"],
    date: "2025-05-15T14:00:00",
    participants: 156,
    price: 350,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Learn the basics of blockchain development and smart contract programming in this hands-on workshop.",
    location: "Virtual Event",
    duration: "3 hours",
    instructor: "Alex Johnson",
    instructorBio: "Blockchain developer with 5+ years of experience in Ethereum and Solidity",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Introduction to blockchain concepts",
      "Setting up a development environment",
      "Writing your first smart contract",
      "Testing and deployment",
      "Best practices and security considerations"
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Familiarity with JavaScript",
      "Understanding of web development concepts"
    ]
  },
  {
    id: 2,
    name: "UX Research Masterclass",
    categories: ["uxui", "design"],
    date: "2025-05-20T10:00:00",
    participants: 89,
    price: 250,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2940",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Discover advanced user research methodologies and how to apply insights to your design process.",
    location: "EXP3 Design Studio, Taipei",
    duration: "4 hours",
    instructor: "Sarah Chen",
    instructorBio: "Senior UX Researcher at Google with expertise in qualitative and quantitative research methods",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Research planning and methodology selection",
      "Participant recruitment strategies",
      "Conducting effective user interviews",
      "Analyzing research data",
      "Translating insights into actionable design decisions"
    ],
    prerequisites: [
      "Basic understanding of UX design principles",
      "Some experience with user-centered design processes"
    ]
  },
  {
    id: 3,
    name: "Blockchain Security Workshop",
    categories: ["web3", "security"],
    date: "2025-05-25T13:00:00",
    participants: 112,
    price: 400,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Learn to identify and prevent common security vulnerabilities in smart contracts and blockchain applications.",
    location: "Virtual Event",
    duration: "6 hours",
    instructor: "Michael Wei",
    instructorBio: "Security researcher specializing in blockchain vulnerabilities and smart contract auditing",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Common smart contract vulnerabilities",
      "Security analysis tools and techniques",
      "Audit methodologies",
      "Secure development practices",
      "Case studies of major security incidents"
    ],
    prerequisites: [
      "Experience with Solidity programming",
      "Understanding of blockchain fundamentals",
      "Familiarity with Web3 development"
    ]
  },
  {
    id: 4,
    name: "Product Design Sprint",
    categories: ["design", "uxui"],
    date: "2025-06-20T09:00:00",
    participants: 67,
    price: 500,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Intensive two-day workshop applying the design sprint methodology to solve complex product challenges.",
    location: "EXP3 Innovation Lab, Taipei",
    duration: "16 hours (2 days)",
    instructor: "Thomas Chen",
    instructorBio: "Product design leader who has facilitated design sprints for startups and enterprise companies",
    instructorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Day 1: Problem definition and ideation",
      "Day 1: Sketching and solution development",
      "Day 2: Prototype creation",
      "Day 2: User testing and iteration",
      "Follow-up and implementation planning"
    ],
    prerequisites: [
      "Product or design experience",
      "A specific product challenge to work on",
      "Collaborative mindset"
    ]
  },
  {
    id: 5,
    name: "DeFi Trading Strategies",
    categories: ["web3", "security"],
    date: "2025-06-25T15:00:00",
    participants: 95,
    price: 450,
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=2832",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Master advanced DeFi trading strategies and risk management techniques in decentralized markets.",
    location: "Virtual Event",
    duration: "4 hours",
    instructor: "Lisa Wang",
    instructorBio: "DeFi researcher and strategist with expertise in automated market makers and yield farming",
    instructorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Understanding DeFi protocols",
      "Liquidity provision strategies",
      "Yield farming optimization",
      "Risk assessment and management",
      "Portfolio rebalancing techniques"
    ],
    prerequisites: [
      "Basic understanding of DeFi concepts",
      "Experience with cryptocurrency trading",
      "Knowledge of blockchain fundamentals"
    ]
  },
  {
    id: 6,
    name: "Design Systems Workshop",
    categories: ["design", "uxui"],
    date: "2025-07-01T10:00:00",
    participants: 78,
    price: 300,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Learn how to create and maintain scalable design systems for enterprise applications.",
    location: "EXP3 Design Studio, Taipei",
    duration: "8 hours",
    instructor: "David Zhang",
    instructorBio: "Design systems architect with experience at major tech companies",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Design system fundamentals",
      "Component library creation",
      "Documentation best practices",
      "Version control and maintenance",
      "Team collaboration workflows"
    ],
    prerequisites: [
      "UI/UX design experience",
      "Familiarity with design tools",
      "Basic understanding of component-based design"
    ]
  },
  {
    id: 7,
    name: "Smart Contract Auditing",
    categories: ["web3", "security"],
    date: "2025-07-05T13:00:00",
    participants: 60,
    price: 600,
    image: "https://images.unsplash.com/photo-1639322537175-31b45c5c38c9?auto=format&fit=crop&q=80&w=2832",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Advanced course on auditing smart contracts for security vulnerabilities and optimization.",
    location: "Virtual Event",
    duration: "12 hours (2 days)",
    instructor: "Robert Kim",
    instructorBio: "Smart contract auditor with experience in identifying and preventing million-dollar exploits",
    instructorImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Common vulnerability patterns",
      "Automated testing tools",
      "Manual code review techniques",
      "Gas optimization strategies",
      "Audit report writing"
    ],
    prerequisites: [
      "Advanced Solidity knowledge",
      "Security fundamentals",
      "Experience with smart contract development"
    ]
  },
  {
    id: 8,
    name: "Crypto Book Club",
    categories: ["bookclub", "web3"],
    date: "2025-07-10T19:00:00",
    participants: 45,
    price: 100,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Monthly book discussion focusing on cryptocurrency, blockchain technology, and the future of finance.",
    location: "EXP3 Lounge, Taipei",
    duration: "2 hours",
    instructor: "Emma Chen",
    instructorBio: "Crypto researcher and writer, founder of multiple Web3 book clubs",
    instructorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Book presentation",
      "Group discussion",
      "Key takeaways analysis",
      "Real-world applications",
      "Networking session"
    ],
    prerequisites: [
      "Interest in cryptocurrency",
      "Willingness to read assigned book",
      "Open mind for discussion"
    ]
  },
  {
    id: 9,
    name: "Mobile UX Design",
    categories: ["uxui", "design"],
    date: "2025-07-15T14:00:00",
    participants: 82,
    price: 350,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Master the principles of creating exceptional mobile user experiences.",
    location: "EXP3 Design Studio, Taipei",
    duration: "6 hours",
    instructor: "Sophie Lin",
    instructorBio: "Mobile UX specialist with a portfolio of successful app designs",
    instructorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Mobile UX principles",
      "Gesture-based interactions",
      "Responsive design patterns",
      "Usability testing for mobile",
      "Performance optimization"
    ],
    prerequisites: [
      "Basic UI/UX knowledge",
      "Understanding of mobile platforms",
      "Design tool proficiency"
    ]
  },
  {
    id: 10,
    name: "Tech Book Discussion",
    categories: ["bookclub"],
    date: "2025-07-20T19:00:00",
    participants: 35,
    price: 100,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Monthly gathering to discuss influential books in technology and innovation.",
    location: "EXP3 Lounge, Taipei",
    duration: "2 hours",
    instructor: "James Liu",
    instructorBio: "Tech entrepreneur and avid reader with a passion for knowledge sharing",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Book summary presentation",
      "Group discussion",
      "Personal insights sharing",
      "Industry applications",
      "Networking break"
    ],
    prerequisites: [
      "Interest in technology",
      "Completion of monthly book",
      "Willingness to participate"
    ]
  },
  {
    id: 11,
    name: "Security Book Club",
    categories: ["bookclub", "security"],
    date: "2025-07-25T19:00:00",
    participants: 40,
    price: 100,
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Monthly book club focusing on cybersecurity, privacy, and digital safety.",
    location: "EXP3 Lounge, Taipei",
    duration: "2 hours",
    instructor: "Mark Wu",
    instructorBio: "Cybersecurity expert and author with 15 years of industry experience",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Security concepts review",
      "Book discussion",
      "Real-world case studies",
      "Best practices sharing",
      "Q&A session"
    ],
    prerequisites: [
      "Interest in cybersecurity",
      "Reading of assigned book",
      "Basic security knowledge"
    ]
  },
  {
    id: 12,
    name: "Design Book Club",
    categories: ["bookclub", "design"],
    date: "2025-07-30T19:00:00",
    participants: 50,
    price: 100,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Monthly gathering to explore books on design thinking, creativity, and innovation.",
    location: "EXP3 Lounge, Taipei",
    duration: "2 hours",
    instructor: "Alice Wang",
    instructorBio: "Design educator and consultant with a focus on design thinking methodologies",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    agenda: [
      "Design principles discussion",
      "Book insights sharing",
      "Creative exercises",
      "Project applications",
      "Community networking"
    ],
    prerequisites: [
      "Interest in design",
      "Monthly book completion",
      "Open mindset for creativity"
    ]
  }
];

const Activities = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [joinedActivities, setJoinedActivities] = useState<number[]>([]);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'wallet' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if we have an activity ID in the URL
    if (id) {
      const activityId = parseInt(id);
      const activity = activities.find(a => a.id === activityId);
      
      if (activity) {
        setSelectedActivity(activity);
        setShowDetailView(true);
      } else {
        // If activity not found, redirect to activities list
        navigate('/activities');
      }
    } else {
      setShowDetailView(false);
      setSelectedActivity(null);
    }
  }, [id, navigate]);

  // Filter activities based on selected category
  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.categories.includes(selectedCategory));

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Handle join activity
  const handleJoin = (e: React.MouseEvent, activityId: number) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!joinedActivities.includes(activityId)) {
      setJoinedActivities([...joinedActivities, activityId]);
    }
  };

  // Handle card click to navigate to detail page
  const handleCardClick = (activityId: number) => {
    navigate(`/activities/${activityId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Process payment
  const processPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentComplete(true);
    // Reset after showing success message
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentComplete(false);
      setPaymentMethod(null);
      // Update join status here
      if (selectedActivity) {
        handleJoin(new Event('click') as any, selectedActivity.id);
      }
    }, 2000);
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

  // Render activity detail view
  if (showDetailView && selectedActivity) {
    return (
      <div className="min-h-screen pt-20">
        {/* 3D Background */}
        <Background3D />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Back button */}
            <Link 
              to="/activities" 
              className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Activities
            </Link>

            {/* Activity Header */}
            <div className="glass-card overflow-hidden rounded-xl mb-8">
              <div className="h-80 relative">
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {selectedActivity.categories.map((category: string) => (
                      <span 
                        key={category}
                        className={`${categories.find(c => c.id === category)?.color || 'bg-purple-500'}/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}
                      >
                        <Tag size={12} />
                        {categories.find(c => c.id === category)?.name || category}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{selectedActivity.name}</h1>
                  <p className="text-xl text-gray-300 max-w-3xl">{selectedActivity.description}</p>
                </div>
              </div>
            </div>

            {/* Activity Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Event Details */}
              <div className="md:col-span-2">
                <div className="glass-card rounded-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Date & Time</h3>
                        <p className="text-gray-300">{formatDate(selectedActivity.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium mb-1">Location</h3>
                        <p className="text-gray-300">{selectedActivity.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div>
                        <h3 className="font-medium mb-1">Duration</h3>
                        <p className="text-gray-300">{selectedActivity.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <h3 className="font-medium mb-1">Participants</h3>
                        <p className="text-gray-300">{selectedActivity.participants} registered</p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Agenda</h2>
                  <ul className="list-disc list-inside space-y-2 mb-8 pl-4">
                    {selectedActivity.agenda.map((item: string, index: number) => (
                      <li key={index} className="text-gray-300">{item}</li>
                    ))}
                  </ul>
                  
                  <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {selectedActivity.prerequisites.map((item: string, index: number) => (
                      <li key={index} className="text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Right Column - Instructor & Registration */}
              <div className="md:col-span-1">
                {/* Instructor Info */}
                <div className="glass-card rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Instructor</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={selectedActivity.instructorImage} 
                      alt={selectedActivity.instructor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{selectedActivity.instructor}</h3>
                      <p className="text-purple-400 text-sm">Instructor</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{selectedActivity.instructorBio}</p>
                </div>
                
                {/* Registration Card */}
                <div className="glass-card rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Registration</h2>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold text-purple-300">{selectedActivity.price} EX3</span>
                    <span className="text-gray-400">≈ ${selectedActivity.price * 0.75} USD</span>
                  </div>
                  
                  {joinedActivities.includes(selectedActivity.id) ? (
                    <div className="mb-6">
                      <button
                        className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 mb-3"
                      >
                        <Check size={20} />
                        Registered
                      </button>
                      <p className="text-center text-gray-400 text-sm">You're all set! We'll send you a reminder before the event.</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6"
                    >
                      Register Now
                      <ArrowRight size={20} />
                
                    </button>
                  )}
                  
                  <div className="text-center text-gray-400 text-sm">
                    <p>Registration includes:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Event access</li>
                      <li>• Learning materials</li>
                      <li>• POAP certificate</li>
                      <li>• Community access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden max-w-md w-full"
              >
                <div className="relative p-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1"
                  >
                    <X size={20} />
                  </button>

                  <h3 className="text-2xl font-bold mb-2 text-center">Payment Method</h3>
                  <p className="text-gray-400 mb-6 text-center">Choose your preferred payment method</p>

                  {!isProcessing && !paymentComplete && (
                    <div className="space-y-4">
                      <button
                        onClick={() => setPaymentMethod('credit')}
                        className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                          paymentMethod === 'credit'
                            ? 'bg-purple-600/20 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 text-purple-400" />
                        <div className="text-left">
                          <div className="font-medium">Credit Card</div>
                          <div className="text-sm text-gray-400">Pay with Visa, Mastercard, or JCB</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`w-full p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                          paymentMethod === 'wallet'
                            ? 'bg-purple-600/20 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <Wallet className="w-6 h-6 text-purple-400" />
                        <div className="text-left">
                          <div className="font-medium">Crypto Wallet</div>
                          <div className="text-sm text-gray-400">Pay with ETH, USDT, or other tokens</div>
                        </div>
                      </button>

                      <div className="pt-6 border-t border-gray-800">
                        <button
                          onClick={processPayment}
                          disabled={!paymentMethod}
                          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                            paymentMethod
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Continue to Payment
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-purple-400">Processing your payment...</p>
                    </div>
                  )}

                  {paymentComplete && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={24} />
                      </div>
                      <p className="text-green-400 font-medium">Payment Successful!</p>
                      <p className="text-gray-400 mt-2">You're now registered for the activity</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render activities list view
  return (
    <div className="min-h-screen pt-20">
      {/* 3D Background */}
      <Background3D />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Upcoming Activities</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our events to learn, connect, and earn POAPs that verify your participation
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => handleCardClick(activity.id)}
              className="glass-card overflow-hidden rounded-xl cursor-pointer"
            >
              {/* Activity Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Activity Content */}
              <div className="p-6">
                {/* Category Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {activity.categories.map((category: string) => (
                    <span 
                      key={category}
                      className={`${categories.find(c => c.id === category)?.color || 'bg-purple-500'}/20 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1`}
                    >
                      <Tag size={12} />
                      {categories.find(c => c.id === category)?.name || category}
                    </span>
                  ))}
                </div>

                {/* Activity Name */}
                <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                
                {/* Activity Description */}
                <p className="text-gray-400 mb-4 line-clamp-2">{activity.description}</p>

                {/* Activity Details */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={16} className="text-purple-400" />
                    <span>{formatDate(activity.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users size={16} className="text-purple-400" />
                    <span>{activity.participants} participants</span>
                  </div>
                </div>

                {/* Price and Join Button */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold text-purple-300">
                    {activity.price} EX3
                  </div>
                  
                  {joinedActivities.includes(activity.id) ? (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Check size={18} />
                      Joined
                    </button>
                  ) : (
                    <button
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      onClick={(e) => handleJoin(e, activity.id)}
                    >
                      Join
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-semibold mb-2">No activities found</h3>
            <p className="text-gray-400">
              There are currently no activities in this category. Please check back later or select a different category.
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredActivities.length > 0 && (
          <div className="text-center mb-20">
            <button className="bg-purple-600/50 hover:bg-purple-500 text-white px-8 py-3 rounded-full transition-colors">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;