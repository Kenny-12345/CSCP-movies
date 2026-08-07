'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/shared/Navbar';
import Link from 'next/link';
import { Bookmark, Play, Trash2, Star, Film, Tv, User } from 'lucide-react';

export default function WatchlistPage() {
  const { currentUser, watchlist, toggleWatchlist, openAuthModal } = useAuth();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#0f0f11] text-white">
        <Navbar />
        <div className="pt-32 max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold">My Watchlist</h1>
          <p className="text-gray-400 text-sm">
            Sign in with your username to save movies and TV shows to your personal Watchlist and track your progress.
          </p>
          <button
            onClick={openAuthModal}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/25"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Access Watchlist</span>
          </button>
        </div>
      </main>
    );
  }

  const filteredItems = watchlist.filter((item) => {
    if (filter === 'movie') return item.type === 'movie';
    if (filter === 'tv') return item.type === 'tv';
    return true;
  });

  return (
    <main className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4" /> Saved Titles
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">My Watchlist</h1>
            <p className="text-gray-400 text-xs mt-1">
              {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved for <strong className="text-white capitalize">{currentUser}</strong>
            </p>
          </div>

          {/* Filters */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              onClick={() => setFilter('movie')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'movie' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Movies ({watchlist.filter((i) => i.type === 'movie').length})
            </button>
            <button
              onClick={() => setFilter('tv')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'tv' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> TV Series ({watchlist.filter((i) => i.type === 'tv').length})
            </button>
          </div>
        </div>

        {/* Watchlist Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="group relative bg-[#141416] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all hover:scale-[1.02] shadow-xl"
              >
                {/* Poster */}
                <div className="aspect-[2/3] w-full relative bg-gray-800">
                  <img
                    src={item.poster || '/no-poster.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <Link
                      href={`/watch/${item.type}/${item.id}`}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
                    </Link>
                  </div>

                  {/* Type Badge */}
                  <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider border border-white/10">
                    {item.type}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWatchlist(item)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-gray-300 hover:text-red-500 hover:bg-black backdrop-blur-md border border-white/10 transition-colors"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Meta Details */}
                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{item.year || ''}</span>
                    {item.rating && (
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold text-[11px]">
                        <Star className="w-3 h-3 fill-yellow-400" /> {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 bg-white/5 rounded-2xl border border-white/5">
            <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-300">Your Watchlist is Empty</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Browse movies and series and click &ldquo;+ Add to Watchlist&rdquo; to save them here!
            </p>
            <Link
              href="/"
              className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-2.5 rounded-xl border border-white/10 transition-all"
            >
              Explore Movies & TV Shows
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
