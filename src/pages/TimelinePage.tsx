import React, { useMemo } from 'react';
import { Calendar, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAlbums } from '../context/AlbumContext';
import { Photo } from '../types';

interface TimelinePageProps {
  onOpenPhoto: (photo: Photo) => void;
  navigate: (to: string) => void;
}

interface TimelineGroup {
  monthYear: string;
  days: {
    dateStr: string;
    displayDay: string;
    photos: Photo[];
  }[];
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ onOpenPhoto, navigate }) => {
  const { allPhotos } = useAlbums();

  const groupedTimeline = useMemo(() => {
    // Sort all photos descending by date
    const sorted = [...allPhotos].sort((a, b) => (b.date > a.date ? 1 : -1));

    const monthMap: Record<string, Record<string, Photo[]>> = {};

    sorted.forEach((p) => {
      const d = new Date(p.date);
      const monthYear = isNaN(d.getTime())
        ? 'Year of 2026'
        : d.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

      const dayStr = isNaN(d.getTime())
        ? p.date
        : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

      if (!monthMap[monthYear]) {
        monthMap[monthYear] = {};
      }
      if (!monthMap[monthYear][dayStr]) {
        monthMap[monthYear][dayStr] = [];
      }
      monthMap[monthYear][dayStr].push(p);
    });

    const groups: TimelineGroup[] = [];
    Object.keys(monthMap).forEach((my) => {
      const days = Object.keys(monthMap[my]).map((day) => ({
        dateStr: day,
        displayDay: day,
        photos: monthMap[my][day]
      }));
      groups.push({ monthYear: my, days });
    });

    return groups;
  }, [allPhotos]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs uppercase tracking-widest font-mono mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Chronological Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-cinematic font-bold text-white tracking-wide uppercase">
          Timeline
        </h1>
        <p className="text-sm text-neutral-400 mt-3 font-light leading-relaxed">
          A continuous voyage through time. Scroll through moments and milestones as they unfolded across the seasons.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
        {groupedTimeline.map((group) => (
          <div key={group.monthYear} className="relative">
            {/* Month indicator node */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-amber-500/60 shadow-lg shadow-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>

            <h2 className="text-xl sm:text-2xl font-cinematic font-bold text-amber-300 tracking-[0.15em] mb-8">
              {group.monthYear}
            </h2>

            <div className="space-y-10">
              {group.days.map((day) => (
                <div key={day.dateStr} className="bg-neutral-900/40 border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                    <span className="text-sm font-semibold text-white">
                      {day.displayDay}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {day.photos.length} {day.photos.length === 1 ? 'memory' : 'memories'}
                    </span>
                  </div>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {day.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => onOpenPhoto(photo)}
                        className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer shadow-md"
                      >
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                          <p className="text-xs font-medium text-white truncate">{photo.title}</p>
                          {photo.location && (
                            <p className="text-[10px] text-neutral-400 flex items-center gap-1 truncate">
                              <MapPin className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                              {photo.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
