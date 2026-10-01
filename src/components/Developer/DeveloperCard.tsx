import React from 'react';
import { Instagram, Sparkles, ExternalLink, Code2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeveloperCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>Crafted by</span>
        <a href="#/developer" className="font-semibold text-white hover:text-amber-400 transition-colors">
          Dre Mjr
        </a>
        <span>·</span>
        <a
          href="https://instagram.com/drea.mjr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>@drea.mjr</span>
        </a>
      </div>
    );
  }

  return (
    <footer className="w-full border-t border-white/[0.08] bg-neutral-950/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Vision */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-base font-cinematic font-bold tracking-widest text-white uppercase">
              LUMORA
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-amber-400 font-mono tracking-wider uppercase">
              Memories in Motion
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
            A cinematic space for photographic storytelling, ambient soundscapes, and fluid 3D spatial exploration.
          </p>
        </div>

        {/* Right: Developer Attribution & Socials */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.07] backdrop-blur-md">
          <a
            href="#/developer"
            className="flex items-center gap-3 group text-left cursor-pointer"
            title="View Developer Profile"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
                  Developer & Designer
                </span>
              </div>
              <h4 className="text-sm font-cinematic font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors">
                Dre Mjr
              </h4>
            </div>
          </a>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <a
              href="#/developer"
              className="px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 hover:text-white border border-white/[0.08] transition-all text-xs font-semibold cursor-pointer"
            >
              Profile
            </a>

            {/* Instagram Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://instagram.com/drea.mjr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 hover:from-pink-500/25 hover:via-rose-500/25 hover:to-amber-500/25 text-pink-300 hover:text-white border border-pink-500/30 transition-all text-xs font-semibold shadow-md group cursor-pointer"
              title="Follow @drea.mjr on Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>@drea.mjr</span>
              <ExternalLink className="w-3 h-3 text-pink-400/70" />
            </motion.a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
        <p>© 2026 LUMORA. All memories and media stored privately in client storage.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> by <a href="#/developer" className="hover:text-neutral-300 underline">Dre Mjr</a>
        </p>
      </div>
    </footer>
  );
};
