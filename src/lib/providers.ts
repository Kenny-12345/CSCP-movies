// ─── Streaming Embed Providers ────────────────────────────────────────────────
// These are reliable embed providers that support cross-origin iframes.
// They map TMDB IDs directly to embeddable video player iframes.

export interface StreamServer {
  name: string;
  getMovieUrl: (tmdbId: string | number) => string;
  getTvUrl: (tmdbId: string | number, season: number, episode: number) => string;
}

export const STREAM_SERVERS: StreamServer[] = [
  {
    name: 'Server 1',
    getMovieUrl: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    getTvUrl: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: 'Server 2',
    getMovieUrl: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'Server 3',
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'Server 4',
    getMovieUrl: (id) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    getTvUrl: (id, s, e) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    name: 'Server 5 (vidsrc.nl)',
    getMovieUrl: (id) => `https://vidsrc.nl/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.nl/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Server 6 (embed.su)',
    getMovieUrl: (id) => `https://embed.su/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  }
];
