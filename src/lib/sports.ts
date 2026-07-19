// ─── Sports API ──────────────────────────────────────────────────────────────
// Fetches live/upcoming events from ESPN's free public API.
// No API key required.

export interface SportEvent {
  id: string;
  name: string;
  date: string;
  status: 'live' | 'scheduled' | 'completed';
  statusDetail: string;
  homeTeam: { name: string; logo: string; score: string };
  awayTeam: { name: string; logo: string; score: string };
  league: string;
  streamLinks: { name: string; url: string }[];
}

export interface SportLeague {
  id: string;
  name: string;
  endpoint: string;
  streamSearchBase: string;
}

export const SPORT_LEAGUES: Record<string, SportLeague[]> = {
  football: [
    { id: 'eng.1', name: 'Premier League', endpoint: 'soccer/eng.1', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
    { id: 'esp.1', name: 'La Liga', endpoint: 'soccer/esp.1', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
    { id: 'ger.1', name: 'Bundesliga', endpoint: 'soccer/ger.1', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
    { id: 'ita.1', name: 'Serie A', endpoint: 'soccer/ita.1', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
    { id: 'fra.1', name: 'Ligue 1', endpoint: 'soccer/fra.1', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
    { id: 'uefa.champions', name: 'Champions League', endpoint: 'soccer/uefa.champions', streamSearchBase: 'https://sportsurge.net/#/groups/1' },
  ],
  f1: [
    { id: 'f1', name: 'Formula 1', endpoint: 'racing/f1', streamSearchBase: 'https://sportsurge.net/#/groups/7' },
  ],
  basketball: [
    { id: 'nba', name: 'NBA', endpoint: 'basketball/nba', streamSearchBase: 'https://sportsurge.net/#/groups/2' },
  ],
  tennis: [
    { id: 'atp', name: 'ATP Tour', endpoint: 'tennis/atp', streamSearchBase: 'https://sportsurge.net/#/groups/8' },
    { id: 'wta', name: 'WTA Tour', endpoint: 'tennis/wta', streamSearchBase: 'https://sportsurge.net/#/groups/8' },
  ],
  baseball: [
    { id: 'mlb', name: 'MLB', endpoint: 'baseball/mlb', streamSearchBase: 'https://sportsurge.net/#/groups/4' },
  ],
  hockey: [
    { id: 'nhl', name: 'NHL', endpoint: 'hockey/nhl', streamSearchBase: 'https://sportsurge.net/#/groups/3' },
  ],
  mma: [
    { id: 'ufc', name: 'UFC', endpoint: 'mma/ufc', streamSearchBase: 'https://sportsurge.net/#/groups/6' },
  ],
  rugby: [
    { id: 'sixnations', name: 'Six Nations', endpoint: 'rugby/270557', streamSearchBase: 'https://sportsurge.net/#/groups/9' },
  ],
};

function getStreamLinks(teamNames: string[]): { name: string; url: string }[] {
  const query = encodeURIComponent(teamNames.join(' '));
  return [
    { name: 'GoalDaddy TV', url: `https://www.goaldaddy.info/?s=${query}` },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvent(event: any, league: SportLeague): SportEvent {
  const comp = event.competitions?.[0];
  const home = comp?.competitors?.find((c: any) => c.homeAway === 'home') || comp?.competitors?.[0];
  const away = comp?.competitors?.find((c: any) => c.homeAway === 'away') || comp?.competitors?.[1];

  const statusName = event.status?.type?.name || '';
  let status: 'live' | 'scheduled' | 'completed' = 'scheduled';
  if (statusName === 'STATUS_IN_PROGRESS' || statusName === 'STATUS_HALFTIME' || statusName === 'STATUS_FIRST_HALF' || statusName === 'STATUS_SECOND_HALF') {
    status = 'live';
  } else if (statusName === 'STATUS_FINAL' || statusName === 'STATUS_FULL_TIME') {
    status = 'completed';
  }

  const homeTeamName = home?.team?.displayName || home?.team?.name || 'TBD';
  const awayTeamName = away?.team?.displayName || away?.team?.name || 'TBD';

  return {
    id: event.id,
    name: event.name || `${homeTeamName} vs ${awayTeamName}`,
    date: event.date,
    status,
    statusDetail: event.status?.type?.shortDetail || event.status?.type?.description || '',
    homeTeam: {
      name: homeTeamName,
      logo: home?.team?.logo || '',
      score: home?.score || '0',
    },
    awayTeam: {
      name: awayTeamName,
      logo: away?.team?.logo || '',
      score: away?.score || '0',
    },
    league: league.name,
    streamLinks: getStreamLinks([homeTeamName, awayTeamName]),
  };
}

export async function fetchSportEvents(sportId: string): Promise<{ league: string; events: SportEvent[] }[]> {
  const leagues = SPORT_LEAGUES[sportId];
  if (!leagues) return [];

  const results = await Promise.all(
    leagues.map(async (league) => {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/${league.endpoint}/scoreboard`,
          { next: { revalidate: 60 } } // Cache for 60 seconds
        );
        if (!res.ok) return { league: league.name, events: [] };
        const data = await res.json();
        const events = (data.events || []).map((e: any) => parseEvent(e, league));
        return { league: league.name, events };
      } catch {
        return { league: league.name, events: [] };
      }
    })
  );

  return results.filter(r => r.events.length > 0);
}
