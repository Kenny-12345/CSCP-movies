import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/home/Hero';
import ContentCarousel from '@/components/home/ContentCarousel';
import {
  getTrendingMovies,
  getTrendingShows,
  getPopularMovies,
  getPopularShows,
  getTopRatedMovies,
  getTopRatedShows,
  getNowPlayingMovies,
  getUpcomingMovies,
  getAiringTodayShows,
  posterUrl,
  backdropUrl,
} from '@/lib/tmdb';

export default async function Home() {
  const [
    trendingMovies,
    trendingShows,
    popularMovies,
    popularShows,
    topRatedMovies,
    topRatedShows,
    nowPlaying,
    upcoming,
    airingToday,
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingShows(),
    getPopularMovies(),
    getPopularShows(),
    getTopRatedMovies(),
    getTopRatedShows(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getAiringTodayShows(),
  ]);

  const mapMovie = (m: any) => ({
    id: String(m.id),
    title: m.title || m.name,
    posterPath: posterUrl(m.poster_path),
    backdropPath: backdropUrl(m.backdrop_path),
    type: m.title ? 'movie' : 'tv',
    rating: m.vote_average,
    year: (m.release_date || m.first_air_date || '').substring(0, 4),
  });

  // Pick the best hero movie from trending
  const heroMovie = trendingMovies[0];

  return (
    <main className="min-h-screen pb-20 bg-[#0f0f11]">
      <Navbar />
      {heroMovie && (
        <Hero
          title={heroMovie.title || heroMovie.name}
          overview={heroMovie.overview}
          backdrop={backdropUrl(heroMovie.backdrop_path)}
          year={(heroMovie.release_date || heroMovie.first_air_date || '').substring(0, 4)}
          rating={heroMovie.vote_average?.toFixed(1)}
          id={String(heroMovie.id)}
          type={heroMovie.title ? 'movie' : 'tv'}
        />
      )}

      <div className="relative z-20 -mt-24 space-y-2 pb-12">
        <ContentCarousel title="🔥 Trending Movies" items={trendingMovies.map(mapMovie)} />
        <ContentCarousel title="📺 Trending TV Shows" items={trendingShows.map(mapMovie)} />
        <ContentCarousel title="🎬 Now Playing" items={nowPlaying.map(mapMovie)} />
        <ContentCarousel title="⭐ Top Rated Movies" items={topRatedMovies.map(mapMovie)} />
        <ContentCarousel title="⭐ Top Rated TV Shows" items={topRatedShows.map(mapMovie)} />
        <ContentCarousel title="🎭 Popular Movies" items={popularMovies.map(mapMovie)} />
        <ContentCarousel title="📡 Popular TV Shows" items={popularShows.map(mapMovie)} />
        <ContentCarousel title="🆕 Upcoming Releases" items={upcoming.map(mapMovie)} />
        <ContentCarousel title="📡 Airing Today" items={airingToday.map(mapMovie)} />
      </div>
    </main>
  );
}
