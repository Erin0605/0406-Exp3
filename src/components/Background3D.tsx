import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Curve path generator for complex movement trajectories
const createCurvePath = (centerX, centerY, centerZ, radiusX, radiusY, radiusZ, complexity = 1) => {
  // Create a closed curve with multiple control points for complex movement
  const curve = new THREE.CurvePath();
  
  // Number of points to create (higher = more complex path)
  const numPoints = 5 + Math.floor(complexity * 3);
  
  // Generate control points around a 3D ellipse with variations
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * Math.PI * 2;
    const nextTheta = ((i + 1) % numPoints / numPoints) * Math.PI * 2;
    
    // Base point on elliptical path
    const x = centerX + Math.cos(theta) * radiusX;
    const y = centerY + Math.sin(theta) * radiusY;
    const z = centerZ + Math.sin(theta * 2) * radiusZ;
    
    // Next point on path
    const nextX = centerX + Math.cos(nextTheta) * radiusX;
    const nextY = centerY + Math.sin(nextTheta) * radiusY;
    const nextZ = centerZ + Math.sin(nextTheta * 2) * radiusZ;
    
    // Add some randomness to control points for organic feel
    const ctrlX1 = x + (nextX - x) * 0.3 + (Math.random() - 0.5) * radiusX * 0.3;
    const ctrlY1 = y + (nextY - y) * 0.3 + (Math.random() - 0.5) * radiusY * 0.3;
    const ctrlZ1 = z + (nextZ - z) * 0.1 + (Math.random() - 0.5) * radiusZ * 0.2;
    
    const ctrlX2 = x + (nextX - x) * 0.7 + (Math.random() - 0.5) * radiusX * 0.3;
    const ctrlY2 = y + (nextY - y) * 0.7 + (Math.random() - 0.5) * radiusY * 0.3;
    const ctrlZ2 = z + (nextZ - z) * 0.9 + (Math.random() - 0.5) * radiusZ * 0.2;
    
    points.push(new THREE.Vector3(x, y, z));
    
    // Create a cubic bezier curve between points
    if (i < numPoints - 1) {
      const cubicBezier = new THREE.CubicBezierCurve3(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(ctrlX1, ctrlY1, ctrlZ1),
        new THREE.Vector3(ctrlX2, ctrlY2, ctrlZ2),
        new THREE.Vector3(nextX, nextY, nextZ)
      );
      curve.add(cubicBezier);
    } else {
      // Close the loop back to the first point
      const firstPoint = points[0];
      const cubicBezier = new THREE.CubicBezierCurve3(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(ctrlX1, ctrlY1, ctrlZ1),
        new THREE.Vector3(ctrlX2, ctrlY2, ctrlZ2),
        firstPoint
      );
      curve.add(cubicBezier);
    }
  }
  
  return curve;
};

