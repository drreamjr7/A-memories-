import React from 'react';
import { ArrowRight, Play, Sparkles, Image as ImageIcon, Music2, Layers } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { MemoryCarousel3D } from '../components/Carousel3D/MemoryCarousel3D';
import { DeveloperCard } from '../components/Developer/DeveloperCard';

interface HomePageProps {
  navigate: (to: string) => void;
  onOpenPhoto: (photoId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenPhoto }) => {
  const { albums, allPhotos } = useAlbums();
  const recentPhotos = allPhotos.slice(0, 6);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* 1. ADVANCED CINEMATIC 3D MEMORY CARD CAROUSEL (Hero Section) */}
      <section className="relative w-full">
        <MemoryCarousel3D
          navigate={navigate}
          onOpenPhoto={onOpenPhoto}
        />
      </section>

      {/* 2. CURATED BOTANICAL COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Botanical Curation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinematic font-bold text-white">
              Floral Collections in Motion
            </h2>
          </div>

          <button
            onClick={() => navigate('/albums')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mt-3 sm:mt-0 uppercase tracking-wider cursor-pointer"
          >
            <span>View All ({albums.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {albums.slice(0, 3).map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/album/${album.id}`)}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-500 shadow-xl cursor-pointer flex flex-col h-full"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                <img
                  src={album.cover}
                  alt={album.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px]">
                    {album.date}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {album.tracks.length > 0 && (
                      <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400">
                        <Music2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Action */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-neutral-950 text-xs font-semibold shadow-lg">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Open</span>
                  </span>
                </div>
              </div>

              {/* Album Metadata */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-cinematic font-bold text-white group-hover:text-amber-300 transition-colors uppercase">
                    {album.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {album.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                    {album.photos.length} memories
                  </span>
                  <span className="text-[11px] text-amber-500/80 uppercase tracking-wider">
                    {album.theme}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECENT HIGHLIGHTS PHOTO MOSAIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-500 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Petal Fragments</span>
            </div>
            <h2 className="text-2xl font-cinematic font-bold text-white">
              Visual Highlights
            </h2>
          </div>
          <button
            onClick={() => navigate('/timeline')}
            className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {recentPhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => onOpenPhoto(photo.id)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/[0.08] hover:border-amber-400/50 transition-all text-left cursor-pointer shadow-md"
              title={photo.title}
            >
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <p className="text-[11px] font-medium text-white truncate">{photo.title}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{photo.date}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. DEVELOPER ATTRIBUTION & ABOUT DRE.MJR */}
      <DeveloperCard />
    </div>
  );
};
