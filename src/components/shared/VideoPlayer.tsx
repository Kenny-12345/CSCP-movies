'use client';

import { useState } from 'react';
import { MonitorPlay, ChevronDown, AlertTriangle } from 'lucide-react';
import { STREAM_SERVERS } from '@/lib/providers';

interface VideoPlayerProps {
  servers: { name: string; url: string }[];
  title: string;
  tmdbId: string;
  type: string;
  seasons?: any[];
}

export default function VideoPlayer({ servers, title, tmdbId, type, seasons = [] }: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [iframeError, setIframeError] = useState(false);

  const isTV = type === 'tv';

  // Regenerate URL for TV when season/episode changes
  const currentUrl = isTV
    ? STREAM_SERVERS[activeServer]?.getTvUrl(tmdbId, selectedSeason, selectedEpisode)
    : servers[activeServer]?.url;

  const switchServer = (i: number) => {
    setActiveServer(i);
    setIframeError(false);
  };

  return (
    <div className="space-y-0">
      {/* Video Player */}
      <div className="aspect-video w-full bg-black relative group">
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10 flex-col gap-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
            <p className="text-gray-300">This server is unavailable. Try another server below.</p>
          </div>
        )}
        <iframe
          key={`${currentUrl}-${activeServer}`}
          src={currentUrl}
          className="w-full h-full absolute inset-0 border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title}
          onError={() => setIframeError(true)}
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-[#141416] border-t border-white/5 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          {/* Server Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <MonitorPlay className="w-4 h-4 text-gray-500 hidden sm:block" />
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Server:</span>
            <div className="flex gap-2">
              {servers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => switchServer(i)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all ${
                    activeServer === i
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </div>

          {/* TV Season/Episode Selector */}
          {isTV && seasons.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={(e) => { setSelectedSeason(Number(e.target.value)); setSelectedEpisode(1); }}
                  className="appearance-none bg-white/5 text-white text-xs px-4 py-1.5 pr-8 rounded cursor-pointer border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  {seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                    <option key={s.season_number} value={s.season_number} className="bg-[#141416]">
                      Season {s.season_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="appearance-none bg-white/5 text-white text-xs px-4 py-1.5 pr-8 rounded cursor-pointer border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  {Array.from({ length: seasons.find((s: any) => s.season_number === selectedSeason)?.episode_count || 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-[#141416]">
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-600 mt-2 max-w-[1400px] mx-auto">
          If the current server doesn&apos;t work, try switching to another server above.
        </p>
      </div>
    </div>
  );
}
