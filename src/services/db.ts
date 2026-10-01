import { Album, Photo, Track } from '../types';

const DB_NAME = 'lumora_media_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('albums')) {
        db.createObjectStore('albums', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('photos')) {
        const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
        photoStore.createIndex('albumId', 'albumId', { unique: false });
      }
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function saveCustomAlbum(album: Album): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(['albums'], 'readwrite');
    const store = tx.objectStore('albums');
    await new Promise<void>((resolve, reject) => {
      const req = store.put(album);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save album to IndexedDB:', err);
  }
}

export async function getCustomAlbums(): Promise<Album[]> {
  try {
    const db = await getDB();
    const tx = db.transaction(['albums'], 'readonly');
    const store = tx.objectStore('albums');
    return await new Promise<Album[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read albums from IndexedDB:', err);
    return [];
  }
}

export async function deleteCustomAlbum(albumId: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(['albums'], 'readwrite');
    const store = tx.objectStore('albums');
    await new Promise<void>((resolve, reject) => {
      const req = store.delete(albumId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete album from IndexedDB:', err);
  }
}

export async function saveCustomTrack(track: Track): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(['tracks'], 'readwrite');
    const store = tx.objectStore('tracks');
    await new Promise<void>((resolve, reject) => {
      const req = store.put(track);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save track to IndexedDB:', err);
  }
}

export async function getCustomTracks(): Promise<Track[]> {
  try {
    const db = await getDB();
    const tx = db.transaction(['tracks'], 'readonly');
    const store = tx.objectStore('tracks');
    return await new Promise<Track[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not read tracks from IndexedDB:', err);
    return [];
  }
}
