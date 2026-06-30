// TMDB API - Free, massive catalog with all movies/TV shows
const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'; // Public demo key
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

async function tmdbFetch(endpoint: string) {
  const url = `${TMDB_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`TMDB Error: ${res.status} for ${endpoint}`);
    return null;
  }
  return res.json();
}

// ─── Home Page Data ───────────────────────────────────────────────────────────

export async function getTrendingMovies() {
  const data = await tmdbFetch('/trending/movie/week');
  return data?.results || [];
}

export async function getTrendingShows() {
  const data = await tmdbFetch('/trending/tv/week');
  return data?.results || [];
}

export async function getPopularMovies() {
  const data = await tmdbFetch('/movie/popular');
  return data?.results || [];
}

export async function getPopularShows() {
  const data = await tmdbFetch('/tv/popular');
  return data?.results || [];
}

export async function getTopRatedMovies() {
  const data = await tmdbFetch('/movie/top_rated');
  return data?.results || [];
}

export async function getTopRatedShows() {
  const data = await tmdbFetch('/tv/top_rated');
  return data?.results || [];
}

export async function getNowPlayingMovies() {
  const data = await tmdbFetch('/movie/now_playing');
  return data?.results || [];
}

export async function getUpcomingMovies() {
  const data = await tmdbFetch('/movie/upcoming');
  return data?.results || [];
}

export async function getAiringTodayShows() {
  const data = await tmdbFetch('/tv/airing_today');
  return data?.results || [];
}

// ─── Detail Pages ─────────────────────────────────────────────────────────────

export async function getMovieDetails(id: string | number) {
  return tmdbFetch(`/movie/${id}?append_to_response=credits,similar,recommendations,videos`);
}

export async function getTVDetails(id: string | number) {
  return tmdbFetch(`/tv/${id}?append_to_response=credits,similar,recommendations,videos`);
}

export async function getTVSeasonDetails(tvId: string | number, seasonNumber: number) {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchMulti(query: string, page: number = 1) {
  return tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function getGenres(type: 'movie' | 'tv' = 'movie') {
  return tmdbFetch(`/genre/${type}/list`);
}

export async function discoverMovies(params: Record<string, string> = {}) {
  const query = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  return tmdbFetch(`/discover/movie?${query}`);
}

export async function discoverTV(params: Record<string, string> = {}) {
  const query = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  return tmdbFetch(`/discover/tv?${query}`);
}

// ─── Image Helpers ────────────────────────────────────────────────────────────

export function posterUrl(path: string | null, size: string = 'w500') {
  if (!path) return '/no-poster.svg';
  return `${IMG_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: string = 'original') {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

// ─── PureHD Helpers ───────────────────────────────────────────────────────────

/**
 * Convert a title + TMDB ID into a PureHD slug.
 * PureHD uses format: /watch-movie/title-slug-purehdId
 * Since we don't have their internal IDs, we embed their search 
 * or use their IMDB-based lookup.
 * 
 * The safest approach: embed the PureHD watch page directly in an iframe,
 * or use vidsrc.xyz which maps TMDB IDs directly.
 */
export function getStreamUrl(type: 'movie' | 'tv', tmdbId: string | number, season?: number, episode?: number) {
  // vidsrc.xyz supports direct TMDB ID mapping and is what PureHD-style sites use under the hood
  if (type === 'movie') {
    return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
  }
  return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
}

export function getStreamUrlPureHD(slug: string, type: 'movie' | 'tv') {
  if (type === 'movie') {
    return `https://purehd.cc/watch-movie/${slug}`;
  }
  return `https://purehd.cc/watch-tv/${slug}`;
}
