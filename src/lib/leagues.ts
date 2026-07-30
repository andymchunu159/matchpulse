export interface LeagueOption {
  id: number;
  name: string;
  country: string;
  season: number;
  logo: string;
}

export const LEAGUES: LeagueOption[] = [
  {
    id: 39,
    name: "Premier League",
    country: "England",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/39.png",
  },
  {
    id: 140,
    name: "La Liga",
    country: "Spain",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/140.png",
  },
  {
    id: 135,
    name: "Serie A",
    country: "Italy",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/135.png",
  },
  {
    id: 78,
    name: "Bundesliga",
    country: "Germany",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/78.png",
  },
  {
    id: 61,
    name: "Ligue 1",
    country: "France",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/61.png",
  },
  {
    id: 288,
    name: "Premier Soccer League",
    country: "South Africa",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/288.png",
  },
  {
    id: 2,
    name: "UEFA Champions League",
    country: "Europe",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/2.png",
  },
  {
    id: 3,
    name: "UEFA Europa League",
    country: "Europe",
    season: 2024,
    logo: "https://media.api-sports.io/football/leagues/3.png",
  },
];