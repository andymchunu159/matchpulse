/**
 * API-Football Free Plan currently supports standings
 * up to the 2024 season.
 *
 * When upgrading your subscription, simply update
 * MAX_SUPPORTED_STANDINGS_SEASON or return the
 * requested season directly.
 */

export const MAX_SUPPORTED_STANDINGS_SEASON = 2024;

export function getSupportedStandingsSeason(
  season: number
): number {
  return Math.min(
    season,
    MAX_SUPPORTED_STANDINGS_SEASON
  );
}