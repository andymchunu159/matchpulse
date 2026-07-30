export interface LeagueGroup {
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  matches: any[];
}

export function groupMatchesByLeague(
  matches: any[]
): LeagueGroup[] {
  const grouped = new Map<number, LeagueGroup>();

  matches.forEach((match) => {
    const leagueId = match.league.id;

    if (!grouped.has(leagueId)) {
      grouped.set(leagueId, {
        league: {
          id: leagueId,
          name: match.league.name,
          logo: match.league.logo,
          country: match.league.country,
        },
        matches: [],
      });
    }

    grouped.get(leagueId)!.matches.push(match);
  });

  return Array.from(grouped.values());
}