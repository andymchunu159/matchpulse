import { API_DEFAULT_SEASON } from "./config";

export interface LeagueOption {
  id: number;
  code: string;
  name: string;
  country: string;
  season: number;
  logo: string;
}

export const LEAGUES: LeagueOption[] = [
  {
    id: 39,
    code: "PL",
    name: "Premier League",
    country: "England",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/39.png",
  },

  {
    id: 140,
    code: "PD",
    name: "La Liga",
    country: "Spain",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/140.png",
  },

  {
    id: 135,
    code: "SA",
    name: "Serie A",
    country: "Italy",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/135.png",
  },

  {
    id: 78,
    code: "BL1",
    name: "Bundesliga",
    country: "Germany",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/78.png",
  },

  {
    id: 61,
    code: "FL1",
    name: "Ligue 1",
    country: "France",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/61.png",
  },

  {
    id: 2,
    code: "CL",
    name: "UEFA Champions League",
    country: "Europe",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/2.png",
  },

  {
    id: 3,
    code: "EL",
    name: "UEFA Europa League",
    country: "Europe",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/3.png",
  },

  {
    id: 288,
    code: "PSL",
    name: "Premier Soccer League",
    country: "South Africa",
    season: API_DEFAULT_SEASON,
    logo: "https://media.api-sports.io/football/leagues/288.png",
  },
];