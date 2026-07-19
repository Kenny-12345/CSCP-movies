'use client';

import { useState, useRef, useEffect } from 'react';
import { MonitorPlay, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import Hls from 'hls.js';

interface HlsStream {
  name: string;
  url: string;
}

interface SportStreamPlayerProps {
  streams: HlsStream[];
  title: string;
}

export default function SportStreamPlayer({ streams, title }: SportStreamPlayerProps) {
  const [activeStream, setActiveStream] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(false);
    setLoading(true);

    const streamUrl = streams[activeStream]?.url;
    if (!streamUrl) return;

    // Destroy previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(true);
          setLoading(false);
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            // Try to recover once
            hls.startLoad();
          } else {
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setError(true);
        setLoading(false);
      });
    } else {
      setError(true);
      setLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeStream, streams]);

  const switchStream = (i: number) => {
    setActiveStream(i);
    setError(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="space-y-0">
      {/* Video Player */}
      <div className="aspect-video w-full bg-black relative group">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10 flex-col gap-3">
            <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading stream...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10 flex-col gap-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
            <p className="text-gray-300">This stream is unavailable. Try another channel below.</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full absolute inset-0 bg-black"
          muted={muted}
          autoPlay
          playsInline
          controls
        />
        {/* Unmute overlay - shows when muted */}
        {muted && !error && !loading && (
          <button
            onClick={toggleMute}
            className="absolute bottom-16 right-4 z-20 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm border border-white/20"
          >
            <VolumeX className="w-4 h-4" />
            Click to unmute
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-[#141416] border-t border-white/5 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <MonitorPlay className="w-4 h-4 text-gray-500 hidden sm:block" />
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Channel:</span>
            <div className="flex gap-2 flex-wrap">
              {streams.map((stream, i) => (
                <button
                  key={i}
                  onClick={() => switchStream(i)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all ${
                    activeStream === i
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {stream.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
        <p className="text-[11px] text-gray-600 mt-2 max-w-[1400px] mx-auto">
          If a channel is down, try switching to another one above. Streams auto-start muted — click to unmute.
        </p>
      </div>
    </div>
  );
}
