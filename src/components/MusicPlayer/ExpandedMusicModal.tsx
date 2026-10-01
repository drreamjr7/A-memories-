import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  X,
  Music,
  ListMusic
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { AudioVisualizer } from './AudioVisualizer';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const ExpandedMusicModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    isShuffle,
    isLoop,
    isExpanded,
    playlist,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    setIsExpanded
  } = useAudio();

  const [showPlaylist, setShowPlaylist] = React.useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  if (!isExpanded || !currentTrack) return null;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    seek(pct);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Soundtrack Player"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Soft background glow based on cover */}
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(0,0,0,0) 70%)'
          }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
            <Music className="w-4 h-4 text-amber-500" />
            <span>Soundtrack</span>
            <span>·</span>
            <span>{currentTrack.synthPreset ? 'Procedural Ambient' : 'Audio Track'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-xl border transition-colors ${
                showPlaylist
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-neutral-800/70 text-neutral-400 border-neutral-700/60 hover:text-white'
              }`}
              title="Toggle Playlist"
              aria-label="Toggle Playlist"
            >
              <ListMusic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/70 text-neutral-400 hover:text-white border border-neutral-700/60 transition-colors"
              title="Close Player"
              aria-label="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col items-center justify-center z-10">
          {showPlaylist ? (
            <div className="w-full space-y-2">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                Album Soundtracks ({playlist.length})
              </h3>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {playlist.map((t, idx) => {
                  const isCurrent = t.id === currentTrack.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => playTrack(t)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between border transition-all ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-xs text-neutral-500 tabular-nums w-4">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate">{t.title}</p>
                          <p className="text-xs text-neutral-400 truncate">{t.artist}</p>
                        </div>
                      </div>
                      {isCurrent && isPlaying ? (
                        <AudioVisualizer barCount={8} height={16} className="shrink-0" />
                      ) : (
                        <span className="text-xs text-neutral-500 tabular-nums shrink-0">
                          {formatTime(t.duration || 180)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* Artwork Container */}
              <div className="relative group w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl mb-6 bg-neutral-950">
                {currentTrack.cover ? (
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-500">
                    <Music className="w-16 h-16 opacity-30" />
                  </div>
                )}
                {/* Visualizer overlay at bottom of cover */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                  <AudioVisualizer barCount={32} height={24} />
                </div>
              </div>

              {/* Title & Artist */}
              <div className="text-center px-4 max-w-full">
                <h2 className="text-xl sm:text-2xl font-cinematic font-semibold text-white truncate">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-1 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full mt-6">
            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              className="relative w-full h-2 bg-neutral-800 rounded-full cursor-pointer group"
              role="slider"
              aria-label="Track Progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 7px)` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mt-2 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Main Controls */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-4 w-full">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-colors rounded-lg ${
                isShuffle ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Shuffle"
              aria-label="Toggle Shuffle"
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={prevTrack}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Previous Track"
              aria-label="Previous Track"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Next Track"
              aria-label="Next Track"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={toggleLoop}
              className={`p-2 transition-colors rounded-lg ${
                isLoop ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Repeat"
              aria-label="Toggle Repeat"
            >
              <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full max-w-xs mt-6 px-4">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume Slider"
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
