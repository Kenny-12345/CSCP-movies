import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  try {
    const targetParsed = new URL(targetUrl);
    const originUrl = targetParsed.origin; // e.g. https://remoteconsultinggroup.site
    const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://vidsrc.to/',
        Origin: 'https://vidsrc.to',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const isM3u8 = targetUrl.includes('.m3u8') || contentType.includes('mpegurl');

    if (isM3u8) {
      let manifestText = await response.text();

      // Rewrite relative & absolute URLs inside the .m3u8 playlist to route through /api/proxy
      const proxyBase = '/api/proxy?url=';

      manifestText = manifestText.replace(/^(?!#)(.+)$/gm, (line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        let absoluteLineUrl = '';
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          absoluteLineUrl = trimmed;
        } else if (trimmed.startsWith('/')) {
          absoluteLineUrl = `${originUrl}${trimmed}`;
        } else {
          absoluteLineUrl = `${baseUrl}${trimmed}`;
        }

        return `${proxyBase}${encodeURIComponent(absoluteLineUrl)}`;
      });

      return new NextResponse(manifestText, {
        status: response.status,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-cache',
        },
      });
    } else {
      // Binary video segments (.ts, .m4s, .mp4)
      const body = await response.arrayBuffer();
      return new NextResponse(body, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'video/MP2T',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
