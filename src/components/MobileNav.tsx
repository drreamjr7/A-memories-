import React from 'react';
import { Home, Layers, Calendar, Heart, Settings, User } from 'lucide-react';

interface MobileNavProps {
  currentPath: string;
  navigate: (to: string) => void;
  hidden?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, navigate, hidden }) => {
  if (hidden) return null;

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Albums', path: '/albums', icon: Layers },
    { label: 'Timeline', path: '/timeline', icon: Calendar },
    { label: 'Favorites', path: '/favorites', icon: Heart },
    { label: 'Developer', path: '/developer', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
