import React from 'react';
import { Heart, Play, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { useAudio } from '../context/AudioContext';
import { Photo } from '../types';

interface FavoritesPageProps {
  onOpenPhoto: (photo: Photo) => void;
  navigate: (to: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onOpenPhoto, navigate }) => {
  const { favoritePhotos, toggleFavorite } = useAlbums();
  const { playTrack } = useAudio();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-400 font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Cherished Highlights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-cinematic font-bold text-white">
            Favorite Memories
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Your personal curation of moments that resonated most deeply.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono">
            {favoritePhotos.length} {favoritePhotos.length === 1 ? 'favorite' : 'favorites'}
          </span>
        </div>
      </div>

      {favoritePhotos.length === 0 ? (
        <div className="text-center py-24 bg-neutral-900/30 rounded-3xl border border-white/[0.05] p-6 max-w-lg mx-auto">
          <Heart className="w-12 h-12 mx-auto text-neutral-600 mb-4 stroke-1" />
          <h3 className="text-lg font-cinematic text-neutral-300">No favorite memories yet.</h3>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            Click the heart icon on any photo in your albums or the photo viewer to save it to your personal highlights.
          </p>
          <button
            onClick={() => navigate('/albums')}
            className="px-6 py-2.5 rounded-full bg-amber-400 text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer"
          >
            Explore Albums
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoritePhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onOpenPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/[0.08] hover:border-red-500/40 transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end" />

                {/* Unfavorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 backdrop-blur-md hover:scale-110 active:scale-95 transition-all"
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                >
                  <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                </button>

                {/* Bottom title */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                  <p className="text-[10px] text-neutral-300 font-mono">{photo.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
