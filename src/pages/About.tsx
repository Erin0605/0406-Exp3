import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, Quote, User, Calendar, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return { displayText, isComplete };
};

// Feature item component with expandable content
const FeatureItem = ({ title, brief, expanded, icon: Icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" }
        }
      }}
      className="mb-8 last:mb-0"
    >
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center mr-4 flex-shrink-0">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <button 
              onClick={toggleExpand}
              className="p-2 rounded-full bg-purple-900/30 hover:bg-purple-900/50 transition-colors ml-2 flex-shrink-0"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">{brief}</p>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-purple-800/30">
                  <p className="text-gray-400">{expanded}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={toggleExpand}
            className="mt-4 text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {isExpanded ? "Read Less" : "Read More"}
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
      
      {/* Divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-800/30 to-transparent my-8"></div>
    </motion.div>
  );
};

// Infinite Scrolling Testimonial Carousel
const TestimonialCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Testimonial quotes
  const testimonials = [
    "🌟 Future of UX: Key Insights from the UX Design Conference. I had an amazing time at the #UXTrendConference today!",
    "This conference gave me a clearer vision of UX and boosted my confidence in tackling upcoming challenges!",
    "Attended the UX Innovation Trends and Product Design Seminar (UX3) on 2/15 - learned so much and got a great book!",
    "Yesterday, I attended '2025 UX Innovation Trends and Product Design Seminar UX Three Streams' held by UX3 and meeting some incredible peers at my table!",
    "I am very grateful to the teachers and TAs for organizing this physical event, and I would like to actively participate in it in the future! It was a great opportunity to meet other industry peers offline and I look forward to the next gathering!",
    "I am very glad that the teacher organized this physical activity and I feel that I have gained a lot from it! I hope we can organize more activities like this, it's very interesting. Thank you, teachers and everyone! I hope there will be more seminars like this next time 😌",
    "「當虛擬世界變成了日常，人類會回頭追逐實體的溫度。當物質世界走向了頂峰，對精神世界的渴求會成為巨大的引力場。當 AI 越來越完美，我們反而會想念那些不完美。大量消費會成為過去，體驗消費會成為未來。」",
    "覺得時間安排的很好，是很輕鬆自在的午茶時間，未來期望能得知：1運用在工作中的新技術2聽業界經驗分享與業界用人需求。",
    "希望多多舉辦類似的活動，非常有趣，這次在群裡認識到很棒的職場前輩，收穫很大"
  ];

  // Double the testimonials to ensure smooth looping
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      
      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      
      {/* Carousel container */}
      <div 
        ref={scrollContainerRef}
        className="py-8 overflow-hidden"
      >
        <div 
          className="flex gap-6 animate-infinite-scroll"
          style={{ 
            width: 'fit-content'
          }}
        >
          {allTestimonials.map((quote, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-80"
            >
              <div 
                className="bg-purple-900/20 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30 h-full"
              >
                <Quote className="w-8 h-8 text-purple-500/50 mb-4" />
                <p className="text-gray-300 italic">{quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Photo Gallery component with infinite scrolling
const PhotoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Gallery photos data
  const photos = [
    {
      url: "/Activity01.jpg",
      alt: "Read-Write-Own Reading Club",
      title: "Read-Write-Own Reading Club",
      description: "Discussion exploring digital ownership in the Web3 era"
    },
    {
      url: "/Activity02.jpg",
      alt: "UX Innovation Trends and Product Design Seminar",
      title: "UX Innovation Trends and Product Design Seminar",
      description: "Session on emerging UX design patterns and methodologies"
    },
    {
      url: "/Activity03.jpg",
      alt: "UX Innovation Trends and Product Design Seminar",
      title: "UX Innovation Trends and Product Design Seminar",
      description: "Hands-on workshop with industry professionals"
    },
    {
      url: "/Activity04.jpg",
      alt: "UX Innovation Trends and Product Design Seminar",
      title: "UX Innovation Trends and Product Design Seminar",
      description: "Networking and knowledge sharing among participants"
    }
  ];
  
  // Double the photos to ensure smooth looping
  const allPhotos = [...photos, ...photos];
  
  const openLightbox = (index) => {
    setLightboxIndex(index % photos.length);
    setIsLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  
  const nextLightboxPhoto = () => {
    setLightboxIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };
  
  const prevLightboxPhoto = () => {
    setLightboxIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  
  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'ArrowRight') {
        nextLightboxPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxPhoto();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);
  
  return (
    <div className="relative">
      {/* Main gallery with infinite scroll */}
      <div className="relative overflow-hidden h-96 rounded-xl">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        
        {/* Carousel container */}
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-hidden"
        >
          <div 
            className="flex h-full animate-infinite-scroll"
            style={{ 
              width: 'fit-content'
            }}
          >
            {allPhotos.map((photo, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[400px] h-full mx-3 relative cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.alt}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="text-white text-xl font-medium">{photo.title}</h4>
                  <p className="text-gray-300">{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <ChevronDown className="w-6 h-6 transform rotate-45" />
            </button>
            
            <div className="relative max-w-5xl w-full max-h-[80vh]">
              <motion.img 
                key={lightboxIndex}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={photos[lightboxIndex].url} 
                alt={photos[lightboxIndex].alt}
                className="w-full h-full object-contain"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-6">
                <h4 className="text-white text-xl font-medium">{photos[lightboxIndex].title}</h4>
                <p className="text-gray-300">{photos[lightboxIndex].description}</p>
              </div>
            </div>
            
            <button
              onClick={prevLightboxPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronDown className="w-6 h-6 transform rotate-90" />
            </button>
            
            <button
              onClick={nextLightboxPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
              aria-label="Next photo"
            >
              <ChevronDown className="w-6 h-6 transform -rotate-90" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main About component
const About = () => {
  const controls = useAnimation();
  const { displayText, isComplete } = useTypewriter("Learn, grow, and get inspired by what's next", 50);
  
  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Particle animation component
  const ParticleBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-purple-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen pt-20 bg-black">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-green-400 text-transparent bg-clip-text inline-block">
              {displayText}
              <span className={`inline-block w-0.5 h-10 bg-purple-400 ml-1 ${isComplete ? 'animate-pulse' : 'animate-blink'}`}></span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Transforming Learning Experiences into Digital Assets
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how EXP3 is revolutionizing the learning ecosystem through blockchain technology
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <FeatureItem 
              title="Blockchain-Verified Learning Credentials" 
              brief="Transform your learning experiences into verifiable digital assets."
              expanded="Using POAP (Proof of Attendance Protocol) technology, your participation in workshops, seminars, and learning events is permanently recorded on the blockchain, creating tamper-proof credentials that showcase your authentic learning journey. Unlike traditional certificates, these digital proofs are instantly verifiable by anyone, anywhere."
              icon={Calendar}
            />
            
            <FeatureItem 
              title="Value Extension Through EX3 Tokens" 
              brief="Our token system extends the value of learning beyond event completion."
              expanded="Our innovative token system transforms how value flows through the learning ecosystem. Rather than having the value of an event end when the session does, EX3 tokens allow that value to continue circulating within our community. Participants earn tokens through active engagement, which can be used to join future events, exchange for services, or even share knowledge. This creates a self-sustaining learning economy where event organizers receive tokens that fund new learning opportunities, participants can transform gained knowledge into real value, token holders receive benefits from all platform transactions, and the entire community benefits from increased knowledge sharing."
              icon={User}
            />
            
            <FeatureItem 
              title="Recognition for Short-term Learning Activities" 
              brief="Capture the value of workshops, meetups, and short-term learning experiences."
              expanded="In today's fast-paced world, valuable learning happens in many formats beyond traditional education. Exp3 uniquely captures and validates the value of workshops, meetups, and short-term learning experiences that traditional credentials overlook. These micro-learning moments, which often contain the most cutting-edge knowledge, become part of your comprehensive skill profile, demonstrating your commitment to continuous growth and adaptability."
              icon={Gift}
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 relative bg-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from professionals who have transformed their learning journey with EXP3
            </p>
          </motion.div>
          
          <TestimonialCarousel />
        </div>
      </section>
      
      {/* Activity Photo Gallery */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Activity Gallery</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our past events and activities through our photo gallery
            </p>
          </motion.div>
          
          <PhotoGallery />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join EXP3 today and start building your blockchain-verified portfolio of skills and experiences.
            </p>
            <Link 
              to="/profile"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;