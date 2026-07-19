'use client';

import { SportEvent } from '@/lib/sports';
import { ExternalLink, Radio } from 'lucide-react';
import Image from 'next/image';

function formatMatchTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0 && diffMins > -180) return 'Started';
  if (diffMins >= 0 && diffMins <= 60) return `In ${diffMins} min`;
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function MatchCard({ event }: { event: SportEvent }) {
  const isLive = event.status === 'live';
  const isCompleted = event.status === 'completed';

  return (
    <div className={`relative bg-white/5 border rounded-2xl overflow-hidden transition-all hover:bg-white/8 ${
      isLive ? 'border-red-600/40 shadow-lg shadow-red-600/5' : 'border-white/10'
    }`}>
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-0.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white text-[10px] font-bold uppercase tracking-wider">Live</span>
        </div>
      )}

      <div className="p-5">
        {/* League + Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium">{event.league}</span>
          <span className={`text-xs font-medium ${isLive ? 'text-red-400' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
            {isLive ? event.statusDetail : isCompleted ? 'Full Time' : formatMatchTime(event.date)}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {event.homeTeam.logo ? (
              <Image
                src={event.homeTeam.logo}
                alt={event.homeTeam.name}
                width={36}
                height={36}
                className="w-9 h-9 object-contain flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-gray-500" />
              </div>
            )}
            <span className="text-white text-sm font-semibold truncate">{event.homeTeam.name}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {(isLive || isCompleted) ? (
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-bold ${isLive ? 'text-white' : 'text-gray-400'}`}>{event.homeTeam.score}</span>
                <span className="text-gray-600 text-sm">–</span>
                <span className={`text-xl font-bold ${isLive ? 'text-white' : 'text-gray-400'}`}>{event.awayTeam.score}</span>
              </div>
            ) : (
              <span className="text-gray-600 text-lg font-bold">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <span className="text-white text-sm font-semibold truncate text-right">{event.awayTeam.name}</span>
            {event.awayTeam.logo ? (
              <Image
                src={event.awayTeam.logo}
                alt={event.awayTeam.name}
                width={36}
                height={36}
                className="w-9 h-9 object-contain flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Stream Links */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
          {event.streamLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                i === 0
                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              Watch <ExternalLink className="w-3 h-3" />
              <span className="text-gray-500 ml-0.5">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
