import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AIOrb = ({ state = 'idle', onClick }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = [...Array(6)].map((_, i) => ({
      id: i,
      angle: (i / 6) * 360,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  const stateConfig = {
    idle: {
      primaryColor: 'from-cyan-500 to-blue-500',
      glowColor: 'rgba(79, 172, 254, 0.5)',
      pulseIntensity: 1,
      pulseSpeed: 2,
      ringScale: 1,
      symbolRotate: 0,
      symbolScale: 1
    },
    listening: {
      primaryColor: 'from-green-500 to-cyan-500',
      glowColor: 'rgba(34, 197, 94, 0.6)',
      pulseIntensity: 1.3,
      pulseSpeed: 1.2,
      ringScale: 1.2,
      symbolRotate: 360,
      symbolScale: 1.1
    },
    thinking: {
      primaryColor: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      pulseIntensity: 1.4,
      pulseSpeed: 0.8,
      ringScale: 1.3,
      symbolRotate: 720,
      symbolScale: 1.05
    },
    speaking: {
      primaryColor: 'from-orange-500 to-red-500',
      glowColor: 'rgba(249, 115, 22, 0.6)',
      pulseIntensity: 1.5,
      pulseSpeed: 0.5,
      ringScale: 1.4,
      symbolRotate: 1080,
      symbolScale: 1.15
    }
  };

  const config = stateConfig[state] || stateConfig.idle;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer" onClick={onClick}>
      {/* Outer glow container */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`,
            `0 0 40px ${config.glowColor}, 0 0 80px ${config.glowColor}`,
            `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`
          ]
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Outer ring 1 - Scales based on state */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-500/30"
        animate={{
          scale: [1, config.ringScale, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: config.pulseSpeed + 0.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Outer ring 2 - Slower animation */}
      <motion.div
        className="absolute inset-0 rounded-full border border-blue-500/20"
        animate={{
          scale: [1, config.ringScale * 1.2, 1],
          opacity: [0.2, 0.05, 0.2]
        }}
        transition={{
          duration: config.pulseSpeed + 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2
        }}
      />

      {/* Inner pulse rings */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
        animate={{
          boxShadow: [
            `inset 0 0 20px rgba(79, 172, 254, 0.3)`,
            `inset 0 0 40px rgba(79, 172, 254, 0.6)`,
            `inset 0 0 20px rgba(79, 172, 254, 0.3)`
          ]
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Main orb */}
      <motion.div
        className={`relative w-40 h-40 rounded-full bg-gradient-to-r ${config.primaryColor} shadow-2xl`}
        animate={{
          scale: [1, config.pulseIntensity, 1],
          boxShadow: [
            `0 0 30px ${config.glowColor}, inset -2px -2px 10px rgba(0, 0, 0, 0.3)`,
            `0 0 60px ${config.glowColor}, inset -2px -2px 10px rgba(0, 0, 0, 0.3)`,
            `0 0 30px ${config.glowColor}, inset -2px -2px 10px rgba(0, 0, 0, 0.3)`
          ]
        }}
        transition={{
          duration: config.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-t from-slate-950/50 to-transparent" />

        {/* Central symbol */}
        <motion.div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          animate={{
            rotate: config.symbolRotate
          }}
          transition={{
            duration: config.pulseSpeed * 2,
            repeat: state === 'idle' ? 0 : Infinity,
            ease: 'linear'
          }}
        >
          <motion.div
            className="text-4xl font-bold text-white"
            animate={{
              scale: [config.symbolScale, config.symbolScale * 1.1, config.symbolScale]
            }}
            transition={{
              duration: config.pulseSpeed,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            ◆
          </motion.div>
        </motion.div>

        {/* State label */}
        <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center">
          <div className="text-xs text-white/80 font-mono mt-8">FRIDAY</div>
          <motion.div
            className="text-xs text-white/60 mt-1 capitalize"
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {state}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating particles - orbit animation based on state */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            rotate: state === 'idle' ? [0, 360] : [0, 360 * 2],
            opacity: state === 'idle' ? 0.6 : 1
          }}
          transition={{
            duration: config.pulseSpeed * 3,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: '50%',
            left: '50%',
            transformOrigin: `${100 + Math.cos((particle.angle * Math.PI) / 180) * 100}px ${100 + Math.sin((particle.angle * Math.PI) / 180) * 100}px`
          }}
        />
      ))}

      {/* Status indicator dot */}
      <motion.div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${
          state === 'idle' ? 'bg-green-500' :
          state === 'listening' ? 'bg-green-400' :
          state === 'thinking' ? 'bg-purple-400' :
          'bg-orange-400'
        }`}
        animate={{
          boxShadow: [
            `0 0 4px currentColor`,
            `0 0 12px currentColor`,
            `0 0 4px currentColor`
          ]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default AIOrb;
