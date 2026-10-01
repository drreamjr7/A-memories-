import { Album, Track } from '../types';

import crimsonRose from '../assets/images/lumora_flower_crimson_rose_1790857064261.jpg';
import violetOrchid from '../assets/images/lumora_flower_violet_orchid_1790857078927.jpg';
import goldenSunflower from '../assets/images/lumora_flower_golden_sunflower_1790857094401.jpg';
import whiteLotus from '../assets/images/lumora_flower_white_lotus_1790857105419.jpg';
import blueHydrangea from '../assets/images/lumora_flower_blue_hydrangea_1790857116776.jpg';
import blushPeony from '../assets/images/lumora_flower_blush_peony_1790857129021.jpg';

export {
  crimsonRose,
  violetOrchid,
  goldenSunflower,
  whiteLotus,
  blueHydrangea,
  blushPeony
};

export const DEMO_TRACKS: Track[] = [
  {
    id: 'track-golden-hour',
    title: 'Golden Meadow Reverie',
    artist: 'Lumora Floral Ensemble',
    synthPreset: 'golden',
    cover: goldenSunflower,
    duration: 194
  },
  {
    id: 'track-midnight-drift',
    title: 'Midnight Orchid Echoes',
    artist: 'Solaris & Botanical Drift',
    synthPreset: 'midnight',
    cover: violetOrchid,
    duration: 218
  },
  {
    id: 'track-rain-piano',
    title: 'Raindrops on Hydrangea',
    artist: 'Aethelgard Ambient',
    synthPreset: 'rain',
    cover: blueHydrangea,
    duration: 176
  },
  {
    id: 'track-starlight',
    title: 'Lotus Obsidian Silence',
    artist: 'Celeste Soundscapes',
    synthPreset: 'starlight',
    cover: whiteLotus,
    duration: 245
  }
];

