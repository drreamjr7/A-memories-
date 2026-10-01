import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { AlbumProvider, useAlbums } from './context/AlbumContext';
import { useHashRoute } from './hooks/useHashRoute';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { FloatingPlayer } from './components/MusicPlayer/FloatingPlayer';
import { ExpandedMusicModal } from './components/MusicPlayer/ExpandedMusicModal';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { SearchModal } from './components/SearchModal';
import { FirstVisitModal } from './components/FirstVisitModal';
import { AiHelpBotModal } from './components/AIBot/AiHelpBotModal';
import { Sparkles } from 'lucide-react';

import { HomePage } from './pages/HomePage';
import { AlbumsPage } from './pages/AlbumsPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { MemoryModePage } from './pages/MemoryModePage';
import { TimelinePage } from './pages/TimelinePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CreateAlbumPage } from './pages/CreateAlbumPage';
import { SettingsPage } from './pages/SettingsPage';
import { DeveloperProfilePage } from './pages/DeveloperProfilePage';
import { Photo } from './types';

const MainApp: React.FC = () => {
  const { route, navigate } = useHashRoute();
  const { getPhotoById, getAlbumById } = useAlbums();

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [activePhotoAlbumId, setActivePhotoAlbumId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIBotOpen, setIsAIBotOpen] = useState(false);

  const isMemoryMode = route.path === '/memory';

  const handleOpenPhoto = (photoOrId: Photo | string) => {
    if (typeof photoOrId === 'string') {
      const p = getPhotoById(photoOrId);
      if (p) {
        setActivePhoto(p);
        setActivePhotoAlbumId(p.albumId);
      }
    } else {
      setActivePhoto(photoOrId);
      setActivePhotoAlbumId(photoOrId.albumId);
    }
  };

  const currentAlbumForPhoto = activePhotoAlbumId
    ? getAlbumById(activePhotoAlbumId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-200 flex flex-col font-sans transition-colors">
      {/* First Visit Intro Modal */}
      <FirstVisitModal />

      {/* Top Navbar (Hidden in Memory Mode) */}
      {!isMemoryMode && (
        <Navbar
          currentPath={route.path}
          navigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAIBot={() => setIsAIBotOpen(true)}
        />
      )}

      {/* Router Viewport */}
      <main className="flex-1 w-full">
        {route.path === '/' && (
          <HomePage navigate={navigate} onOpenPhoto={handleOpenPhoto} />
        )}

        {route.path === '/albums' && (
          <AlbumsPage navigate={navigate} />
        )}

        {route.path === '/album' && route.paramId && (
          <AlbumDetailPage
            albumId={route.paramId}
            navigate={navigate}
            onOpenPhoto={handleOpenPhoto}
          />
        )}

        {route.path === '/memory' && (
          <MemoryModePage
            albumId={route.paramId}
            navigate={navigate}
          />
        )}

        {route.path === '/timeline' && (
          <TimelinePage
            onOpenPhoto={handleOpenPhoto}
            navigate={navigate}
          />
        )}

        {route.path === '/favorites' && (
          <FavoritesPage
            onOpenPhoto={handleOpenPhoto}
            navigate={navigate}
          />
        )}

        {route.path === '/create' && (
          <CreateAlbumPage navigate={navigate} />
        )}

        {route.path === '/settings' && (
          <SettingsPage />
        )}

        {route.path === '/developer' && (
          <DeveloperProfilePage navigate={navigate} />
        )}
      </main>

      {/* Floating AI Bot Assistant Trigger (Hidden in Memory Mode) */}
      {!isMemoryMode && (
        <button
          onClick={() => setIsAIBotOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Ask Flora AI Botanical Curator"
          aria-label="Ask Flora AI Botanical Curator"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline text-xs font-semibold tracking-wide">Flora AI</span>
        </button>
      )}

      {/* Persistent Floating Music Player (Hidden in Memory Mode) */}
      <FloatingPlayer hidden={isMemoryMode} />

      {/* Expanded Glassmorphic Music Player Panel */}
      <ExpandedMusicModal />

      {/* Fullscreen Photo Lightbox Viewer */}
      <PhotoViewerModal
        photo={activePhoto}
        album={currentAlbumForPhoto}
        onClose={() => setActivePhoto(null)}
        onSelectPhoto={setActivePhoto}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPhoto={handleOpenPhoto}
        onSelectAlbum={(id) => navigate(`/album/${id}`)}
      />

      {/* Flora AI Curator Modal */}
      <AiHelpBotModal
        isOpen={isAIBotOpen}
        onClose={() => setIsAIBotOpen(false)}
      />

      {/* Mobile Bottom Navigation (Hidden in Memory Mode) */}
      <MobileNav
        currentPath={route.path}
        navigate={navigate}
        hidden={isMemoryMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <AlbumProvider>
      <AudioProvider>
        <MainApp />
      </AudioProvider>
    </AlbumProvider>
  );
}
