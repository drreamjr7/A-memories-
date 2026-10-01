import React, { useState } from 'react';
import {
  Play,
  Maximize,
  Share2,
  Heart,
  Settings,
  ArrowLeft,
  Music,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Info
} from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { useAudio } from '../context/AudioContext';
import { Photo } from '../types';
import { ShareModal } from '../components/ShareModal';

interface AlbumDetailPageProps {
  albumId: string;
  navigate: (to: string) => void;
  onOpenPhoto: (photo: Photo) => void;
}

export const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({
  albumId,
  navigate,
  onOpenPhoto
}) => {
  const { getAlbumById, isFavorite, toggleFavorite } = useAlbums();
  const { playTrack } = useAudio();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const album = getAlbumById(albumId);

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-cinematic text-white">Album Not Found</h2>
        <p className="text-neutral-400 mt-2 text-sm">The album you're looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/albums')}
          className="mt-6 px-6 py-2.5 rounded-full bg-amber-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
        >
          Return to Albums
        </button>
      </div>
    );
  }

  const handlePlayMemories = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0]);
    }
    navigate(`/memory/${album.id}`);
  };

  const handleFullscreenView = () => {
    if (album.photos.length > 0) {
      onOpenPhoto(album.photos[0]);
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      {/* CINEMATIC ALBUM HERO HEADER */}
      <section className="relative h-[65vh] min-h-[440px] w-full flex items-end overflow-hidden pb-12 sm:pb-16">
        {/* Cover Photo Backdrop with Slow Zoom & Blur Scrim */}
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns-2 scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${album.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-black/30 pointer-events-none" />

        {/* Top Back Navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate('/albums')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/90 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Albums</span>
          </button>
        </div>

        {/* Album Header Text & CTAs */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono text-amber-400 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {album.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                {album.photos.length} memories
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5" />
                {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinematic font-bold text-white tracking-wide uppercase leading-tight drop-shadow-xl">
              {album.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light mt-3 leading-relaxed drop-shadow-md">
              {album.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={handlePlayMemories}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Memories</span>
            </button>

            <button
              onClick={handleFullscreenView}
              className="p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/10 backdrop-blur-md transition-colors"
              title="Fullscreen Lightbox"
              aria-label="Fullscreen Lightbox"
            >
              <Maximize className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/10 backdrop-blur-md transition-colors"
              title="Share Album"
              aria-label="Share Album"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/10 backdrop-blur-md transition-colors"
              title="Playback Settings"
              aria-label="Playback Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BALANCED INTELLIGENT PHOTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
          <h2 className="text-lg font-cinematic font-semibold text-white tracking-wider">
            All Photos ({album.photos.length})
          </h2>
          <span className="text-xs text-neutral-500 font-mono">
            Click any image to view in high definition
          </span>
        </div>

        {album.photos.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-500" />
            <p className="text-sm">No photos added to this album yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {album.photos.map((photo, index) => {
              const isFav = isFavorite(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => onOpenPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top right quick favorite button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(photo.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 opacity-100'
                          : 'bg-black/50 text-white/80 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label="Toggle favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Bottom Metadata overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                      <p className="text-sm font-semibold text-white drop-shadow truncate">
                        {photo.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
                        {photo.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            {photo.location}
                          </span>
                        )}
                        <span className="font-mono text-neutral-400">{photo.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Share Modal */}
      <ShareModal
        album={album}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
