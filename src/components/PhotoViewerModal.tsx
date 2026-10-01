import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Play,
  Pause,
  Maximize,
  Minimize,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react';
import { Photo, Album } from '../types';
import { useAlbums } from '../context/AlbumContext';

interface PhotoViewerModalProps {
  photo: Photo | null;
  album?: Album;
  photosList?: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  photo,
  album,
  photosList,
  onClose,
  onSelectPhoto
}) => {
  const { isFavorite, toggleFavorite } = useAlbums();
  const [showInfo, setShowInfo] = useState(false);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Touch tracking for mobile swipe and double tap
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const lastTapRef = useRef<number>(0);

  const activeList = photosList && photosList.length > 0 ? photosList : album ? album.photos : photo ? [photo] : [];
  const currentIndex = photo ? activeList.findIndex((p) => p.id === photo.id) : 0;
  const currentPhoto = photo || (activeList.length > 0 ? activeList[0] : null);

  const handleNext = useCallback(() => {
    if (activeList.length === 0) return;
    const nextIndex = (currentIndex + 1) % activeList.length;
    onSelectPhoto(activeList[nextIndex]);
  }, [activeList, currentIndex, onSelectPhoto]);

  const handlePrev = useCallback(() => {
    if (activeList.length === 0) return;
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    onSelectPhoto(activeList[prevIndex]);
  }, [activeList, currentIndex, onSelectPhoto]);

  // Slideshow interval
  useEffect(() => {
    if (!isSlideshowRunning || !currentPhoto) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isSlideshowRunning, currentPhoto, handleNext]);

  // Inactivity fade for controls
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  }, []);

  useEffect(() => {
    if (currentPhoto) {
      resetControlsTimer();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [currentPhoto, resetControlsTimer]);

  // Fullscreen API toggle
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!currentPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsSlideshowRunning((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleBrowserFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhoto, handleNext, handlePrev, onClose, resetControlsTimer]);

  // Mobile Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;

    const now = Date.now();
    if (now - lastTapRef.current < 300 && currentPhoto) {
      // Double tap -> favorite
      toggleFavorite(currentPhoto.id);
    }
    lastTapRef.current = now;
    resetControlsTimer();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
      // Swipe down to close
      onClose();
    }
  };

  if (!currentPhoto) return null;

  const isFav = isFavorite(currentPhoto.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentPhoto.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none overflow-hidden"
      onMouseMove={resetControlsTimer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Blurred background photo layer */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-125 transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${currentPhoto.src})` }}
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* TOP BAR */}
      <header
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-cinematic font-medium text-neutral-300 tracking-wider">
            {album?.title || 'Gallery'}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            {currentIndex + 1} / {activeList.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
          title="Close (Esc)"
          aria-label="Close photo viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* MAIN PHOTO DISPLAY */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 z-20">
        <img
          key={currentPhoto.id}
          src={currentPhoto.src}
          alt={currentPhoto.title}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-full object-contain rounded-lg sm:rounded-xl shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
        />

        {/* Previous Button */}
        {activeList.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white border border-white/10 backdrop-blur-md transition-all ${
              controlsVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'
            }`}
            title="Previous (Left arrow)"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {activeList.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white border border-white/10 backdrop-blur-md transition-all ${
              controlsVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'
            }`}
            title="Next (Right arrow)"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* BOTTOM CONTROLS & CAPTION */}
      <footer
        className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center px-4 sm:px-8 pb-6 sm:pb-8 pt-12 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Caption & Title */}
        <div className="text-center max-w-xl mb-4 pointer-events-auto">
          <h3 className="text-base sm:text-lg font-cinematic font-semibold text-white tracking-wide">
            {currentPhoto.title}
          </h3>
          {currentPhoto.caption && (
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1 max-w-lg">
              {currentPhoto.caption}
            </p>
          )}
        </div>

        {/* Controls Pill Bar */}
        <div className="flex items-center gap-2 sm:gap-4 p-2 px-4 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 pointer-events-auto">
          <button
            onClick={() => toggleFavorite(currentPhoto.id)}
            className={`p-2 rounded-full transition-colors ${
              isFav ? 'text-red-500 fill-red-500' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Favorite"
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsSlideshowRunning((prev) => !prev)}
            className={`p-2 rounded-full transition-colors ${
              isSlideshowRunning ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
            title="Slideshow (Space)"
            aria-label="Toggle Slideshow"
          >
            {isSlideshowRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowInfo((prev) => !prev)}
            className={`p-2 rounded-full transition-colors ${
              showInfo ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
            title="Photo Info"
            aria-label="Photo Info"
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={toggleBrowserFullscreen}
            className="p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
            title="Fullscreen (F)"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* METADATA DRAWER */}
        {showInfo && (
          <aside
            aria-label="Photo Metadata"
            className="w-full max-w-md mt-4 p-4 rounded-2xl bg-neutral-900/95 border border-neutral-800 text-xs text-neutral-300 space-y-2 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-semibold text-white">Details & EXIF</span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            {currentPhoto.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Captured: {currentPhoto.date}</span>
              </div>
            )}
            {currentPhoto.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Location: {currentPhoto.location}</span>
              </div>
            )}
            {currentPhoto.cameraInfo && (
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/60">
                <Camera className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  {currentPhoto.cameraInfo.camera || 'Camera'} · {currentPhoto.cameraInfo.lens || ''} · {currentPhoto.cameraInfo.aperture || ''} · {currentPhoto.cameraInfo.iso ? `ISO ${currentPhoto.cameraInfo.iso}` : ''}
                </span>
              </div>
            )}
          </aside>
        )}
      </footer>
    </div>
  );
};
