export interface Photo {
  id: string;
  src: string;
  thumbnail?: string;
  title: string;
  caption?: string;
  date: string;
  location?: string;
  albumId: string;
  aspectRatio?: string;
  cameraInfo?: {
    camera?: string;
    lens?: string;
    iso?: string;
    shutter?: string;
    aperture?: string;
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src?: string; // audio file URL / Blob URL, or undefined for synthetic generator
  cover?: string;
  synthPreset?: 'midnight' | 'golden' | 'rain' | 'starlight';
  duration?: number;
}

export type ThemeType = 'cinematic' | 'dreamy' | 'midnight' | 'minimal' | 'retro';

export type TransitionEffect = 'cinematic' | 'fade' | 'smooth' | 'minimal' | 'random';

export interface AlbumSettings {
  theme: ThemeType;
  transition: TransitionEffect;
  slideshowDuration: number; // in seconds (3, 5, 8, 10)
  autoPlayMusic: boolean;
  showCaptions: boolean;
  showMetadata: boolean;
  kenBurns: boolean;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  photos: Photo[];
  tracks: Track[];
  theme: ThemeType;
  settings?: Partial<AlbumSettings>;
  isCustom?: boolean;
}

export interface AppSettings {
  theme: ThemeType;
  animationIntensity: 'subtle' | 'normal' | 'cinematic';
  transition: TransitionEffect;
  slideshowDuration: number;
  musicAutoplay: boolean;
  showCaptions: boolean;
  showMetadata: boolean;
  volume: number;
  reducedMotion: boolean;
  rememberLastAlbum: boolean;
  lastAlbumId?: string;
  kenBurns: boolean;
}
