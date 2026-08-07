'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Play, X, Clock } from 'lucide-react';

export default function ContinueWatchingRow() {
  const { continueWatching, removeProgress } = useAuth();

  if (!continueWatching || continueWatching.length === 0) return null;

  return (
    <section id="continue-watching" className="space-y-4 my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 bg-red-600 rounded-full" />
          <h2 className="text-xl md:text-2xl font-extrabold text-white">Continue Watching</h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">{continueWatching.length} saved</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {continueWatching.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="group relative flex-shrink-0 w-64 md:w-72 bg-[#141416] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all hover:scale-[1.02] shadow-xl"
          >
            {/* Backdrop / Image */}
            <div className="aspect-video w-full relative bg-gray-800">
              <img
                src={item.backdrop || item.poster || '/no-poster.svg'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center">
                <Link
                  href={`/watch/${item.type}/${item.id}`}
                  className="w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform group-hover:scale-110 transition-all"
                  title="Resume Watching"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </Link>
              </div>

              {/* Episode Badge if TV */}
              {item.type === 'tv' && item.season && item.episode && (
                <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-white border border-white/10">
                  S{item.season} E{item.episode}
                </span>
              )}

              {/* Remove item button */}
              <button
                onClick={() => removeProgress(item.id, item.type)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-gray-400 hover:text-white hover:bg-black transition-colors"
                title="Remove from Continue Watching"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${Math.max(10, Math.min(100, item.progressPercent))}%` }}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="p-3.5 space-y-1">
              <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-red-500" /> {item.progressPercent}% Completed
                </span>
                <Link
                  href={`/watch/${item.type}/${item.id}`}
                  className="text-red-500 font-semibold text-[11px] hover:underline"
                >
                  Resume →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
