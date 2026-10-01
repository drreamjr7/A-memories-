import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Album, Photo, AppSettings, ThemeType } from '../types';
import { DEMO_ALBUMS } from '../data/demoData';
import { getCustomAlbums, saveCustomAlbum, deleteCustomAlbum } from '../services/db';
import {
  getStoredFavorites,
  saveStoredFavorites,
  getStoredSettings,
  saveStoredSettings,
  DEFAULT_SETTINGS
} from '../services/storage';

interface AlbumContextType {
  albums: Album[];
  favorites: string[]; // photo ids
  allPhotos: Photo[];
  favoritePhotos: Photo[];
  settings: AppSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isFavorite: (photoId: string) => boolean;
  toggleFavorite: (photoId: string) => void;
  createAlbum: (album: Album) => Promise<void>;
  removeAlbum: (albumId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeType) => void;
  getAlbumById: (id: string) => Album | undefined;
  getPhotoById: (id: string) => Photo | undefined;
}

const AlbumContext = createContext<AlbumContextType | null>(null);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [albums, setAlbums] = useState<Album[]>(DEMO_ALBUMS);
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites());
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Load custom albums from IndexedDB on startup
  useEffect(() => {
    getCustomAlbums().then((customs) => {
      if (customs && customs.length > 0) {
        setAlbums([...DEMO_ALBUMS, ...customs]);
      }
    });
  }, []);

  const allPhotos = useMemo(() => {
    const list: Photo[] = [];
    albums.forEach((alb) => {
      alb.photos.forEach((ph) => {
        list.push(ph);
      });
    });
    return list;
  }, [albums]);

  const favoritePhotos = useMemo(() => {
    return allPhotos.filter((p) => favorites.includes(p.id));
  }, [allPhotos, favorites]);

  const isFavorite = useCallback(
    (photoId: string) => {
      return favorites.includes(photoId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback((photoId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(photoId);
      const next = exists ? prev.filter((id) => id !== photoId) : [...prev, photoId];
      saveStoredFavorites(next);
      return next;
    });
  }, []);

  const createAlbum = useCallback(async (newAlbum: Album) => {
    await saveCustomAlbum(newAlbum);
    setAlbums((prev) => [...prev, newAlbum]);
  }, []);

  const removeAlbum = useCallback(async (albumId: string) => {
    await deleteCustomAlbum(albumId);
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  const setTheme = useCallback(
    (theme: ThemeType) => {
      updateSettings({ theme });
    },
    [updateSettings]
  );

  const getAlbumById = useCallback(
    (id: string) => {
      return albums.find((a) => a.id === id);
    },
    [albums]
  );

  const getPhotoById = useCallback(
    (id: string) => {
      return allPhotos.find((p) => p.id === id);
    },
    [allPhotos]
  );

  return (
    <AlbumContext.Provider
      value={{
        albums,
        favorites,
        allPhotos,
        favoritePhotos,
        settings,
        searchQuery,
        setSearchQuery,
        isFavorite,
        toggleFavorite,
        createAlbum,
        removeAlbum,
        updateSettings,
        setTheme,
        getAlbumById,
        getPhotoById
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export function useAlbums() {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error('useAlbums must be used within an AlbumProvider');
  }
  return context;
}
