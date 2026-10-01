import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Maximize,
  Minimize,
  Sliders,
  MapPin,
  Calendar,
  Music
} from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { useAudio } from '../context/AudioContext';
import { TransitionEffect } from '../types';

interface MemoryModePageProps {
  albumId?: string;
  navigate: (to: string) => void;
}

export const MemoryModePage: React.FC<MemoryModePageProps> = ({ albumId, navigate }) => {
  const { albums, allPhotos, settings, updateSettings } = useAlbums();
  const { currentTrack, isPlaying, togglePlay, volume, isMuted, toggleMute, playTrack } = useAudio();

  const currentAlbum = albumId ? albums.find((a) => a.id === albumId) : albums[0];
  const photos = currentAlbum ? currentAlbum.photos : allPhotos;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(
    currentAlbum?.settings?.slideshowDuration || settings.slideshowDuration || 5
  );
  const [selectedTransition, setSelectedTransition] = useState<TransitionEffect>(
    currentAlbum?.settings?.transition || settings.transition || 'cinematic'
  );
  const [kenBurnsActive, setKenBurnsActive] = useState<boolean>(settings.kenBurns);

  const timerRef = useRef<number | null>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  // Auto-play music if album has tracks and music autoplay is on
  useEffect(() => {
    if (currentAlbum && currentAlbum.tracks.length > 0 && settings.musicAutoplay && !isPlaying) {
      playTrack(currentAlbum.tracks[0]).catch(() => {
        // Autoplay may be blocked by browser until user interaction
      });
    }
  }, [currentAlbum, settings.musicAutoplay, isPlaying, playTrack]);

  // Handle Next Photo
  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Handle Previous Photo
  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Slideshow Timer Loop
  useEffect(() => {
    if (isPaused || photos.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      handleNext();
    }, selectedDuration * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, photos.length, selectedDuration, handleNext, currentIndex]);

  // Controls auto-hide
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = window.setTimeout(() => {
      if (!showSettingsDrawer) {
        setControlsVisible(false);
      }
    }, 4000);
  }, [showSettingsDrawer]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    };
  }, [currentIndex, resetControlsTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showSettingsDrawer) {
          setShowSettingsDrawer(false);
        } else {
          navigate(currentAlbum ? `/album/${currentAlbum.id}` : '/albums');
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, navigate, currentAlbum, showSettingsDrawer, resetControlsTimer]);

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <h2 className="text-2xl font-cinematic">No photos found in this memory</h2>
        <button
          onClick={() => navigate('/albums')}
          className="mt-6 px-6 py-2.5 rounded-full bg-amber-400 text-neutral-950 font-semibold text-xs uppercase"
        >
          Back to Albums
        </button>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  // Ken Burns variant cycling (1-4)
  const kenBurnsClass = kenBurnsActive
    ? `ken-burns-${(currentIndex % 4) + 1}`
    : '';

  // Transition style class
  const getTransitionClass = () => {
    if (selectedTransition === 'fade') return 'animate-in fade-in duration-1000';
    if (selectedTransition === 'smooth') return 'animate-in fade-in zoom-in-95 duration-1000';
    if (selectedTransition === 'minimal') return 'animate-in fade-in duration-300';
    // Cinematic default
    return 'animate-in fade-in zoom-in-90 duration-1200';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {/* 1. DYNAMIC ENLARGED BLURRED BACKGROUND PHOTO */}
      <div
        key={`bg-${currentPhoto.id}`}
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-125 transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url(${currentPhoto.src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

      {/* 2. TOP MINIMALIST HEADER */}
      <header
        className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 transition-opacity duration-500 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(currentAlbum ? `/album/${currentAlbum.id}` : '/albums')}
            className="flex items-center gap-2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            title="Exit Memory Mode"
            aria-label="Exit Memory Mode"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-cinematic tracking-wider text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentAlbum?.title || 'Memories'}</span>
            <span className="text-neutral-500">·</span>
            <span className="font-mono text-neutral-400 tabular-nums">
              {currentIndex + 1} of {photos.length}
            </span>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Music Autoplay notification / toggle */}
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-black/50 text-neutral-300 border-white/10 hover:text-white'
            }`}
            title={isPlaying ? 'Pause Soundtrack' : 'Start Soundtrack'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isPlaying ? (currentTrack?.title || 'Soundtrack') : 'Play Music'}
            </span>
          </button>

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            title="Slideshow & Transition Settings"
            aria-label="Slideshow Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. MAIN CINEMATIC PHOTO VIEWPORT WITH KEN BURNS EFFECT */}
      <main className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-16 z-20">
        <div className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black">
          <img
            key={currentPhoto.id}
            src={currentPhoto.src}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            className={`max-w-full max-h-[82vh] object-contain rounded-xl select-none ${getTransitionClass()} ${kenBurnsClass}`}
          />
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="Previous Photo"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer ${
                controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="Next Photo"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </main>

      {/* 4. BOTTOM CAPTION & PROGRESS BAR */}
      <footer
        className={`absolute bottom-0 left-0 right-0 z-40 flex flex-col items-center pb-6 sm:pb-8 pt-16 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Caption & Metadata */}
        <div className="text-center max-w-2xl px-6 mb-4 animate-in fade-in duration-500">
          <h2 className="text-lg sm:text-2xl font-cinematic font-bold text-white tracking-wide">
            {currentPhoto.title}
          </h2>
          {settings.showCaptions && currentPhoto.caption && (
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1.5 leading-relaxed max-w-xl mx-auto">
              "{currentPhoto.caption}"
            </p>
          )}

          {settings.showMetadata && (
            <div className="flex items-center justify-center gap-3 text-xs text-neutral-400 font-mono mt-2">
              {currentPhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  {currentPhoto.location}
                </span>
              )}
              {currentPhoto.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  {currentPhoto.date}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center Playback Bar */}
        <div className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-amber-400 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current text-amber-400" /> : <Pause className="w-4 h-4 fill-current" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <span className="text-neutral-600">|</span>

          {/* Duration Indicator */}
          <span className="text-xs text-neutral-400 font-mono">
            {selectedDuration}s pace
          </span>

          <span className="text-neutral-600">|</span>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>

      {/* 5. SLIDESHOW SETTINGS SLIDE-OVER DRAWER */}
      {showSettingsDrawer && (
        <aside
          aria-label="Memory Mode Settings"
          className="absolute top-20 right-6 z-50 w-80 bg-neutral-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl text-neutral-200 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-cinematic font-bold tracking-wider uppercase text-amber-400">
              Memory Settings
            </span>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="py-4 space-y-4 text-xs">
            {/* Slideshow Duration */}
            <div>
              <label className="block text-neutral-400 font-medium mb-2">
                Slide Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setSelectedDuration(sec);
                      updateSettings({ slideshowDuration: sec });
                    }}
                    className={`py-1.5 rounded-lg border text-center font-mono font-semibold transition-colors cursor-pointer ${
                      selectedDuration === sec
                        ? 'bg-amber-400 text-neutral-950 border-amber-400'
                        : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Transition Effect */}
            <div>
              <label className="block text-neutral-400 font-medium mb-2">
                Transition Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['cinematic', 'fade', 'smooth', 'minimal'] as TransitionEffect[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTransition(t);
                      updateSettings({ transition: t });
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-center capitalize transition-colors cursor-pointer ${
                      selectedTransition === t
                        ? 'bg-amber-400 text-neutral-950 font-semibold border-amber-400'
                        : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Ken Burns Movement Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-neutral-300">Ken Burns Motion</span>
              <button
                onClick={() => {
                  setKenBurnsActive(!kenBurnsActive);
                  updateSettings({ kenBurns: !kenBurnsActive });
                }}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  kenBurnsActive ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    kenBurnsActive ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Captions Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Show Captions</span>
              <button
                onClick={() => updateSettings({ showCaptions: !settings.showCaptions })}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.showCaptions ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.showCaptions ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Metadata Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Show EXIF & Date</span>
              <button
                onClick={() => updateSettings({ showMetadata: !settings.showMetadata })}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.showMetadata ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.showMetadata ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
