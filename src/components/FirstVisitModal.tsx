import React, { useState, useEffect } from 'react';
import { isIntroSeen, markIntroSeen } from '../services/storage';
import { Sparkles, ArrowRight } from 'lucide-react';
import { crimsonRose } from '../data/demoData';

export const FirstVisitModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isIntroSeen()) {
      setIsOpen(true);
    }
  }, []);

  const handleEnter = () => {
    markIntroSeen();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to LUMORA"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-2xl animate-in fade-in duration-700"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 p-8 sm:p-12 text-center shadow-2xl">
        {/* Ambient blurred photo background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xl scale-125 pointer-events-none"
          style={{ backgroundImage: `url(${crimsonRose})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-cinematic font-bold tracking-[0.25em] text-white uppercase mb-3">
            LUMORA
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-light tracking-wide mb-8">
            Your memories, in motion.
          </p>

          <p className="text-xs text-neutral-400 max-w-sm mb-8 leading-relaxed">
            An immersive digital gallery and musical album designed to preserve life’s quietest, most cinematic moments.
          </p>

          <button
            onClick={handleEnter}
            className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold tracking-wider uppercase text-xs transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
          >
            <span>Enter Lumora</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
