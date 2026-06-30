'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Film, Tv, Star, Loader2 } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=2dca580c2a14b55200e784d157207b4d&query=${encodeURIComponent(query)}&language=en-US&page=1`
        );
        const data = await res.json();
        setResults(
          (data.results || []).filter(
            (r: SearchResult) => r.media_type === 'movie' || r.media_type === 'tv'
          )
        );
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const posterUrl = (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w300${path}` : '/no-poster.svg';

  return (
    <main className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-14 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => {
              const title = item.title || item.name || 'Unknown';
              const year = (item.release_date || item.first_air_date || '').substring(0, 4);
              const type = item.media_type === 'movie' ? 'movie' : 'tv';

              return (
                <Link href={`/watch/${type}/${item.id}`} key={`${type}-${item.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900">
                      <img
                        src={posterUrl(item.poster_path)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Type badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          type === 'movie' ? 'bg-blue-600/90' : 'bg-purple-600/90'
                        }`}>
                          {type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                          {type}
                        </span>
                      </div>
                      {/* Rating badge */}
                      {item.vote_average > 0 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {item.vote_average.toFixed(1)}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium truncate group-hover:text-red-400 transition-colors">{title}</h3>
                      <p className="text-xs text-gray-500">{year}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {/* Initial State */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Search for any movie or TV show</p>
            <p className="text-gray-600 text-sm mt-2">Browse millions of titles from TMDB</p>
          </div>
        )}
      </div>
    </main>
  );
}
