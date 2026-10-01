import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ChevronDown,
  Volume2,
  VolumeX,
  Music,
  Share2,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Play,
  Pause,
  Copy,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Grid,
  Film,
  Repeat,
  Bookmark,
  UserPlus,
  Link as LinkIcon,
  Plus,
  Menu,
  AtSign
} from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';

interface DeveloperProfilePageProps {
  navigate: (to: string) => void;
}

export const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({ navigate }) => {
  const { albums } = useAlbums();

  // Video state (attached local MP4)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Audio state (attached local MP3)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'reposts' | 'tagged' | 'gallery'>('posts');
  const [floatingNotes, setFloatingNotes] = useState<{ id: number; char: string; x: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize and sync background video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => setVideoLoaded(true))
        .catch(() => {
          // Autoplay rules may prevent unmuted autoplay; stays muted and ready
        });
    }
  }, []);

  // Toggle video mute/unmute
  const handleToggleVideoMute = () => {
    if (videoRef.current) {
      const nextMute = !isVideoMuted;
      videoRef.current.muted = nextMute;
      setIsVideoMuted(nextMute);
    }
  };

  // Toggle developer audio (Jeremih - oui Slowed Down / local developer_audio.mp3)
  const handleToggleAudio = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsAudioPlaying(true);
          // Spawn animated floating notes
          const noteChars = ['♪', '♫', '♩', '♬', '𝄞'];
          const newNotes = Array.from({ length: 4 }).map((_, i) => ({
            id: Date.now() + i,
            char: noteChars[Math.floor(Math.random() * noteChars.length)],
            x: (Math.random() - 0.5) * 50
          }));
          setFloatingNotes((prev) => [...prev, ...newNotes]);
          setTimeout(() => {
            setFloatingNotes((prev) => prev.filter((n) => !newNotes.some((nn) => nn.id === n.id)));
          }, 1800);
        })
        .catch((err) => {
          console.warn('Audio play prevented:', err);
        });
    }
  };

  // Copy username
  const handleCopyUsername = () => {
    navigator.clipboard.writeText('drea.mjr');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#07090e] overflow-y-auto'
          : 'min-h-[calc(100vh-4rem)] flex flex-col justify-start overflow-hidden'
      }`}
    >
      {/* LOCAL AUDIO ASSET (/developer_audio.mp3) */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}developer_audio.mp3`}
        loop
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
            setAudioDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => setIsAudioPlaying(false)}
      />

      {/* 1. FULL-SCREEN BACKGROUND VIDEO LAYER (Attached MP4: /developer_bg.mp4) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}developer_bg.mp4`}
          autoPlay
          loop
          muted={isVideoMuted}
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000"
          onLoadedData={() => setVideoLoaded(true)}
        />

        {/* Fallback ambient animated aura if video is buffering or awaiting playback */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-950/30 via-neutral-950/40 to-neutral-900/40" />

        {/* Dark Readable Scrim Overlay ensuring WCAG AA legibility across all video frames */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85 backdrop-blur-[2px]" />
      </div>

      {/* 2. SUBTLE CORNER VIEW-FINDER ANIMATIONS */}
      <div className="pointer-events-none absolute inset-3 sm:inset-6 z-20">
        <motion.div
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-7 h-7 sm:w-10 sm:h-10 border-t-2 border-l-2 border-rose-400/50 rounded-tl-lg shadow-[0_0_10px_rgba(244,114,182,0.2)]"
        />
        <motion.div
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-0 right-0 w-7 h-7 sm:w-10 sm:h-10 border-t-2 border-r-2 border-rose-400/50 rounded-tr-lg shadow-[0_0_10px_rgba(244,114,182,0.2)]"
        />
        <motion.div
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-0 w-7 h-7 sm:w-10 sm:h-10 border-b-2 border-l-2 border-rose-400/50 rounded-bl-lg shadow-[0_0_10px_rgba(244,114,182,0.2)]"
        />
        <motion.div
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 right-0 w-7 h-7 sm:w-10 sm:h-10 border-b-2 border-r-2 border-rose-400/50 rounded-br-lg shadow-[0_0_10px_rgba(244,114,182,0.2)]"
        />
      </div>

      {/* 3. ANIMATED CORNER VIDEO MUTE/UNMUTE BUTTON (Fixed in Corner) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggleVideoMute}
        className={`fixed top-20 right-4 sm:right-8 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-xl transition-all cursor-pointer shadow-2xl ${
          isVideoMuted
            ? 'bg-neutral-900/80 border-white/15 text-neutral-300 hover:text-white hover:border-white/30'
            : 'bg-rose-500/25 border-rose-400/60 text-rose-200 shadow-rose-500/20'
        }`}
        title={isVideoMuted ? 'Click to Unmute Background Video' : 'Click to Mute Background Video'}
        aria-label={isVideoMuted ? 'Unmute Video' : 'Mute Video'}
      >
        <div className="relative">
          {isVideoMuted ? (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />
          )}
          {/* Subtle pulse ring around mute button */}
          {!isVideoMuted && (
            <span className="absolute -inset-1 rounded-full border border-rose-400/50 animate-ping opacity-75" />
          )}
        </div>
        <span className="text-xs font-mono tracking-tight font-medium hidden sm:inline">
          {isVideoMuted ? 'Muted (Video)' : 'Sound On'}
        </span>
      </motion.button>

      {/* TOP BAR / NAVIGATION */}
      <div className="relative z-30 max-w-lg mx-auto w-full px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
            title="Toggle Fullscreen Profile"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 4. MAIN SOCIAL-MEDIA PROFILE CARD (70% Transparent Visual Treatment inspired by Screenshot) */}
      <main className="relative z-20 max-w-md mx-auto w-full px-3 sm:px-4 py-3 pb-28">
        <div className="rounded-[32px] bg-black/70 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all text-white">
          {/* TOP INSTAGRAM-STYLE APP HEADER */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-white/[0.06]">
            <button
              onClick={() => navigate('/')}
              className="text-neutral-300 hover:text-white p-1 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Username Lock Title: drea.mjr */}
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleCopyUsername}>
              <Lock className="w-3.5 h-3.5 text-neutral-300" />
              <span className="font-semibold text-sm tracking-tight text-white">drea.mjr</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/drea.mjr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white transition-colors"
                title="Open in Instagram"
              >
                <AtSign className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyUsername}
                className="text-neutral-300 hover:text-white transition-colors"
                title="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PROFILE HERO COMPOSITION */}
          <div className="px-5 pt-4 pb-4">
            {/* Top Row: PFP (Left) + Stats Row (Right) */}
            <div className="flex items-center justify-between gap-4">
              {/* Profile Picture with Remix Pill & Plus Badge */}
              <div className="relative group shrink-0">
                {/* Remix Audio Tag Pill above PFP (from screenshot: [remix] Kotori Koiwai) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-[10px] font-semibold text-white flex items-center gap-1 shadow-md shadow-rose-900/40 whitespace-nowrap">
                  <div className="flex items-end gap-0.5 h-2">
                    <span className="w-0.5 bg-white rounded-full h-full animate-pulse" />
                    <span className="w-0.5 bg-white rounded-full h-1" />
                    <span className="w-0.5 bg-white rounded-full h-1.5" />
                  </div>
                  <span>Kotori Koiwai</span>
                </div>

                {/* Circular PFP Container with Dark Aesthetic Horned Art Silhouette */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-[2px] bg-gradient-to-tr from-neutral-700 via-neutral-600 to-neutral-400 shadow-xl overflow-hidden relative">
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center overflow-hidden relative">
                    {/* SVG Monochrome High-Contrast Horned Avatar inspired by screenshot */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full object-cover filter contrast-125"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="50" r="50" fill="#090a0f" />
                      {/* Stylized Horns / Dark Gothic Anime Silhouette */}
                      <path
                        d="M25 75 C30 50, 35 30, 20 15 C35 25, 45 40, 48 55 Z"
                        fill="#e5e5e5"
                        opacity="0.9"
                      />
                      <path
                        d="M75 75 C70 50, 65 30, 80 15 C65 25, 55 40, 52 55 Z"
                        fill="#e5e5e5"
                        opacity="0.9"
                      />
                      <circle cx="50" cy="55" r="22" fill="#171717" stroke="#ffffff" strokeWidth="1.5" />
                      {/* Stylized glowing eyes */}
                      <circle cx="43" cy="53" r="2.5" fill="#f43f5e" />
                      <circle cx="57" cy="53" r="2.5" fill="#f43f5e" />
                      {/* Body mask */}
                      <path d="M35 78 C35 68, 65 68, 65 78 C65 92, 35 92, 35 78 Z" fill="#262626" />
                      <path
                        d="M15 95 C25 80, 75 80, 85 95 Z"
                        fill="#121212"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                    </svg>

                    {/* Dark gradient film vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />
                  </div>
                </div>

                {/* Plus Badge on bottom-right of PFP */}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-neutral-950 flex items-center justify-center border-2 border-black shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Stats Columns (posts, followers, following) */}
              <div className="flex-1 flex items-center justify-around text-center pl-2">
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white tabular-nums">0</span>
                  <span className="text-xs text-neutral-400 font-normal">posts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white tabular-nums">29</span>
                  <span className="text-xs text-neutral-400 font-normal">followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white tabular-nums">235</span>
                  <span className="text-xs text-neutral-400 font-normal">following</span>
                </div>
              </div>
            </div>

            {/* NAME & BIO SECTION */}
            <div className="mt-3.5 space-y-1.5">
              {/* Name & Pronouns */}
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">DreamJr</h1>
                <span className="text-xs text-neutral-400 font-medium">he/his</span>
              </div>

              {/* Bio line: Alt */}
              <p className="text-xs text-neutral-200">Alt</p>

              {/* Bio Link: guns.lol/dre.mjr */}
              <div className="flex items-center gap-1 text-xs">
                <LinkIcon className="w-3 h-3 text-sky-400 shrink-0" />
                <a
                  href="https://guns.lol/dre.mjr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                >
                  guns.lol/dre.mjr
                </a>
              </div>

              {/* INTERACTIVE MUSIC-NOTE TRACK PILL (oui (Slowed Down) Jeremih) */}
              <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleAudio}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer shadow-sm ${
                    isAudioPlaying
                      ? 'bg-rose-500/25 border-rose-400/60 text-rose-200'
                      : 'bg-neutral-900/90 border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                  title={isAudioPlaying ? 'Click to Pause oui (Slowed Down)' : 'Click to Play oui (Slowed Down)'}
                >
                  {/* Animated Music Note / Play Icon */}
                  <div className="relative flex items-center justify-center">
                    {isAudioPlaying ? (
                      <Pause className="w-3 h-3 text-rose-400 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 text-neutral-400 fill-current" />
                    )}
                  </div>

                  <span className="tracking-tight">oui (Slowed Down)</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-neutral-400">Jeremih</span>

                  {/* Dancing wave bars if playing */}
                  {isAudioPlaying && (
                    <div className="flex items-end gap-0.5 h-2.5 ml-1">
                      <span className="w-0.5 bg-rose-400 rounded-full h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                      <span className="w-0.5 bg-rose-400 rounded-full h-1.5 animate-[pulse_0.9s_ease-in-out_infinite]" />
                      <span className="w-0.5 bg-rose-400 rounded-full h-2 animate-[pulse_0.75s_ease-in-out_infinite]" />
                    </div>
                  )}
                </motion.button>

                {/* + Add Button Pill */}
                <button
                  onClick={handleToggleAudio}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAudioPlaying ? 'Playing' : 'Add'}</span>
                </button>
              </div>

              {/* Floating Spawning Notes Animation */}
              <div className="relative h-0">
                <AnimatePresence>
                  {floatingNotes.map((note) => (
                    <motion.span
                      key={note.id}
                      initial={{ opacity: 1, y: 0, x: note.x, scale: 0.9 }}
                      animate={{ opacity: 0, y: -45, x: note.x * 1.5, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="pointer-events-none absolute -top-8 left-8 text-rose-300 font-cinematic font-bold text-sm z-50 select-none"
                    >
                      {note.char}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ACTION BUTTONS (Edit profile, Share profile, Add User) */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://instagram.com/drea.mjr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-center text-white transition-colors cursor-pointer"
              >
                Edit profile
              </a>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: 'DreamJr (@drea.mjr) Profile',
                        url: 'https://instagram.com/drea.mjr'
                      })
                      .catch(() => {});
                  } else {
                    handleCopyUsername();
                  }
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-center text-white transition-colors cursor-pointer"
              >
                {isCopied ? 'Link Copied!' : 'Share profile'}
              </button>

              <a
                href="https://instagram.com/drea.mjr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Add on Instagram"
              >
                <UserPlus className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SOCIAL MEDIA PROFILE TABS (Grid, Reels, Reposts, Tagged) */}
          <div className="border-t border-white/[0.08] flex items-center justify-around">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 flex justify-center items-center transition-colors relative cursor-pointer ${
                activeTab === 'posts' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Posts"
            >
              <Grid className="w-5 h-5" />
              {activeTab === 'posts' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex-1 py-3 flex justify-center items-center transition-colors relative cursor-pointer ${
                activeTab === 'reels' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Reels"
            >
              <Film className="w-5 h-5" />
              {activeTab === 'reels' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reposts')}
              className={`flex-1 py-3 flex justify-center items-center transition-colors relative cursor-pointer ${
                activeTab === 'reposts' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Reposts"
            >
              <Repeat className="w-5 h-5" />
              {activeTab === 'reposts' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex-1 py-3 flex justify-center items-center transition-colors relative cursor-pointer ${
                activeTab === 'tagged' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Tagged"
            >
              <Bookmark className="w-5 h-5" />
              {activeTab === 'tagged' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                />
              )}
            </button>
          </div>

          {/* TAB CONTENT: Empty State Illustration from Instagram Screenshot */}
          <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center max-w-xs space-y-4"
              >
                {/* Clean SVG Vector Illustration matching the screenshot illustration */}
                <div className="w-36 h-36 relative flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
                    {/* Device frame */}
                    <rect x="25" y="30" width="110" height="100" rx="14" stroke="#ffffff" strokeWidth="2.5" fill="#121212" />
                    {/* Top camera slot */}
                    <circle cx="80" cy="42" r="3" fill="#ffffff" />
                    {/* Pink Curtains / Stage */}
                    <path d="M35 52 L60 52 L50 90 L35 75 Z" fill="#d946ef" opacity="0.9" />
                    <path d="M125 52 L100 52 L110 90 L125 75 Z" fill="#d946ef" opacity="0.9" />
                    {/* Orange Cloud / Sun shape */}
                    <circle cx="85" cy="80" r="22" fill="#f97316" />
                    {/* Paper Airplane */}
                    <path d="M72 65 L95 72 L78 82 L72 65 Z" fill="#ffffff" stroke="#121212" strokeWidth="1" />
                    <path d="M78 82 L82 72 L86 80 Z" fill="#cbd5e1" />
                    {/* Bottom device button (magenta circle from screenshot) */}
                    <circle cx="80" cy="116" r="8" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Create your first post
                  </h3>
                  <p className="text-xs text-neutral-400">Share your point of view.</p>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full justify-center">
                  <a
                    href="https://instagram.com/drea.mjr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-blue-600/30"
                  >
                    Create
                  </a>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View Lumora Works
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full space-y-3 text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Curated Lumora Albums
                  </span>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Back to Bio
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer shadow-md"
                    >
                      <img
                        src={album.cover}
                        alt={album.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
                        {album.title}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(activeTab === 'reels' || activeTab === 'reposts' || activeTab === 'tagged') && (
              <div className="py-8 text-neutral-400 text-xs space-y-2">
                <Sparkles className="w-5 h-5 mx-auto text-neutral-500" />
                <p className="capitalize">No {activeTab} yet</p>
                <p className="text-[11px] text-neutral-500">
                  Follow <a href="https://instagram.com/drea.mjr" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">@drea.mjr</a> on Instagram for stories & motion reels.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};
