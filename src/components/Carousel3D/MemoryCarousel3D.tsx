import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  PanInfo
} from 'framer-motion';
import {
  Heart,
  Calendar,
  Play,
  Music,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Sparkles
} from 'lucide-react';
import { useAlbums } from '../../context/AlbumContext';
import { useAudio } from '../../context/AudioContext';
import { CinematicBackgroundEngine } from './CinematicBackgroundEngine';

interface CarouselItem {
  id: string;
  albumId: string;
  title: string;
  description: string;
  date: string;
  photoCount: number;
  songCount: number;
  cover: string;
  theme: string;
  primaryPhotoId: string;
}

interface MemoryCarousel3DProps {
  navigate: (to: string) => void;
  onOpenPhoto: (photoId: string) => void;
}

// Spring physics configuration
const SPRING_TRANSITION = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
  mass: 0.85
};

export const MemoryCarousel3D: React.FC<MemoryCarousel3DProps> = ({
  navigate,
  onOpenPhoto
}) => {
  const { albums, isFavorite, toggleFavorite } = useAlbums();
  const { isPlaying, togglePlay, playTrack } = useAudio();

  const items: CarouselItem[] = albums.map((alb) => ({
    id: alb.id,
    albumId: alb.id,
    title: alb.title,
    description: alb.description,
    date: alb.date,
    photoCount: alb.photos.length,
    songCount: alb.tracks.length,
    cover: alb.cover,
    theme: alb.theme,
    primaryPhotoId: alb.photos[0]?.id || alb.id
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Smooth mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const activeRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const activeRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);
  const wheelLockRef = useRef<boolean>(false);

  const activeItem = items[activeIndex] || items[0];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const pauseInteraction = useCallback(() => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsInteracting(false);
    }, 7000);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || isInteracting || items.length <= 1) return;

    autoPlayTimerRef.current = window.setInterval(() => {
      handleNext();
    }, 5500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, isInteracting, items.length, handleNext, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        pauseInteraction();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        pauseInteraction();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        const alb = albums.find((a) => a.id === activeItem?.albumId);
        if (alb) {
          if (alb.tracks.length > 0) playTrack(alb.tracks[0]);
          navigate(`/memory/${alb.id}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, pauseInteraction, activeItem, albums, navigate, playTrack]);

  // Mouse Parallax movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Wheel interaction with debounce
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaX) > 35 || Math.abs(e.deltaY) > 40) {
      pauseInteraction();
      wheelLockRef.current = true;
      if (e.deltaX > 0 || e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 550);
    }
  };

  // Drag End Gesture
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    pauseInteraction();
    if (info.offset.x > 50 || info.velocity.x > 300) {
      handlePrev();
    } else if (info.offset.x < -50 || info.velocity.x < -300) {
      handleNext();
    }
  };

  const handlePlayMemories = () => {
    const alb = albums.find((a) => a.id === activeItem.albumId);
    if (alb) {
      if (alb.tracks.length > 0) playTrack(alb.tracks[0]);
      navigate(`/memory/${alb.id}`);
    }
  };

  const handleCardClick = (index: number) => {
    pauseInteraction();
    if (index === activeIndex) {
      navigate(`/album/${activeItem.albumId}`);
    } else {
      setActiveIndex(index);
    }
  };

  if (items.length === 0) return null;

  const isHeroFavorite = isFavorite(activeItem.primaryPhotoId);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-between pt-10 pb-16 overflow-hidden select-none"
    >
      {/* 1. CINEMATIC BACKGROUND ENGINE */}
      <CinematicBackgroundEngine
        currentImage={activeItem.cover}
        theme={activeItem.theme}
        itemKey={activeItem.id}
      />

      {/* 2. TOP HEADER TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center max-w-xl px-4 mt-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-[11px] tracking-[0.22em] uppercase font-mono mb-3">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Interactive 3D Album</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinematic font-bold tracking-[0.16em] text-white uppercase drop-shadow-2xl">
          YOUR MEMORIES
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 font-light tracking-wide mt-1.5 drop-shadow">
          Moments worth remembering.
        </p>
      </motion.div>

      {/* 3. 3D SPRING-PHYSICS PERSPECTIVE CAROUSEL */}
      <div
        className="relative z-20 w-full max-w-6xl h-[420px] sm:h-[480px] md:h-[530px] my-6 flex items-center justify-center touch-pan-y"
        style={{
          perspective: windowWidth < 640 ? '950px' : '1400px',
          transformStyle: 'preserve-3d'
        }}
      >
        {items.map((item, idx) => {
          const total = items.length;
          let diff = idx - activeIndex;

          // Wrap-around math for circular indexing
          if (diff < -Math.floor(total / 2)) diff += total;
          if (diff > Math.floor(total / 2)) diff -= total;

          const isCenter = diff === 0;
          const isImmediate = Math.abs(diff) === 1;
          const isVisible = Math.abs(diff) <= 2;

          if (!isVisible) return null;

          // Responsive spatial coordinates
          const stepSize = windowWidth < 640 ? 140 : windowWidth < 1024 ? 225 : 300;
          const xOffset = diff * stepSize;
          const zOffset = isCenter ? (windowWidth < 640 ? 90 : 130) : isImmediate ? -90 : -250;
          const scale = isCenter ? 1.05 : isImmediate ? 0.82 : 0.66;
          const rotateY = diff * -24;
          const opacity = isCenter ? 1.0 : isImmediate ? 0.72 : 0.35;
          const blur = isCenter ? 0 : isImmediate ? 2 : 5;
          const zIndex = isCenter ? 30 : isImmediate ? 20 : 10;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(idx)}
              drag={isCenter ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={false}
              animate={{
                x: xOffset,
                z: zOffset,
                scale,
                rotateY,
                opacity,
                filter: `blur(${blur}px) brightness(${isCenter ? 1.08 : 0.75})`
              }}
              style={{
                zIndex,
                rotateX: isCenter ? activeRotateX : 0,
                ...(isCenter ? { rotateY: activeRotateY } : {})
              }}
              transition={SPRING_TRANSITION}
              whileHover={
                !isCenter
                  ? {
                      scale: scale * 1.04,
                      opacity: opacity + 0.15,
                      filter: `blur(${Math.max(0, blur - 1.5)}px) brightness(0.9)`
                    }
                  : {}
              }
              className={`absolute top-0 w-[245px] sm:w-[325px] md:w-[375px] h-[365px] sm:h-[445px] md:h-[495px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer ${
                isCenter
                  ? 'ring-1 ring-amber-400/60 shadow-2xl shadow-black/90'
                  : 'hover:opacity-95'
              }`}
            >
              {/* Card Image Container */}
              <div className="relative w-full h-full bg-neutral-950">
                <motion.img
                  src={item.cover}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  animate={{ scale: isCenter ? 1.04 : 1.0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-full h-full object-cover"
                />

                {/* Subtle dark gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-black/25" />

                {/* Top Badge on Center Card */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs"
                  >
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 font-mono text-[11px]">
                      {item.date}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                      Featured
                    </span>
                  </motion.div>
                )}

                {/* Card Information Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end">
                  <h3 className="text-xl sm:text-2xl font-cinematic font-bold text-white tracking-wide uppercase leading-tight drop-shadow-md">
                    {item.title}
                  </h3>

                  {isCenter && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="text-xs sm:text-sm text-neutral-300 font-light mt-2 line-clamp-2 leading-relaxed drop-shadow"
                    >
                      {item.description}
                    </motion.p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-3 pt-3 border-t border-white/10">
                    <span>{item.photoCount} memories</span>
                    <span>·</span>
                    <span>{item.songCount} {item.songCount === 1 ? 'song' : 'songs'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Navigation Arrow Affordances */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            pauseInteraction();
            handlePrev();
          }}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          title="Previous Memory (Left arrow)"
          aria-label="Previous Memory"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            pauseInteraction();
            handleNext();
          }}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          title="Next Memory (Right arrow)"
          aria-label="Next Memory"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      {/* 4. ACTIVE CARD DETAILS & PROGRESS INDICATOR */}
      <div className="relative z-20 flex flex-col items-center text-center mt-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  pauseInteraction();
                  setActiveIndex(i);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === activeIndex
                    ? 'w-6 h-1.5 bg-amber-400'
                    : 'w-1.5 h-1.5 bg-neutral-600 hover:bg-neutral-400'
                }`}
                title={`Go to item ${i + 1}`}
                aria-label={`Go to item ${i + 1}`}
              />
            ))}
          </div>

          {/* Auto mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white'
            }`}
            title={isAutoPlaying ? 'Pause Auto Carousel' : 'Enable Auto Carousel'}
          >
            {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
          </motion.button>
        </div>
      </div>

      {/* 5. FLOATING GLASS CONTROL BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-30 flex items-center justify-center px-4 w-full"
      >
        <div className="flex items-center gap-1.5 sm:gap-3 p-2 sm:px-5 sm:py-2.5 rounded-full bg-neutral-900/85 backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/80 text-neutral-300">
          {/* Favorite */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFavorite(activeItem.primaryPhotoId)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              isHeroFavorite
                ? 'text-red-400 bg-red-500/15'
                : 'hover:text-white hover:bg-white/5'
            }`}
            title={isHeroFavorite ? 'Remove Favorite' : 'Favorite Memory'}
          >
            <Heart className={`w-4 h-4 ${isHeroFavorite ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">Favorite</span>
          </motion.button>

          {/* Timeline */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/timeline')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Open Timeline"
          >
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="hidden md:inline">Timeline</span>
          </motion.button>

          {/* PLAY MEMORIES (Primary Action) */}
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 25px rgba(245, 158, 11, 0.45)' }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePlayMemories}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
            title="Play in Fullscreen Memory Mode"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Memories</span>
          </motion.button>

          {/* Music */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              isPlaying
                ? 'text-amber-400 bg-amber-400/10'
                : 'hover:text-white hover:bg-white/5'
            }`}
            title={isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
          >
            <Music className="w-4 h-4" />
            <span className="hidden md:inline">Music</span>
          </motion.button>

          {/* Fullscreen */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenPhoto(activeItem.primaryPhotoId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Fullscreen Photo Lightbox"
          >
            <Maximize2 className="w-4 h-4 text-neutral-400" />
            <span className="hidden md:inline">Fullscreen</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
