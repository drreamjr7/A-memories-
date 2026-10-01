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

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['photo-s26-1', 'photo-nw-1'];
  } catch {
    return ['photo-s26-1', 'photo-nw-1'];
  }
}

export function saveStoredFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply theme attribute to html/body
    document.documentElement.setAttribute('data-theme', settings.theme);
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
}

export function isIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_KEY, 'true');
  } catch (e) {
    console.warn(e);
  }
}

export function getRecentAlbumId(): string | null {
  try {
    return localStorage.getItem(RECENT_ALBUM_KEY);
  } catch {
    return null;
  }
}

export function setRecentAlbumId(id: string): void {
  try {
    localStorage.setItem(RECENT_ALBUM_KEY, id);
  } catch (e) {
    console.warn(e);
  }
}

export function resetAllLocalData(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(INTRO_KEY);
    localStorage.removeItem(RECENT_ALBUM_KEY);
  } catch (e) {
    console.warn(e);
  }
}
