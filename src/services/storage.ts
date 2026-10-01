import { AppSettings } from '../types';

const FAVORITES_KEY = 'lumora_favorites_v1';
const SETTINGS_KEY = 'lumora_settings_v1';
const INTRO_KEY = 'lumora_intro_seen_v1';
const RECENT_ALBUM_KEY = 'lumora_recent_album_id';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'cinematic',
  animationIntensity: 'cinematic',
  transition: 'cinematic',
  slideshowDuration: 5,
  musicAutoplay: true,
  showCaptions: true,
  showMetadata: true,
  volume: 0.8,
  reducedMotion: false,
  rememberLastAlbum: true,
  kenBurns: true
};

// Safe storage wrapper to prevent crashes on Android Chrome / WebView / Incognito
const safeStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Storage read restricted:', e);
    }
    return null;
  },
  set: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {
      console.warn('Storage write restricted:', e);
    }
  },
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Storage removal restricted:', e);
    }
  }
};

export function getStoredFavorites(): string[] {
  try {
    const raw = safeStorage.get(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['photo-s26-1', 'photo-nw-1'];
  } catch {
    return ['photo-s26-1', 'photo-nw-1'];
  }
}

export function saveStoredFavorites(ids: string[]): void {
  safeStorage.set(FAVORITES_KEY, JSON.stringify(ids));
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = safeStorage.get(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  safeStorage.set(SETTINGS_KEY, JSON.stringify(settings));
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  } catch {
    // Ignore DOM styling error if document not ready
  }
}

export function isIntroSeen(): boolean {
  try {
    return safeStorage.get(INTRO_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  safeStorage.set(INTRO_KEY, 'true');
}

export function getRecentAlbumId(): string | null {
  return safeStorage.get(RECENT_ALBUM_KEY);
}

export function setRecentAlbumId(id: string): void {
  safeStorage.set(RECENT_ALBUM_KEY, id);
}

export function resetAllLocalData(): void {
  safeStorage.remove(FAVORITES_KEY);
  safeStorage.remove(SETTINGS_KEY);
  safeStorage.remove(INTRO_KEY);
  safeStorage.remove(RECENT_ALBUM_KEY);
}
