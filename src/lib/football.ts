const BASE_URL = `https://${process.env.API_FOOTBALL_HOST}`;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number |null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };

  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };

  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };

    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };

  goals: {
    home: number | null;
    away: number | null;
  };

  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };

    fulltime: {
      home: number | null;
      away: number | null;
    };

    extratime: {
      home: number | null;
      away: number | null;
    };

    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface ApiResponse<T> {
  response: T;
}

/* -------------------------------------------------------------------------- */
/*                                API Helper                                  */
/* -------------------------------------------------------------------------- */

export async function footballFetch<T = any>(
  endpoint: string
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      headers: {
        "x-apisports-key":
          process.env.API_FOOTBALL_KEY!,
      },
      next: {
        revalidate: 30,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Football API Error: ${response.status}`
    );
  }

  return response.json();
}