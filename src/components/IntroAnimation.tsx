import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onAnimationComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onAnimationComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Stage 0: Initial white screen
    // Stage 1: Dark vertical bar appears
    // Stage 2: Dark bar expands horizontally
    // Stage 3: Animation complete, component will unmount
    
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1200);
    
    const timer3 = setTimeout(() => {
      setAnimationStage(3);
      onAnimationComplete();
    }, 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onAnimationComplete]);
  
  return (
    <AnimatePresence>
      {animationStage < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* White background */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: animationStage >= 2 ? 0 : 1 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          
          {/* Dark vertical bar that expands horizontally */}
          <motion.div
            className="absolute bg-black"
            initial={{ 
              height: "100vh", 
              width: animationStage === 0 ? "0vw" : "4vw",
              left: "50%",
              x: "-50%"
            }}
            animate={{ 
              width: animationStage === 0 
                ? "0vw" 
                : animationStage === 1 
                  ? "4vw" 
                  : "100vw",
              x: "-50%"
            }}
            transition={{ 
              duration: animationStage === 1 ? 0.4 : 0.8,
              ease: "easeInOut"
            }}
          >
            {/* Logo that appears in the center of the bar during stage 1 */}
            {animationStage >= 1 && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: animationStage === 1 ? 1 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <img src="/logo.png" alt="EXP3 Logo" className="h-12 w-auto" />
              </motion.div>
            )}
          </motion.div>
          
          {/* Logo that fades in during the final stage */}
          {animationStage === 2 && (
            <motion.div
              className="absolute z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] // Custom spring-like easing
              }}
            >
              <img src="/logo.png" alt="EXP3 Logo" className="h-20 w-auto" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;