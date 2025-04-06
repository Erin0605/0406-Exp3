import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface POAP {
  id: number;
  title: string;
  description: string;
  gifUrl: string;
}

const poaps: POAP[] = [
  {
    id: 1,
    title: "Web3 Pioneer",
    description: "First steps into blockchain development",
    gifUrl: "/1.gif"
  },
  {
    id: 2,
    title: "UX Master",
    description: "Excellence in user experience design",
    gifUrl: "/2.gif"
  },
  {
    id: 3,
    title: "Security Expert",
    description: "Blockchain security certification",
    gifUrl: "/3.gif"
  }
];

const POAPShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleInteraction = (id: number) => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHoveredId(id);
    } else {
      setSelectedId(selectedId === id ? null : id);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHoveredId(null);
    }
  };

  const handleClick = (id: number) => {
    navigate(`/poap/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
      {poaps.map((poap) => (
        <motion.div
          key={poap.id}
          className="relative cursor-pointer"
          onClick={() => handleClick(poap.id)}
          onHoverStart={() => handleInteraction(poap.id)}
          onHoverEnd={handleMouseLeave}
          initial="bar"
          animate={
            (hoveredId === poap.id || selectedId === poap.id) ? "box" : "bar"
          }
          variants={{
            bar: {
              height: "80px",
              backgroundColor: "rgba(124, 58, 237, 0.2)",
              transition: { duration: 0.5, ease: "easeInOut" }
            },
            box: {
              height: ["80px", "320px"],
              backgroundColor: [
                "rgba(124, 58, 237, 0.2)",
                "rgba(124, 58, 237, 0.4)",
                "rgba(124, 58, 237, 0.15)"
              ],
              transition: { 
                height: { duration: 0.5, ease: "easeInOut" },
                backgroundColor: { 
                  duration: 0.8,
                  times: [0, 0.4, 1],
                  ease: "easeInOut"
                }
              }
            }
          }}
          className="rounded-xl overflow-hidden glass-card backdrop-blur-sm"
        >
          {/* Title bar */}
          <motion.div
            variants={{
              bar: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3 }
              },
              box: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3 }
              }
            }}
            className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10"
          >
            <h3 className="text-xl font-semibold text-purple-300">{poap.title}</h3>
          </motion.div>

          {/* Arrow Button */}
          <AnimatePresence>
            {(hoveredId === poap.id || selectedId === poap.id) && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-6 right-6 z-20"
              >
                <motion.div
                  className="flex items-center gap-2 bg-black/80 text-green-400 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">View Series</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded content */}
          <AnimatePresence>
            {(hoveredId === poap.id || selectedId === poap.id) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 pt-20"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-48 h-48 rounded-lg overflow-hidden mb-4"
                >
                  <img
                    src={poap.gifUrl}
                    alt={poap.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-xl font-semibold mb-2 text-purple-300"
                >
                  {poap.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-gray-400 text-center"
                >
                  {poap.description}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default POAPShowcase;