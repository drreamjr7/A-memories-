import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Image as ImageIcon, MapPin, Calendar } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { Photo, Album } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectAlbum: (albumId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  onSelectAlbum
}) => {
  const [query, setQuery] = useState('');
  const { albums, allPhotos } = useAlbums();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredAlbums = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.date.toLowerCase().includes(q)
    );
  }, [albums, query]);

  const filteredPhotos = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allPhotos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        p.date.toLowerCase().includes(q)
    );
  }, [allPhotos, query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Memories"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-800 pb-4">
          <Search className="w-5 h-5 text-amber-500 absolute left-2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search albums, photos, locations, dates..."
            className="w-full bg-transparent pl-10 pr-10 text-white placeholder-neutral-500 focus:outline-none text-base sm:text-lg"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-lg text-xs tracking-wider uppercase"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-6">
          {!query.trim() ? (
            <div className="text-center py-12 text-neutral-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm">Type a keyword, place, or date to search through your memories.</p>
            </div>
          ) : filteredAlbums.length === 0 && filteredPhotos.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-base font-medium">No memories found.</p>
              <p className="text-sm text-neutral-500 mt-1">Try another search term.</p>
            </div>
          ) : (
            <>
              {filteredAlbums.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Albums ({filteredAlbums.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredAlbums.map((album) => (
                      <button
                        key={album.id}
                        onClick={() => {
                          onSelectAlbum(album.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 transition-colors text-left group"
                      >
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white group-hover:text-amber-300 truncate">
                            {album.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {album.photos.length} memories · {album.date}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredPhotos.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Photos ({filteredPhotos.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => {
                          onSelectPhoto(photo);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 transition-colors text-left group"
                      >
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white group-hover:text-amber-300 truncate">
                            {photo.title}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                            {photo.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                {photo.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-neutral-500 shrink-0" />
                              {photo.date}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
