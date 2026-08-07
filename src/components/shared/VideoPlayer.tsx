'use client';

import { useState, useRef, useEffect } from 'react';
import { MonitorPlay, ChevronDown, AlertTriangle, Maximize, ShieldCheck, RefreshCw } from 'lucide-react';
import { STREAM_SERVERS } from '@/lib/providers';
import { useAuth } from '@/context/AuthContext';

interface VideoPlayerProps {
  servers: { name: string; url: string }[];
  title: string;
  tmdbId: string;
  type: string;
  poster?: string;
  backdrop?: string;
  seasons?: any[];
}

export default function VideoPlayer({ servers, title, tmdbId, type, poster = '', backdrop = '', seasons = [] }: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [iframeError, setIframeError] = useState(false);

  // Click shield state (absorbs up to 4 ad-triggering clicks)
  const [clickShieldCount, setClickShieldCount] = useState(4);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const { saveProgress } = useAuth();

  const isTV = type === 'tv';
  const isNativeAdFree = STREAM_SERVERS[activeServer]?.isNativeAdFree;

  // Intercept window.open popups created by embedded players
  useEffect(() => {
    const originalOpen = window.open;
    window.open = function (...args) {
      console.log('Blocked popup window from ad script:', args[0]);
      return null;
    };
    return () => {
      window.open = originalOpen;
    };
  }, []);

  // Save Continue Watching progress automatically
  useEffect(() => {
    saveProgress({
      id: tmdbId,
      type: isTV ? 'tv' : 'movie',
      title,
      poster,
      backdrop,
      season: isTV ? selectedSeason : undefined,
      episode: isTV ? selectedEpisode : undefined,
      progressPercent: isTV ? Math.min(100, Math.round((selectedEpisode / 10) * 100)) : 65,
    });
  }, [tmdbId, isTV, selectedSeason, selectedEpisode, title, poster, backdrop, saveProgress]);

  // Reset click shield when switching server or episode
  const switchServer = (i: number) => {
    setActiveServer(i);
    setIframeError(false);
    setClickShieldCount(4);
  };

  const reactivateShield = () => {
    setClickShieldCount(4);
  };

  const handleShieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setClickShieldCount((prev) => Math.max(0, prev - 1));
  };

  const toggleNativeFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const currentUrl = isNativeAdFree
    ? (isTV
        ? `https://autoembed.co/tv/tmdb/${tmdbId}-${selectedSeason}-${selectedEpisode}`
        : `https://autoembed.co/movie/tmdb/${tmdbId}`)
    : (isTV
        ? STREAM_SERVERS[activeServer]?.getTvUrl(tmdbId, selectedSeason, selectedEpisode)
        : servers[activeServer]?.url);

  return (
    <div className="space-y-0">
      {/* Video Player Container */}
      <div ref={playerContainerRef} className="aspect-video w-full bg-black relative group overflow-hidden">
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10 flex-col gap-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
            <p className="text-gray-300">This server is unavailable. Try another server below.</p>
          </div>
        )}

        {/* Click-Shield Overlay */}
        {clickShieldCount > 0 && (
          <div
            onClick={handleShieldClick}
            className="absolute inset-0 z-20 cursor-pointer bg-transparent"
            title="Click to absorb popup ad layers"
          />
        )}

        <iframe
          key={`${currentUrl}-${activeServer}-${selectedEpisode}`}
          src={currentUrl}
          className="w-full h-full absolute inset-0 border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; display-capture"
          allowFullScreen
          // @ts-ignore
          webkitallowfullscreen="true"
          // @ts-ignore
          mozallowfullscreen="true"
          title={title}
          referrerPolicy="origin"
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
            <div className="flex gap-2 flex-wrap">
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

          <div className="flex items-center gap-3 flex-wrap">
            {/* Reactivate Shield Button */}
            <button
              onClick={reactivateShield}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 transition-all"
              title="Click to reactivate Ad-Shield if popups appear"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{clickShieldCount > 0 ? `Shield Active (${clickShieldCount} clicks left)` : 'Re-activate Shield'}</span>
              <RefreshCw className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Native Fullscreen Toggle Button */}
            <button
              onClick={toggleNativeFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>

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
        </div>

        <p className="text-[11px] text-gray-600 mt-2 max-w-[1400px] mx-auto">
          If popups reappear during playback, click &quot;Re-activate Shield&quot; above to instantly block ad triggers!
        </p>
      </div>
    </div>
  );
}
