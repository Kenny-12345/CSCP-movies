import Navbar from '@/components/shared/Navbar';
import Link from 'next/link';
import { Trophy, Zap, Star } from 'lucide-react';

const SPORT_CATEGORIES = [
  {
    id: 'football',
    label: 'Football',
    emoji: '⚽',
    description: 'Premier League, La Liga, Champions League & more',
    color: 'from-green-600 to-emerald-800',
    accent: 'green',
  },
  {
    id: 'f1',
    label: 'Formula 1',
    emoji: '🏎️',
    description: 'Live races, qualifying, and practice sessions',
    color: 'from-red-600 to-rose-900',
    accent: 'red',
  },
  {
    id: 'basketball',
    label: 'Basketball',
    emoji: '🏀',
    description: 'NBA, EuroLeague and international basketball',
    color: 'from-orange-500 to-orange-900',
    accent: 'orange',
  },
  {
    id: 'tennis',
    label: 'Tennis',
    emoji: '🎾',
    description: 'Grand Slams, ATP & WTA Tour events',
    color: 'from-yellow-500 to-yellow-900',
    accent: 'yellow',
  },
  {
    id: 'baseball',
    label: 'Baseball',
    emoji: '⚾',
    description: 'MLB regular season and playoffs',
    color: 'from-blue-600 to-blue-900',
    accent: 'blue',
  },
  {
    id: 'hockey',
    label: 'Ice Hockey',
    emoji: '🏒',
    description: 'NHL games and international tournaments',
    color: 'from-cyan-500 to-cyan-900',
    accent: 'cyan',
  },
  {
    id: 'mma',
    label: 'MMA & UFC',
    emoji: '🥊',
    description: 'UFC Fight Nights, PPV events and more',
    color: 'from-purple-600 to-purple-900',
    accent: 'purple',
  },
  {
    id: 'rugby',
    label: 'Rugby',
    emoji: '🏉',
    description: 'Six Nations, World Cup and club rugby',
    color: 'from-teal-500 to-teal-900',
    accent: 'teal',
  },
];

export default function SportsPage() {
  return (
    <main className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">Live Sports</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Watch <span className="text-red-600">Sports</span> Live
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stream live football, F1, basketball, tennis and more — all in one place.
            Pick a sport to find live streams and schedules.
          </p>
          <p className="text-yellow-400 text-lg md:text-xl mt-4 font-bold uppercase tracking-wider animate-pulse">
            🚧 This section is still under development — streaming is not yet available. Stay tuned for updates!
          </p>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/40 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live Now</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Select a sport below to watch</span>
          </div>
        </div>

        {/* Sport Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPORT_CATEGORIES.map((sport) => (
            <Link
              key={sport.id}
              href={`/sports/${sport.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

              <div className="relative p-6">
                <div className="text-5xl mb-4">{sport.emoji}</div>
                <h2 className="text-xl font-bold text-white mb-1">{sport.label}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{sport.description}</p>

                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-semibold group-hover:gap-3 transition-all">
                  <span>Watch Live</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Free Live Sports Streams</h3>
            <p className="text-gray-400 text-sm">
              All streams are sourced from free third-party providers. Some streams may require an ad-blocker for the best experience.
              If one stream doesn&apos;t work, try switching to another channel link on the stream page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
