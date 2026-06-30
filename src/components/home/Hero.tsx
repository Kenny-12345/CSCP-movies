import Link from 'next/link';
import { Play, Info } from 'lucide-react';

interface HeroProps {
  title: string;
  overview: string;
  backdrop: string;
  year: string;
  rating: string;
  id: string;
  type: string;
}

export default function Hero({ title, overview, backdrop, year, rating, id, type }: HeroProps) {
  return (
    <div className="relative h-[85vh] w-full flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {backdrop && (
          <img
            src={backdrop}
            alt={title}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11] via-[#0f0f11]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pb-32">
        <div className="max-w-2xl space-y-5">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-sm font-medium text-white/80">
            <span className="text-green-400 font-bold">⭐ {rating}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span>{year}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="border border-white/30 px-2 py-0.5 rounded text-xs">HD</span>
          </div>

          <p className="text-base md:text-lg text-white/80 leading-relaxed line-clamp-3">
            {overview}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/watch/${type}/${id}`}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md hover:bg-white/90 transition-all font-bold text-lg shadow-2xl hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 fill-black" />
              Play
            </Link>
            <Link
              href={`/watch/${type}/${id}`}
              className="flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-md hover:bg-white/20 transition-all font-semibold backdrop-blur-md border border-white/10 text-lg"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
