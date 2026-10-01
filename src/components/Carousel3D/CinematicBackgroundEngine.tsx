import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightDustParticleSystem } from '../Particles/LightDustParticleSystem';

interface CinematicBackgroundEngineProps {
  currentImage: string;
  theme?: string;
  itemKey: string;
}

export const CinematicBackgroundEngine: React.FC<CinematicBackgroundEngineProps> = ({
  currentImage,
  theme = 'cinematic',
  itemKey
}) => {
  // Theme color accents for ambient radial glow
  const getGlowColor = () => {
    switch (theme) {
      case 'retro':
        return 'rgba(239, 68, 68, 0.35)'; // Crimson Velvet Rose
      case 'midnight':
        return 'rgba(168, 85, 247, 0.35)'; // Midnight Violet Orchid
      case 'minimal':
        return 'rgba(255, 255, 255, 0.2)'; // Pristine White Lotus
      case 'dreamy':
        return 'rgba(244, 114, 182, 0.35)'; // Blush Peony
      case 'cinematic':
      default:
        return 'rgba(245, 158, 11, 0.35)'; // Golden Meadow
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Crossfading High-Depth Blurred Photo Canvas */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-layer-${itemKey}`}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{
            opacity: 0.38,
            scale: [1.15, 1.22, 1.17],
            transition: {
              opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 25, repeat: Infinity, ease: 'easeInOut' }
            }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 1.0, ease: 'easeInOut' }
          }}
          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-125"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
      </AnimatePresence>

      {/* 2. Dynamic Ambient Color Core Glow */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 50% 45%, ${getGlowColor()} 0%, rgba(7,9,14,0) 65%)`
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 opacity-80"
      />

      {/* 3. Multi-Stop Vignette & Dark Contrast Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/75 to-black/60" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#07090e]/30 to-[#07090e]/95" />

      {/* 4. Canvas-Powered Cinematic Light Dust Particle System */}
      <LightDustParticleSystem count={48} className="opacity-90" />

      {/* 5. Subtle Fine-Art Lens Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
