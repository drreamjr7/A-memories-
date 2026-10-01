import React from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';

interface NavbarProps {
  currentPath: string;
  navigate: (to: string) => void;
  onOpenSearch?: () => void;
  onOpenAIBot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenSearch, onOpenAIBot }) => {
  const { settings } = useAlbums();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Albums', path: '/albums' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'About Developer', path: '/developer' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-neutral-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => navigate('/')}
          className="text-lg sm:text-xl font-cinematic font-bold tracking-[0.2em] text-white hover:text-amber-400 transition-colors uppercase select-none text-left cursor-pointer"
          aria-label="LUMORA Home"
        >
          LUMORA
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-neutral-400" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'hover:text-neutral-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {onOpenAIBot && (
            <button
              onClick={onOpenAIBot}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
              title="Ask Flora AI Botanical Curator"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ask Flora AI</span>
            </button>
          )}

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors border border-transparent hover:border-neutral-700/50 cursor-pointer"
              title="Search memories"
              aria-label="Search memories"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/15 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Album</span>
          </button>
        </div>
      </div>
    </header>
  );
};
