import Navbar from '@/components/shared/Navbar';
import MatchCard from '@/components/shared/MatchCard';
import Link from 'next/link';
import { ArrowLeft, Zap, Calendar, ExternalLink, Tv } from 'lucide-react';
import { fetchSportEvents, SPORT_LEAGUES } from '@/lib/sports';

type SportId = 'football' | 'f1' | 'basketball' | 'tennis' | 'baseball' | 'hockey' | 'mma' | 'rugby';

const SPORT_META: Record<SportId, {
  label: string;
  emoji: string;
  description: string;
}> = {
  football: { label: 'Football', emoji: '⚽', description: 'Premier League, La Liga, Champions League & more' },
  f1: { label: 'Formula 1', emoji: '🏎️', description: 'Live races, qualifying, and practice sessions' },
  basketball: { label: 'Basketball', emoji: '🏀', description: 'NBA, EuroLeague and international basketball' },
  tennis: { label: 'Tennis', emoji: '🎾', description: 'Grand Slams, ATP & WTA Tour events' },
  baseball: { label: 'Baseball', emoji: '⚾', description: 'MLB regular season and playoffs' },
  hockey: { label: 'Ice Hockey', emoji: '🏒', description: 'NHL games and international tournaments' },
  mma: { label: 'MMA & UFC', emoji: '🥊', description: 'UFC Fight Nights, PPV events and more' },
  rugby: { label: 'Rugby', emoji: '🏉', description: 'Six Nations, World Cup and club rugby' },
};

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const meta = SPORT_META[sport as SportId];

  if (!meta) {
    return (
      <main className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center flex-col gap-4">
        <h1 className="text-3xl font-bold">Sport not found</h1>
        <Link href="/sports" className="text-red-500 hover:underline">← Back to Sports</Link>
      </main>
    );
  }

  const leagueEvents = await fetchSportEvents(sport);
  const totalEvents = leagueEvents.reduce((sum, l) => sum + l.events.length, 0);
  const liveEvents = leagueEvents.reduce((sum, l) => sum + l.events.filter(e => e.status === 'live').length, 0);
  const leagues = SPORT_LEAGUES[sport] || [];

  return (
    <main className="min-h-screen bg-[#0f0f11] text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Back */}
        <Link href="/sports" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Sports
        </Link>

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <span className="text-6xl">{meta.emoji}</span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-extrabold">{meta.label}</h1>
              {liveEvents > 0 && (
                <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-600/40 rounded-full px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold uppercase">{liveEvents} Live</span>
                </div>
              )}
            </div>
            <p className="text-gray-400">{meta.description}</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span><strong className="text-white">{totalEvents}</strong> upcoming/live events</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Tv className="w-4 h-4" />
            <span><strong className="text-white">{leagues.length}</strong> leagues tracked</span>
          </div>
        </div>

        {/* Events by League */}
        {leagueEvents.length > 0 ? (
          <div className="space-y-10">
            {leagueEvents.map((group) => (
              <section key={group.league}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-red-500" />
                  <h2 className="text-lg font-bold">{group.league}</h2>
                  <span className="text-xs text-gray-500">({group.events.length} events)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.events.map((event) => (
                    <MatchCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-white mb-2">No events scheduled right now</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              There are no upcoming or live {meta.label.toLowerCase()} events at the moment. Check back later or search GoalDaddy TV directly below.
            </p>
          </div>
        )}

        {/* External Stream Sites */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-white">External Stream Sites</h3>
            <span className="text-xs text-gray-500">(opens in new tab)</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Can&apos;t find your match stream? Click below to search for live streams directly on GoalDaddy TV.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.goaldaddy.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 hover:border-red-600/40 text-sm text-red-400 hover:text-red-300 px-5 py-2.5 rounded-lg transition-all font-semibold"
            >
              Go to GoalDaddy TV Homepage <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-sm text-gray-400">
          💡 <strong className="text-yellow-400">Tip:</strong> Click &quot;Watch&quot; on any match to open available streams in a new tab. Use an ad-blocker like uBlock Origin for the best experience. Events update automatically every 60 seconds.
        </div>
      </div>
    </main>
  );
}
