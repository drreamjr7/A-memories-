import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Volume2,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Check,
  Info,
  Github,
  Instagram,
  ExternalLink,
  Code2
} from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { useAudio } from '../context/AudioContext';
import { ThemeType, TransitionEffect } from '../types';
import { resetAllLocalData } from '../services/storage';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, setTheme } = useAlbums();
  const { volume, setVolume } = useAudio();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const themes: { id: ThemeType; name: string; desc: string; color: string }[] = [
    {
      id: 'cinematic',
      name: 'Cinematic',
      desc: 'Deep warm amber tones, 35mm film character',
      color: 'bg-amber-500'
    },
    {
      id: 'dreamy',
      name: 'Dreamy',
      desc: 'Soft lavender violet hues, ethereal glow',
      color: 'bg-purple-400'
    },
    {
      id: 'midnight',
      name: 'Midnight',
      desc: 'Cyan and deep sapphire, poetic rainy city mood',
      color: 'bg-sky-400'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      desc: 'Monochrome stark black and pristine white accents',
      color: 'bg-neutral-200'
    },
    {
      id: 'retro',
      name: 'Retro',
      desc: 'Warm Kodachrome rust and terracotta nostalgia',
      color: 'bg-orange-500'
    }
  ];

  const handleReset = () => {
    resetAllLocalData();
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-28">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Preferences & Playback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-cinematic font-bold text-white">
          Settings
        </h1>
        <p className="text-sm text-neutral-400 mt-2">
          Fine-tune the visual atmosphere, transitions, soundscape levels, and device storage.
        </p>
      </div>

      <div className="space-y-8">
        {/* THEMES SECTION */}
        <section className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Visual Theme</span>
            </h2>
            <span className="text-xs text-neutral-400 font-mono capitalize">
              Active: {settings.theme}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {themes.map((t) => {
              const isSelected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-400 shadow-lg shadow-amber-400/10'
                      : 'bg-neutral-950/60 border-neutral-800 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* MEMORY MODE & SLIDESHOW OPTIONS */}
        <section className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Memory Mode Slideshow</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Duration */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Slideshow Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateSettings({ slideshowDuration: sec })}
                    className={`py-2 rounded-xl text-center font-mono text-xs font-semibold border transition-colors cursor-pointer ${
                      settings.slideshowDuration === sec
                        ? 'bg-amber-400 text-neutral-950 border-amber-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Transition */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Default Transition
              </label>
              <select
                value={settings.transition}
                onChange={(e) => updateSettings({ transition: e.target.value as TransitionEffect })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white capitalize focus:outline-none"
              >
                <option value="cinematic">Cinematic</option>
                <option value="fade">Fade</option>
                <option value="smooth">Smooth</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            {/* Ken Burns Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Ken Burns Effect</p>
                <p className="text-xs text-neutral-400">Slow panoramic zoom and movement on photos in Memory Mode.</p>
              </div>
              <button
                onClick={() => updateSettings({ kenBurns: !settings.kenBurns })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.kenBurns ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.kenBurns ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Captions Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Captions</p>
                <p className="text-xs text-neutral-400">Display memory reflections and titles during slideshows.</p>
              </div>
              <button
                onClick={() => updateSettings({ showCaptions: !settings.showCaptions })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.showCaptions ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.showCaptions ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* EXIF Metadata Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Photo Metadata</p>
                <p className="text-xs text-neutral-400">Display dates, locations, and camera details.</p>
              </div>
              <button
                onClick={() => updateSettings({ showMetadata: !settings.showMetadata })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.showMetadata ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.showMetadata ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Reduced Motion</p>
                <p className="text-xs text-neutral-400">Disable heavy pan/zoom animations for accessibility.</p>
              </div>
              <button
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.reducedMotion ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.reducedMotion ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* AUDIO & MUSIC SETTINGS */}
        <section className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Audio & Soundscapes</span>
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span>Master Volume</span>
                <span className="font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-white">Music Autoplay</p>
                <p className="text-xs text-neutral-400">Automatically play album soundscapes when opening Memory Mode.</p>
              </div>
              <button
                onClick={() => updateSettings({ musicAutoplay: !settings.musicAutoplay })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.musicAutoplay ? 'bg-amber-400' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    settings.musicAutoplay ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* RESET & DATA STORAGE */}
        <section className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Storage & Privacy</span>
          </h2>

          <p className="text-xs text-neutral-400 leading-relaxed">
            All custom albums, uploaded photographs, custom music, and favorites are stored purely in your browser's private local storage. No data is synchronized or sent to external servers.
          </p>

          <div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Local Data & Favorites</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
                <p className="text-xs text-red-200">
                  Are you sure? This will remove all local favorites and restore default settings.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes, Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {resetSuccess && (
              <p className="text-xs text-emerald-400 mt-2">
                Local storage reset. Reloading app...
              </p>
            )}
          </div>
        </section>

        {/* ABOUT DEVELOPER — DRE.MJR */}
        <section className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>About Developer</span>
            </h2>
            <span className="text-xs font-mono text-neutral-400">Creator & Architect</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-950/70 border border-white/[0.06]">
            <div>
              <h3 className="text-lg font-cinematic font-bold text-white tracking-wider">
                Dre Mjr
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Creative developer and visual storyteller specializing in fluid spatial interfaces, fine-art digital albums, and generative soundscapes.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#/developer"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-amber-400/10"
              >
                View Full Profile
              </a>
              <a
                href="https://instagram.com/drea.mjr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 hover:from-pink-500/30 hover:via-rose-500/30 hover:to-amber-500/30 text-pink-300 hover:text-white border border-pink-500/30 transition-all text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@drea.mjr</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
