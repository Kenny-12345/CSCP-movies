import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'movie';
  const id = searchParams.get('id');
  const season = searchParams.get('season') || '1';
  const episode = searchParams.get('episode') || '1';

  if (!id) {
    return NextResponse.json({ error: 'Missing TMDB ID' }, { status: 400 });
  }

  // URL of dedicated backend Puppeteer scraper service (local or Railway/Render)
  const SCRAPER_SERVICE_URL = process.env.SCRAPER_SERVICE_URL || 'http://localhost:4000';

  try {
    const extractUrl = `${SCRAPER_SERVICE_URL}/extract?type=${type}&id=${id}&season=${season}&episode=${episode}`;
    const res = await fetch(extractUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.streamUrl) {
        return NextResponse.json({
          success: true,
          streamUrl: data.streamUrl,
          provider: 'HeadlessAdFreeScraper',
        });
      }
    }
  } catch (err) {
    console.log('Backend scraper offline or indexing:', (err as Error).message);
  }

  // Fallback if backend scraper service is starting up
  const isTv = type === 'tv';
  const fallbackUrl = isTv
    ? `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`
    : `https://autoembed.co/movie/tmdb/${id}`;

  return NextResponse.json({
    success: true,
    streamUrl: fallbackUrl,
    provider: 'AutoEmbedFallback',
  });
}
