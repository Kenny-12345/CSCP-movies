'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus } from 'lucide-react';
import Link from 'next/link';

interface ContentItem {
  id: string;
  title: string;
  posterPath: string;
  type?: string;
}

export default function ContentCarousel({ title, items }: { title: string, items: ContentItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4 py-6 px-4 md:px-6 relative group">
      <h2 className="text-xl md:text-2xl font-bold text-white/90">{title}</h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 z-40 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 rounded-r h-full flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
        >
          {items.map((item) => (
            <Link href={`/watch/${item.type || 'movie'}/${item.id}`} key={item.id}>
              <div 
                className="snap-start flex-none w-[140px] md:w-[200px] lg:w-[240px] aspect-[2/3] relative rounded-md overflow-hidden group/card cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30 origin-center bg-gray-900"
              >
                <img 
                  src={item.posterPath} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-sm truncate mb-3">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <button className="bg-white rounded-full p-2 hover:bg-white/80 transition-colors">
                      <Play className="w-4 h-4 text-black fill-black" />
                    </button>
                    <button className="border border-white/50 rounded-full p-2 hover:bg-white/20 transition-colors">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 z-40 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 rounded-l h-full flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
