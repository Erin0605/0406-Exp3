import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GradientBlobBackgroundProps {
  category: string;
}

const GradientBlobBackground: React.FC<GradientBlobBackgroundProps> = ({ category }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  
  // Define color schemes for each category
  const colorSchemes = {
    all: [
      { colors: ['rgba(124, 58, 237, 0.15)', 'rgba(139, 92, 246, 0.1)'], size: 300 }, // Purple
      { colors: ['rgba(52, 211, 153, 0.15)', 'rgba(16, 185, 129, 0.1)'], size: 350 }, // Green
      { colors: ['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.1)'], size: 280 }, // Blue
      { colors: ['rgba(239, 68, 68, 0.15)', 'rgba(220, 38, 38, 0.1)'], size: 320 }, // Red
    ],
    reading: [
      { colors: ['rgba(52, 211, 153, 0.2)', 'rgba(16, 185, 129, 0.15)'], size: 350 }, // Green
      { colors: ['rgba(5, 150, 105, 0.2)', 'rgba(4, 120, 87, 0.15)'], size: 300 }, // Dark Green
      { colors: ['rgba(20, 184, 166, 0.2)', 'rgba(13, 148, 136, 0.15)'], size: 280 }, // Teal
      { colors: ['rgba(6, 182, 212, 0.15)', 'rgba(8, 145, 178, 0.1)'], size: 320 }, // Cyan
    ],
    forum: [
      { colors: ['rgba(124, 58, 237, 0.2)', 'rgba(109, 40, 217, 0.15)'], size: 320 }, // Purple
      { colors: ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.15)'], size: 280 }, // Light Purple
      { colors: ['rgba(91, 33, 182, 0.2)', 'rgba(76, 29, 149, 0.15)'], size: 350 }, // Dark Purple
      { colors: ['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.1)'], size: 300 }, // Lavender
    ],
    'coming-soon': [
      { colors: ['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.1)'], size: 300 }, // Blue
      { colors: ['rgba(96, 165, 250, 0.15)', 'rgba(59, 130, 246, 0.1)'], size: 280 }, // Light Blue
      { colors: ['rgba(75, 85, 99, 0.15)', 'rgba(55, 65, 81, 0.1)'], size: 350 }, // Gray
      { colors: ['rgba(107, 114, 128, 0.1)', 'rgba(75, 85, 99, 0.05)'], size: 320 }, // Light Gray
    ]
  };

  // Initialize blobs with random positions and velocities
  const initializeBlobs = (category: string) => {
    const scheme = colorSchemes[category] || colorSchemes.all;
    
    return scheme.map((blob, index) => {
      const canvas = canvasRef.current;
      const width = canvas.width;
      const height = canvas.height;
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: blob.size,
        vx: (Math.random() - 0.5) * 0.3, // Random velocity X
        vy: (Math.random() - 0.5) * 0.3, // Random velocity Y
        colors: blob.colors,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        deformFactor: 0.3 + Math.random() * 0.3, // Random deformation factor
        deformSpeed: 0.0005 + Math.random() * 0.001, // Random deformation speed
        deformOffset: Math.random() * Math.PI * 2, // Random starting phase
        opacity: 0, // Start with 0 opacity for fade-in
        targetOpacity: 0.8 + Math.random() * 0.2, // Target opacity
      };
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize blobs for the current category
    let blobs = initializeBlobs(category);
    
    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each blob
      blobs.forEach(blob => {
        // Update position
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // Bounce off edges
        if (blob.x < -blob.size/2) blob.x = canvas.width + blob.size/2;
        if (blob.x > canvas.width + blob.size/2) blob.x = -blob.size/2;
        if (blob.y < -blob.size/2) blob.y = canvas.height + blob.size/2;
        if (blob.y > canvas.height + blob.size/2) blob.y = -blob.size/2;
        
        // Update rotation
        blob.rotation += blob.rotationSpeed;
        
        // Update deformation
        const time = performance.now() * 0.001;
        const deform = Math.sin(time * blob.deformSpeed + blob.deformOffset) * blob.deformFactor;
        
        // Fade in opacity
        if (blob.opacity < blob.targetOpacity) {
          blob.opacity += 0.005;
        }
        
        // Draw blob
        ctx.save();
        ctx.translate(blob.x, blob.y);
        ctx.rotate(blob.rotation);
        ctx.scale(1 + deform, 1 - deform);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.size / 2);
        gradient.addColorStop(0, blob.colors[0]);
        gradient.addColorStop(1, blob.colors[1]);
        
        ctx.globalAlpha = blob.opacity;
        ctx.fillStyle = gradient;
        
        // Draw irregular blob shape
        ctx.beginPath();
        
        // Create irregular blob using bezier curves
        const points = 8;
        const angleStep = (Math.PI * 2) / points;
        const irregularity = 0.4; // How irregular the shape is
        
        // First point
        const radius = blob.size / 2;
        const firstRadius = radius * (1 + (Math.sin(time * 0.5 + 0) * irregularity));
        const firstX = Math.cos(0) * firstRadius;
        const firstY = Math.sin(0) * firstRadius;
        ctx.moveTo(firstX, firstY);
        
        // Draw bezier curves between points
        for (let i = 1; i <= points; i++) {
          const prevAngle = angleStep * (i - 1);
          const angle = angleStep * i;
          
          // Control points
          const cp1Angle = prevAngle + angleStep / 3;
          const cp2Angle = prevAngle + (angleStep / 3) * 2;
          
          // Radii with time-based deformation
          const prevRadius = radius * (1 + (Math.sin(time * 0.5 + prevAngle) * irregularity));
          const nextRadius = radius * (1 + (Math.sin(time * 0.5 + angle) * irregularity));
          const cp1Radius = radius * (1 + (Math.sin(time * 0.5 + cp1Angle) * irregularity));
          const cp2Radius = radius * (1 + (Math.sin(time * 0.5 + cp2Angle) * irregularity));
          
          // Control points
          const cp1x = Math.cos(cp1Angle) * cp1Radius;
          const cp1y = Math.sin(cp1Angle) * cp1Radius;
          const cp2x = Math.cos(cp2Angle) * cp2Radius;
          const cp2y = Math.sin(cp2Angle) * cp2Radius;
          
          // End point
          const x = Math.cos(angle) * nextRadius;
          const y = Math.sin(angle) * nextRadius;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Apply blur filter
        ctx.filter = 'blur(60px)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.fill();
        
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [category]);

  // When category changes, transition to new blobs
  useEffect(() => {
    // Animation will restart with new category colors
  }, [category]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      {/* Overlay gradient to ensure content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />
    </div>
  );
};

export default GradientBlobBackground;