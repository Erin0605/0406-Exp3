import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 hidden md:block"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="relative cursor-pointer overflow-hidden rounded-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`flex items-center rounded-full border transition-colors duration-300 ${
            isHovered 
              ? 'bg-[#90EE90] text-black border-[#90EE90]' 
              : 'bg-[#90EE90]/20 text-white border-[#90EE90]/50'
          } ${isClicked ? 'button-feedback' : ''}`}
        >
          <motion.div 
            className="flex items-center justify-center rounded-full p-2 mr-2"
            animate={{ 
              x: isHovered ? "calc(100% + 0.5rem)" : 0 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
          <span className="font-medium pr-6 pl-2">Contact</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;