export const DEMO_ALBUMS: Album[] = [
  {
    id: 'velvet-and-dew',
    title: 'Velvet & Dew',
    description: 'Deep crimson antique roses, morning mist, and romantic painterly blush petals in quiet bloom.',
    cover: crimsonRose,
    date: 'Spring & Summer 2026',
    theme: 'retro',
    tracks: [DEMO_TRACKS[0], DEMO_TRACKS[2]],
    settings: {
      theme: 'retro',
      transition: 'cinematic',
      slideshowDuration: 5,
      autoPlayMusic: true,
      showCaptions: true,
      showMetadata: true,
      kenBurns: true
    },
    photos: [
      {
        id: 'photo-rose-1',
        albumId: 'velvet-and-dew',
        src: crimsonRose,
        title: 'Crimson Velvet at Dawn',
        caption: 'Morning dew clinging to antique petals like delicate scattered glass.',
        date: '2026-05-18',
        location: 'Monet Heritage Garden',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Leica SL2',
          lens: 'APO-Macro-Elmarit-TL 60mm f/2.8',
          iso: '100',
          shutter: '1/320s',
          aperture: 'f/2.8'
        }
      },
      {
        id: 'photo-peony-2',
        albumId: 'velvet-and-dew',
        src: blushPeony,
        title: 'Blush Peony Awakenings',
        caption: 'Soft diffused morning linen light unfurling delicate layers of cream and rose.',
        date: '2026-06-04',
        location: 'Kyoto Imperial Botanical Conservatory',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Hasselblad 907X',
          lens: 'XCD 65mm f/2.8',
          iso: '64',
          shutter: '1/160s',
          aperture: 'f/3.2'
        }
      },
      {
        id: 'photo-sun-3',
        albumId: 'velvet-and-dew',
        src: goldenSunflower,
        title: 'Sunlit Wildflower Slope',
        caption: 'Alpine meadows ablaze in amber light as the golden hour settles.',
        date: '2026-06-22',
        location: 'Val d’Orcia, Tuscany',
        aspectRatio: '16/9',
        cameraInfo: {
          camera: 'Sony A7R V',
          lens: 'FE 50mm f/1.2 GM',
          iso: '100',
          shutter: '1/1000s',
          aperture: 'f/2.0'
        }
      }
    ]
  },
  {
    id: 'midnight-orchids',
    title: 'Midnight Orchids',
    description: 'Ethereal purple blossoms, obsidian night waters, and mystical luminescence under starlight.',
    cover: violetOrchid,
    date: 'April – September 2026',
    theme: 'midnight',
    tracks: [DEMO_TRACKS[1], DEMO_TRACKS[3]],
    settings: {
      theme: 'midnight',
      transition: 'smooth',
      slideshowDuration: 6,
      autoPlayMusic: true,
      showCaptions: true,
      showMetadata: true,
      kenBurns: true
    },
    photos: [
      {
        id: 'photo-orchid-1',
        albumId: 'midnight-orchids',
        src: violetOrchid,
        title: 'Wild Indigo Orchid',
        caption: 'Glowing like a quiet celestial constellation in the shadowy undergrowth.',
        date: '2026-05-12',
        location: 'Monteverde Cloud Forest',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Leica Q3',
          lens: 'Summilux 28mm f/1.7',
          iso: '400',
          shutter: '1/60s',
          aperture: 'f/2.0'
        }
      },
      {
        id: 'photo-lotus-2',
        albumId: 'midnight-orchids',
        src: whiteLotus,
        title: 'Obsidian Water Lotus',
        caption: 'Pure white stillness resting upon the mirror of tranquil dark waters.',
        date: '2026-07-28',
        location: 'Ryoan-ji Temple Pond',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Fujifilm GFX 100 II',
          lens: 'GF 110mm f/2 R LM WR',
          iso: '100',
          shutter: '1/250s',
          aperture: 'f/2.8'
        }
      },
      {
        id: 'photo-hydrangea-3',
        albumId: 'midnight-orchids',
        src: blueHydrangea,
        title: 'Twilight Hydrangea Canopy',
        caption: 'Cerulean globes cradling summer rain under the gathering dusk.',
        date: '2026-08-19',
        location: 'Kamakura Hydrangea Hills',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Sony A1',
          lens: 'FE 85mm f/1.4 GM',
          iso: '200',
          shutter: '1/200s',
          aperture: 'f/1.8'
        }
      }
    ]
  },
  {
    id: 'golden-meadows',
    title: 'Alpine Meadow Song',
    description: 'Golden wildflowers swaying in mountain breezes, sun-drenched hillsides, and eternal warmth.',
    cover: goldenSunflower,
    date: 'July – August 2026',
    theme: 'cinematic',
    tracks: [DEMO_TRACKS[0]],
    settings: {
      theme: 'cinematic',
      transition: 'cinematic',
      slideshowDuration: 5,
      autoPlayMusic: true,
      showCaptions: true,
      showMetadata: false,
      kenBurns: true
    },
    photos: [
      {
        id: 'photo-gold-1',
        albumId: 'golden-meadows',
        src: goldenSunflower,
        title: 'Summer Solstice Wildflowers',
        caption: 'Warm winds carrying the honey scent of daisies and alpine clover.',
        date: '2026-07-02',
        location: 'Dolomites Alpine Ridge',
        aspectRatio: '16/9',
        cameraInfo: {
          camera: 'Hasselblad X2D 100C',
          lens: 'XCD 38mm f/2.5',
          iso: '64',
          shutter: '1/500s',
          aperture: 'f/4.0'
        }
      },
      {
        id: 'photo-rose-2',
        albumId: 'golden-meadows',
        src: crimsonRose,
        title: 'Wild Briar Blossom',
        caption: 'Thorns and velvet along the sun-baked stone wall.',
        date: '2026-07-15',
        location: 'Cotswolds Manor Trail',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Leica M11',
          lens: 'Noctilux-M 50mm f/1.2',
          iso: '100',
          shutter: '1/1200s',
          aperture: 'f/1.4'
        }
      },
      {
        id: 'photo-peony-3',
        albumId: 'golden-meadows',
        src: blushPeony,
        title: 'Afternoon Sunburst Peony',
        caption: 'Full blooms basking in the languid heat of midsummer.',
        date: '2026-08-01',
        location: 'Giverny Water Garden',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Sony A7R V',
          lens: 'FE 50mm f/1.2 GM',
          iso: '100',
          shutter: '1/800s',
          aperture: 'f/2.0'
        }
      }
    ]
  },
  {
    id: 'zen-lotus',
    title: 'Zen Lotus Waters',
    description: 'Pristine white water lilies and raindrops resting on velvety petals in tranquil contemplation.',
    cover: whiteLotus,
    date: 'Autumn 2026',
    theme: 'minimal',
    tracks: [DEMO_TRACKS[3]],
    settings: {
      theme: 'minimal',
      transition: 'fade',
      slideshowDuration: 8,
      autoPlayMusic: true,
      showCaptions: true,
      showMetadata: true,
      kenBurns: true
    },
    photos: [
      {
        id: 'photo-lotus-zen',
        albumId: 'zen-lotus',
        src: whiteLotus,
        title: 'Equanimity in White',
        caption: 'Untouched by the muddy water beneath, blooming pure and serene.',
        date: '2026-09-08',
        location: 'Ueno Shinobazu Pond',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Leica Q3',
          lens: 'Summilux 28mm f/1.7',
          iso: '100',
          shutter: '1/400s',
          aperture: 'f/2.8'
        }
      },
      {
        id: 'photo-hydrangea-zen',
        albumId: 'zen-lotus',
        src: blueHydrangea,
        title: 'Morning Rain Clustered Blue',
        caption: 'Each small droplet a prism reflecting the tranquil sky.',
        date: '2026-09-14',
        location: 'Meigetsu-in Temple',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Sony A7R V',
          lens: 'FE 90mm f/2.8 Macro G',
          iso: '200',
          shutter: '1/160s',
          aperture: 'f/3.5'
        }
      },
      {
        id: 'photo-orchid-zen',
        albumId: 'zen-lotus',
        src: violetOrchid,
        title: 'Solitary Shadow Orchid',
        caption: 'A whisper of purple light before twilight fades to night.',
        date: '2026-09-21',
        location: 'Kyoto Zen Sanctuary',
        aspectRatio: '4/3',
        cameraInfo: {
          camera: 'Hasselblad X2D',
          lens: 'XCD 55mm f/2.5',
          iso: '100',
          shutter: '1/120s',
          aperture: 'f/2.5'
        }
      }
    ]
  }
];
