import { getMovieDetails, getTVDetails, posterUrl, backdropUrl } from '@/lib/tmdb';
import { STREAM_SERVERS } from '@/lib/providers';
import Navbar from '@/components/shared/Navbar';
import VideoPlayer from '@/components/shared/VideoPlayer';
import Link from 'next/link';
import { Star, Clock, Calendar, ArrowLeft } from 'lucide-react';

export default async function WatchPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;

  const isMovie = type === 'movie';
  const data = isMovie ? await getMovieDetails(id) : await getTVDetails(id);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center flex-col gap-4">
        <h1 className="text-3xl font-bold">Content not found</h1>
        <Link href="/" className="text-red-500 hover:underline">← Go back home</Link>
      </main>
    );
  }

  const title = data.title || data.name;
  const overview = data.overview;
  const backdrop = backdropUrl(data.backdrop_path);
  const poster = posterUrl(data.poster_path);
  const year = (data.release_date || data.first_air_date || '').substring(0, 4);
  const rating = data.vote_average?.toFixed(1);
  const runtime = data.runtime || data.episode_run_time?.[0];
  const genres = data.genres?.map((g: any) => g.name) || [];
  const cast = data.credits?.cast?.slice(0, 12) || [];
  const crew = data.credits?.crew || [];
  const director = crew.find((c: any) => c.job === 'Director');
  const writers = crew.filter((c: any) => c.department === 'Writing').slice(0, 3);
  const similar = data.similar?.results?.slice(0, 10) || [];
  const recommendations = data.recommendations?.results?.slice(0, 10) || [];
  const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  const seasons = data.seasons || [];

  // Generate server URLs
  const servers = STREAM_SERVERS.map(s => ({
    name: s.name,
    url: isMovie ? s.getMovieUrl(id) : s.getTvUrl(id, 1, 1),
  }));

  return (
    <main className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />

      <div className="pt-20">
        {/* Video Player Section */}
        <div className="w-full bg-black">
          <div className="max-w-[1400px] mx-auto">
            <VideoPlayer servers={servers} title={title} tmdbId={id} type={type} seasons={seasons} />
          </div>
        </div>

        {/* Movie Info */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 md:w-64">
              <img src={poster} alt={title} className="rounded-lg shadow-2xl w-full" />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>

              {data.tagline && (
                <p className="text-lg text-gray-400 italic">&ldquo;{data.tagline}&rdquo;</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star className="w-4 h-4 fill-yellow-400" /> {rating}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-4 h-4" /> {year}
                </span>
                {runtime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-4 h-4" /> {runtime} min
                    </span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="border border-gray-600 px-2 py-0.5 rounded text-xs text-gray-300">HD</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {genres.map((g: string) => (
                  <span key={g} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">{g}</span>
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed text-base max-w-3xl">{overview}</p>

              {director && (
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Director:</span>{' '}
                  <span className="text-white">{director.name}</span>
                </p>
              )}
              {writers.length > 0 && (
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Writers:</span>{' '}
                  <span className="text-white">{writers.map((w: any) => w.name).join(', ')}</span>
                </p>
              )}
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {cast.map((c: any) => (
                  <div key={c.id} className="flex-shrink-0 w-28 text-center">
                    <img
                      src={c.profile_path ? posterUrl(c.profile_path, 'w185') : '/no-poster.svg'}
                      alt={c.name}
                      className="w-28 h-28 rounded-full object-cover mx-auto bg-gray-800"
                    />
                    <p className="text-sm font-medium mt-2 text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TV Seasons */}
          {!isMovie && seasons.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Seasons</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                  <div key={s.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer">
                    <img
                      src={posterUrl(s.poster_path, 'w300')}
                      alt={s.name}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.episode_count} episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar & Recommendations */}
          {similar.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Similar Titles</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {similar.map((s: any) => (
                  <Link href={`/watch/${type}/${s.id}`} key={s.id} className="flex-shrink-0 w-40">
                    <img src={posterUrl(s.poster_path, 'w300')} alt={s.title || s.name} className="rounded-lg w-full aspect-[2/3] object-cover bg-gray-800 hover:scale-105 transition-transform" />
                    <p className="text-sm mt-2 truncate">{s.title || s.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {recommendations.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Recommendations</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {recommendations.map((r: any) => (
                  <Link href={`/watch/${r.title ? 'movie' : 'tv'}/${r.id}`} key={r.id} className="flex-shrink-0 w-40">
                    <img src={posterUrl(r.poster_path, 'w300')} alt={r.title || r.name} className="rounded-lg w-full aspect-[2/3] object-cover bg-gray-800 hover:scale-105 transition-transform" />
                    <p className="text-sm mt-2 truncate">{r.title || r.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Trailer */}
          {trailer && (
            <section>
              <h2 className="text-xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video max-w-3xl rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  className="w-full h-full"
                  allowFullScreen
                  title="Trailer"
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
