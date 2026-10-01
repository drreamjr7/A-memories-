import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Music,
  Trash2,
  Check,
  Sparkles,
  ArrowLeft,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { Album, Photo, Track, ThemeType, TransitionEffect } from '../types';
import { DEMO_TRACKS } from '../data/demoData';

interface CreateAlbumPageProps {
  navigate: (to: string) => void;
}

export const CreateAlbumPage: React.FC<CreateAlbumPageProps> = ({ navigate }) => {
  const { createAlbum } = useAlbums();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Autumn 2026');
  const [theme, setTheme] = useState<ThemeType>('cinematic');
  const [transition, setTransition] = useState<TransitionEffect>('cinematic');
  const [slideshowDuration, setSlideshowDuration] = useState<number>(5);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<Track>(DEMO_TRACKS[0]);
  const [customAudioFile, setCustomAudioFile] = useState<{ name: string; url: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const newPhoto: Photo = {
          id: `custom-photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          albumId: 'pending',
          src,
          title: file.name.replace(/\.[^/.]+$/, ''),
          date: new Date().toISOString().split('T')[0],
          location: 'Local Memory'
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Audio File Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audioUrl = URL.createObjectURL(file);
    setCustomAudioFile({
      name: file.name,
      url: audioUrl
    });

    setSelectedTrack({
      id: `custom-track-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Custom Soundtrack',
      src: audioUrl,
      duration: 180
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (coverPhotoIndex >= index && coverPhotoIndex > 0) {
      setCoverPhotoIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (photos.length === 0) {
      alert('Please add at least one photo to create your album.');
      return;
    }

    setIsSubmitting(true);
    const albumId = `album-${Date.now()}`;
    const coverSrc = photos[coverPhotoIndex]?.src || photos[0].src;

    const finalizedPhotos = photos.map((p) => ({
      ...p,
      albumId
    }));

    const newAlbum: Album = {
      id: albumId,
      title: title.trim(),
      description: description.trim() || 'A personal memory album crafted with Lumora.',
      cover: coverSrc,
      date: date.trim() || '2026',
      photos: finalizedPhotos,
      tracks: [selectedTrack],
      theme,
      isCustom: true,
      settings: {
        theme,
        transition,
        slideshowDuration,
        autoPlayMusic: true,
        showCaptions: true,
        showMetadata: true,
        kenBurns: true
      }
    };

    await createAlbum(newAlbum);
    setIsSubmitting(false);
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Back button */}
      <button
        onClick={() => navigate('/albums')}
        className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white uppercase tracking-wider mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Albums</span>
      </button>

      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-cinematic font-bold text-white">
          Create Memory Album
        </h1>
        <p className="text-sm text-neutral-400 mt-2">
          Curate your photos, choose a soothing soundtrack, and craft a cinematic slideshow.
        </p>
      </div>

      {/* Local Storage Privacy Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 mb-8">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Private Local Storage:</strong> Images and audio uploaded here are stored directly inside your browser's IndexedDB database. They never leave your machine or upload to external servers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Metadata */}
        <div className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Album Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Album Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autumn in Kyoto, Road to Glacier"
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Date or Season
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 2026, Summer '26"
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Description & Reflections
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What made this time unforgettable? Notes, quotes, feelings..."
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Photos ({photos.length})</span>
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              JPG, PNG, WEBP
            </span>
          </div>

          {/* Upload Dropzone */}
          <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-700 hover:border-amber-400/60 rounded-2xl cursor-pointer bg-neutral-950/40 hover:bg-neutral-950/70 transition-all group">
            <Upload className="w-8 h-8 text-neutral-500 group-hover:text-amber-400 transition-colors mb-2" />
            <p className="text-sm font-semibold text-neutral-300 group-hover:text-white">
              Click to select or drop photos here
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Supports multiple photos at once
            </p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          {/* Photo Previews & Cover Selection */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 font-mono">
                Click a photo to set it as the album cover.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map((p, idx) => {
                  const isCover = coverPhotoIndex === idx;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setCoverPhotoIndex(idx)}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border transition-all cursor-pointer ${
                        isCover
                          ? 'border-amber-400 ring-2 ring-amber-400/40'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={p.src}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      {isCover && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-bold uppercase tracking-wider">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(idx);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Music & Soundtrack Section */}
        <div className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Soundtrack</span>
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              Procedural Ambient or Custom Audio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_TRACKS.map((t) => {
              const isSelected = selectedTrack.id === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTrack(t)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 text-amber-200'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate">{t.title}</p>
                    <p className="text-xs text-neutral-400 truncate">{t.artist}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Audio Upload */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-neutral-700 hover:border-neutral-500 cursor-pointer bg-neutral-950/40 text-xs text-neutral-300">
              <Music className="w-4 h-4 text-amber-500" />
              <span>
                {customAudioFile
                  ? `Uploaded: ${customAudioFile.name}`
                  : 'Or upload your own music file (MP3, WAV, M4A, OGG)'}
              </span>
              <input
                type="file"
                accept="audio/mp3,audio/wav,audio/m4a,audio/ogg"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Cinematic Presentation Options */}
        <div className="bg-neutral-900/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-cinematic font-semibold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Cinematic Aesthetics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Color Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeType)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white capitalize focus:outline-none"
              >
                <option value="cinematic">Cinematic</option>
                <option value="dreamy">Dreamy</option>
                <option value="midnight">Midnight</option>
                <option value="minimal">Minimal</option>
                <option value="retro">Retro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Transition Style
              </label>
              <select
                value={transition}
                onChange={(e) => setTransition(e.target.value as TransitionEffect)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white capitalize focus:outline-none"
              >
                <option value="cinematic">Cinematic</option>
                <option value="fade">Fade</option>
                <option value="smooth">Smooth</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Slideshow Pace
              </label>
              <select
                value={slideshowDuration}
                onChange={(e) => setSlideshowDuration(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value={3}>3 Seconds</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={8}>8 Seconds</option>
                <option value={10}>10 Seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-400/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Album...' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  );
};