// Animated 3D shape component with dramatic deformation and complex path movement
const AnimatedShape = ({ 
  position, 
  color, 
  speed, 
  distort, 
  scale, 
  phaseOffset = 0,
  pathComplexity = 1,
  pathScale = { x: 1.5, y: 1.2, z: 0.8 }
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const initialColor = useRef(new THREE.Color(color));
  const material = useRef<THREE.Material>();
  const pathRef = useRef<THREE.CurvePath<THREE.Vector3>>();
  const pathProgressRef = useRef(Math.random() * 100); // Random starting point on path
  
  // Create the path once on initialization
  useEffect(() => {
    pathRef.current = createCurvePath(
      position[0], position[1], position[2],
      pathScale.x, pathScale.y, pathScale.z,
      pathComplexity
    );
  }, [position, pathScale, pathComplexity]);
  
  // Animation loop with enhanced compression/deformation and path movement
  useFrame((state) => {
    if (!mesh.current || !pathRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Path movement - follow the complex curve
    pathProgressRef.current += speed * 0.02; // Increment progress along path
    
    // Get position on path (0-1 range, looping)
    const pathPosition = pathRef.current.getPoint(
      (pathProgressRef.current % 100) / 100
    );
    
    // Apply position from path with some additional subtle movement
    mesh.current.position.set(
      pathPosition.x + Math.sin(time * speed * 0.15) * 0.2,
      pathPosition.y + Math.sin(time * speed * 0.2) * 0.2,
      pathPosition.z + Math.sin(time * speed * 0.1) * 0.1
    );
    
    // Rotation during transformation for more organic feel
    mesh.current.rotation.x = Math.sin(time * speed * 0.15) * 0.3;
    mesh.current.rotation.y = Math.sin(time * speed * 0.1) * 0.4;
    mesh.current.rotation.z = Math.sin(time * speed * 0.05) * 0.2;
    
    // Enhanced compression/deformation effect (faster 6-8 second cycle)
    const compressionCycle = 7; // seconds for full cycle
    
    // More dramatic deformation (30-40% change)
    const deformationFactor = 0.35; // 35% deformation
    
    // Non-linear easing for more dynamic movement
    const t = (Math.sin(time / compressionCycle * Math.PI * 2 + phaseOffset) + 1) / 2; // 0 to 1 with easing
    const easedT = t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2; // Cubic easing
    
    // Opposite deformation directions based on phaseOffset
    const xScale = scale * (1 + (easedT * 2 - 1) * deformationFactor);
    const yScale = scale * (1 - (easedT * 2 - 1) * deformationFactor);
    const zScale = scale;
    
    mesh.current.scale.set(xScale, yScale, zScale);
    
    // Subtle pulsing effect on brightness during transformation
    if (material.current && 'color' in material.current) {
      const brightness = 1 + Math.sin(time / compressionCycle * Math.PI * 2) * 0.15;
      const newColor = initialColor.current.clone();
      newColor.multiplyScalar(brightness);
      (material.current as THREE.MeshStandardMaterial).color = newColor;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[1, 5]} /> {/* Higher detail for smoother deformation */}
      <MeshDistortMaterial 
        ref={material}
        color={color} 
        speed={speed * 0.3} 
        distort={distort} 
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={0.7}
        transparent={true}
        opacity={0.85}
      />
    </mesh>
  );
};

// Add smaller accent shapes that follow more erratic paths
const AccentShape = ({ position, color, scale, speed }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const time = useRef(Math.random() * 100);
  const pathRef = useRef<THREE.CurvePath<THREE.Vector3>>();
  const pathProgressRef = useRef(Math.random() * 100);
  
  useEffect(() => {
    // Create a more erratic path for accent shapes
    pathRef.current = createCurvePath(
      position[0], position[1], position[2],
      2.5, 2.0, 1.0,
      3 // Higher complexity for more erratic movement
    );
  }, [position]);
  
  useFrame((state) => {
    if (!mesh.current || !pathRef.current) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    time.current += speed * 0.01;
    
    // Move faster along the path
    pathProgressRef.current += speed * 0.04;
    
    // Get position on path (0-1 range, looping)
    const pathPosition = pathRef.current.getPoint(
      (pathProgressRef.current % 100) / 100
    );
    
    // Apply position from path
    mesh.current.position.set(
      pathPosition.x,
      pathPosition.y,
      pathPosition.z
    );
    
    // Rotation
    mesh.current.rotation.x = time.current * 0.5;
    mesh.current.rotation.y = time.current * 0.3;
    
    // Subtle scale pulsing
    const pulseFactor = Math.sin(elapsedTime * speed) * 0.1 + 1;
    mesh.current.scale.set(
      scale * pulseFactor,
      scale * pulseFactor,
      scale * pulseFactor
    );
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.9}
        roughness={0.1}
        transparent={true}
        opacity={0.6}
      />
    </mesh>
  );
};

// Bottom fade gradient overlay
const BottomFade = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
  );
};

// Scene setup component
const Scene = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.z = 6;
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#6d28d9" />
      
      {/* Two large spheres with opposite deformation phases and complex paths */}
      <AnimatedShape 
        position={[-6, 4, -3]} 
        color="#5b21b6" // Darker purple
        speed={0.25} 
        distort={0.3}
        scale={7.5} // Much larger (50% of screen height)
        phaseOffset={0} // First phase
        pathComplexity={1.5}
        pathScale={{ x: 2.0, y: 1.5, z: 0.8 }}
      />
      <AnimatedShape 
        position={[6, -4, -4]} 
        color="#7c3aed" // Medium purple
        speed={0.2} 
        distort={0.25}
        scale={8.0} // Even larger
        phaseOffset={Math.PI} // Opposite phase (180 degrees out of sync)
        pathComplexity={1.2}
        pathScale={{ x: 1.8, y: 2.0, z: 0.7 }}
      />
      
      {/* Add smaller accent shapes with more erratic movement */}
      <AccentShape 
        position={[3, 2, -2]} 
        color="#9333ea" 
        scale={0.8} 
        speed={0.4}
      />
      <AccentShape 
        position={[-4, -3, -1]} 
        color="#a855f7" 
        scale={0.6} 
        speed={0.5}
      />
      <AccentShape 
        position={[0, 5, -3]} 
        color="#8b5cf6" 
        scale={0.4} 
        speed={0.6}
      />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Camera controls - limited for subtle movement */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 2 - 0.15}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minAzimuthAngle={-0.15}
        maxAzimuthAngle={0.15}
        rotateSpeed={0.05}
      />
    </>
  );
};

// Main component with Canvas
const Background3D: React.FC = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 0, 6]} />
        <Scene />
      </Canvas>
      <BottomFade />
    </motion.div>
  );
};

export default Background3D;