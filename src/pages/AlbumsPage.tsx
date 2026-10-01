import React, { useState } from 'react';
import { Plus, Play, Music, Image as ImageIcon, Heart, Sparkles, Filter } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { useAudio } from '../context/AudioContext';

interface AlbumsPageProps {
  navigate: (to: string) => void;
}

export const AlbumsPage: React.FC<AlbumsPageProps> = ({ navigate }) => {
  const { albums } = useAlbums();
  const { playTrack } = useAudio();
  const [filterTheme, setFilterTheme] = useState<string>('all');

  const filtered = filterTheme === 'all'
    ? albums
    : albums.filter((a) => a.theme === filterTheme);

  const handlePlayAlbumMemory = (e: React.MouseEvent, albumId: string) => {
    e.stopPropagation();
    const alb = albums.find((a) => a.id === albumId);
    if (alb && alb.tracks.length > 0) {
      playTrack(alb.tracks[0]);
    }
    navigate(`/memory/${albumId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-cinematic font-bold text-white">
            Memory Albums
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl">
            Cinematic journals of seasons, places, and journeys. Each collection comes alive with its own ambient soundtrack.
          </p>
        </div>

        {/* Filter & Create Button */}
        <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-0">
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setFilterTheme('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTheme === 'all'
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTheme('cinematic')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTheme === 'cinematic'
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cinematic
            </button>
            <button
              onClick={() => setFilterTheme('midnight')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTheme === 'midnight'
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Midnight
            </button>
            <button
              onClick={() => setFilterTheme('dreamy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTheme === 'dreamy'
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Dreamy
            </button>
          </div>

          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Album</span>
          </button>
        </div>
      </div>

      {/* Grid of Albums */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-white/[0.05]">
          <h3 className="text-lg font-cinematic text-neutral-300">Your story starts here.</h3>
          <p className="text-xs text-neutral-500 mt-2 mb-6">Create your first cinematic memory album to get started.</p>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-2.5 rounded-full bg-amber-400 text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-amber-300 transition-all cursor-pointer"
          >
            Create Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/album/${album.id}`)}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                  src={album.cover}
                  alt={album.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 font-mono">
                    {album.date}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {album.tracks.length > 0 && (
                      <span className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400">
                        <Music className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Play Memories Action button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => handlePlayAlbumMemory(e, album.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold shadow-xl transition-colors cursor-pointer"
                    title="Play Memory Mode"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Memories</span>
                  </button>
                </div>
              </div>

              {/* Album Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-cinematic font-bold text-white group-hover:text-amber-300 transition-colors">
                    {album.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                </div>

                {/* Footer Count stats */}
                <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.06] text-xs text-neutral-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {album.photos.length} photos
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Music className="w-3.5 h-3.5" />
                      {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
                    </span>
                  </div>

                  <span className="text-[11px] text-amber-500/80 uppercase tracking-wider">
                    {album.theme}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
