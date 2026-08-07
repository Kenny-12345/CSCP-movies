'use client';

import { useAuth, WatchlistItem } from '@/context/AuthContext';
import { Bookmark, Check } from 'lucide-react';

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, 'addedAt'>;
  variant?: 'button' | 'icon';
}

export default function WatchlistButton({ item, variant = 'button' }: WatchlistButtonProps) {
  const { isInWatchlist, toggleWatchlist } = useAuth();
  const active = isInWatchlist(item.id, item.type);

  if (variant === 'icon') {
    return (
      <button
        onClick={() => toggleWatchlist(item)}
        className={`p-2 rounded-full backdrop-blur-md border transition-all ${
          active
            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
            : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
        }`}
        title={active ? 'Remove from Watchlist' : 'Add to Watchlist'}
      >
        {active ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleWatchlist(item)}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
        active
          ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/25'
      }`}
    >
      {active ? (
        <>
          <Check className="w-4 h-4" />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          <span>+ Add to Watchlist</span>
        </>
      )}
    </button>
  );
}
