import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize2, Music } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { AudioVisualizer } from './AudioVisualizer';

interface FloatingPlayerProps {
  hidden?: boolean;
}

export const FloatingPlayer: React.FC<FloatingPlayerProps> = ({ hidden = false }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    togglePlay,
    nextTrack,
    prevTrack,
    setIsExpanded
  } = useAudio();

  if (hidden || !currentTrack) return null;

  return (
    <aside
      aria-label="Floating Soundtrack Player"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900/85 backdrop-blur-xl border border-neutral-700/60 shadow-2xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 text-neutral-200">
        {/* Subtle top progress hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-800">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {/* Left: Thumbnail & Track info (clickable to expand) */}
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 min-w-0 text-left group flex-1 cursor-pointer"
          title="Open expanded music player"
          aria-label={`Current track: ${currentTrack.title} by ${currentTrack.artist}. Click to open player.`}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/50">
            {currentTrack.cover ? (
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-500">
                <Music className="w-5 h-5" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <AudioVisualizer barCount={6} height={14} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold truncate text-white group-hover:text-amber-300 transition-colors">
              {currentTrack.title}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </button>

        {/* Center: Visualizer (desktop only) */}
        <div className="hidden sm:flex items-center px-2">
          <AudioVisualizer barCount={16} height={18} />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={prevTrack}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg"
            title="Previous track"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg"
            title="Next track"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-lg hidden sm:block ml-1"
            title="Expand player"
            aria-label="Expand player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
