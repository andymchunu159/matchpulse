import type { PredictionMatchInput } from "./prompt";

const TAVILY_API_URL =
  "https://api.tavily.com/search";

const TAVILY_MAX_RESULTS = 12;
const MAX_SELECTED_SOURCES = 8;

const MIN_PREFERRED_SOURCES = 4;

const TAVILY_TIMEOUT_MS = 15000;

/* ============================================================
 * TYPES
 * ============================================================
 */

interface TavilySearchResult {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
}

interface TavilyResponse {
  query?: string;
  answer?: string | null;
  results?: TavilySearchResult[];
}

type SourceType =
  | "official"
  | "statistics"
  | "major-news"
  | "sports-media"
  | "football-data"
  | "video"
  | "social"
  | "betting"
  | "prediction"
  | "seo"
  | "other";

type SourceQuality =
  | "high"
  | "medium"
  | "low";

interface ResearchSource {
  title: string;
  url: string;
  content: string;
  score: number | null;
  domain: string;
  sourceType: SourceType;
  quality: SourceQuality;
  relevance: number;
}

export interface PredictionResearch {
  query: string;
  answer: string | null;

  sources: Array<{
    title: string;
    url: string;
    content: string;
    score: number | null;
  }>;
}

/* ============================================================
 * DOMAIN LISTS
 * ============================================================
 */

const OFFICIAL_DOMAINS = [
  "liverpoolfc.com",
  "arsenal.com",
  "premierleague.com",
  "uefa.com",
  "thefa.com",
  "fifa.com",
];

const STATISTICS_DOMAINS = [
  "statmuse.com",
  "fbref.com",
  "understat.com",
  "worldfootball.net",
  "soccerway.com",
  "stathead.com",
];

const MAJOR_NEWS_DOMAINS = [
  "bbc.com",
  "bbc.co.uk",
  "reuters.com",
  "theguardian.com",
  "skysports.com",
  "telegraph.co.uk",
  "independent.co.uk",
  "thetimes.co.uk",
  "apnews.com",
];

const SPORTS_MEDIA_DOMAINS = [
  "sports.yahoo.com",
  "yahoo.com",
  "yahoo.co.uk",
  "goal.com",
  "fourfourtwo.com",
  "football365.com",
  "espn.com",
  "cbssports.com",
  "nbcsports.com",
];

const FOOTBALL_DATA_DOMAINS = [
  "whoscored.com",
  "transfermarkt.com",
  "sofascore.com",
  "fotmob.com",
  "365scores.com",
  "flashscore.com",
  "footystats.org",
];

const BETTING_DOMAINS = [
  "bet365.com",
  "betway.com",
  "betfair.com",
  "paddypower.com",
  "williamhill.com",
  "unibet.com",
  "ladbrokes.com",
  "betvictor.com",
  "oddschecker.com",
  "protipster.com",
];

const PREDICTION_DOMAINS = [
  "forebet.com",
  "predictz.com",
  "windrawwin.com",
  "predictfootball.com",
];

const SOCIAL_DOMAINS = [
  "instagram.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "tiktok.com",
];

const VIDEO_DOMAINS = [
  "youtube.com",
  "youtu.be",
];

/* ============================================================
 * DOMAIN HELPERS
 * ============================================================
 */

function getDomain(url: string): string {
  try {
    return new URL(url)
      .hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return "";
  }
}

function domainMatches(
  domain: string,
  allowedDomain: string,
): boolean {
  return (
    domain === allowedDomain ||
    domain.endsWith(`.${allowedDomain}`)
  );
}

function matchesAnyDomain(
  domain: string,
  domains: string[],
): boolean {
  return domains.some((allowedDomain) =>
    domainMatches(domain, allowedDomain),
  );
}

/* ============================================================
 * TEXT HELPERS
 * ============================================================
 */

function normalizeText(
  value: string | undefined,
): string {
  return value?.toLowerCase() ?? "";
}

function containsLowValueSignals(
  title: string,
  url: string,
  content: string,
): boolean {
  const text =
    `${title} ${url} ${content}`.toLowerCase();

  const terms = [
    "betting tips",
    "best bets",
    "betting prediction",
    "football prediction",
    "match prediction",
    "correct score prediction",
    "free betting tips",
    "sure win",
    "100% win",
    "fixed match",
    "accumulator tips",
    "acca tips",
    "betting advice",
  ];

  return terms.some((term) =>
    text.includes(term),
  );
}

/* ============================================================
 * CLASSIFICATION
 * ============================================================
 */

function classifySource(
  domain: string,
  title: string,
  url: string,
  content: string,
): SourceType {
  if (
    matchesAnyDomain(
      domain,
      OFFICIAL_DOMAINS,
    )
  ) {
    return "official";
  }

  if (
    matchesAnyDomain(
      domain,
      STATISTICS_DOMAINS,
    )
  ) {
    return "statistics";
  }

  if (
    matchesAnyDomain(
      domain,
      MAJOR_NEWS_DOMAINS,
    )
  ) {
    return "major-news";
  }

  if (
    matchesAnyDomain(
      domain,
      SPORTS_MEDIA_DOMAINS,
    )
  ) {
    return "sports-media";
  }

  if (
    matchesAnyDomain(
      domain,
      FOOTBALL_DATA_DOMAINS,
    )
  ) {
    return "football-data";
  }

  if (
    matchesAnyDomain(
      domain,
      VIDEO_DOMAINS,
    )
  ) {
    return "video";
  }

  if (
    matchesAnyDomain(
      domain,
      SOCIAL_DOMAINS,
    )
  ) {
    return "social";
  }

  if (
    matchesAnyDomain(
      domain,
      BETTING_DOMAINS,
    )
  ) {
    return "betting";
  }

  if (
    matchesAnyDomain(
      domain,
      PREDICTION_DOMAINS,
    )
  ) {
    return "prediction";
  }

  if (
    containsLowValueSignals(
      title,
      url,
      content,
    )
  ) {
    return "prediction";
  }

  return "other";
}

function classifyQuality(
  sourceType: SourceType,
): SourceQuality {
  switch (sourceType) {
    case "official":
    case "statistics":
      return "high";

    case "major-news":
    case "sports-media":
    case "football-data":
      return "medium";

    default:
      return "low";
  }
}

/* ============================================================
 * SEASON
 * ============================================================
 */

function getSeasonLabel(
  fixtureDate: string,
): string {
  const date =
    new Date(
      `${fixtureDate}T12:00:00Z`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const year =
    date.getUTCFullYear();

  const month =
    date.getUTCMonth() + 1;

  const startYear =
    month >= 8
      ? year
      : year - 1;

  return `${startYear}/${startYear + 1}`;
}

/* ============================================================
 * RELEVANCE
 * ============================================================
 */

function calculateRelevance(
  result: TavilySearchResult,
  match: PredictionMatchInput,
  sourceType: SourceType,
): number {
  const title =
    normalizeText(result.title);

  const content =
    normalizeText(result.content);

  const url =
    normalizeText(result.url);

  const home =
    normalizeText(match.homeTeam);

  const away =
    normalizeText(match.awayTeam);

  const competition =
    normalizeText(match.competition);

  const season =
    getSeasonLabel(
      match.fixtureDate,
    );

  let score = 0;

  /* Teams */

  if (title.includes(home)) {
    score += 15;
  }

  if (title.includes(away)) {
    score += 15;
  }

  if (content.includes(home)) {
    score += 8;
  }

  if (content.includes(away)) {
    score += 8;
  }

  /* Competition */

  if (
    title.includes(competition)
  ) {
    score += 10;
  }

  if (
    content.includes(competition)
  ) {
    score += 5;
  }

  /* Date / season */

  if (
    season &&
    (
      title.includes(season) ||
      content.includes(season)
    )
  ) {
    score += 8;
  }

  if (
    title.includes(
      match.fixtureDate,
    ) ||
    content.includes(
      match.fixtureDate,
    )
  ) {
    score += 8;
  }

  /* Useful football evidence */

  const usefulTerms = [
    "preview",
    "team news",
    "injury",
    "injuries",
    "suspension",
    "suspended",
    "availability",
    "fitness",
    "lineup",
    "starting xi",
    "form",
    "recent results",
    "home form",
    "away form",
    "goals scored",
    "goals conceded",
    "clean sheets",
    "xg",
    "xga",
    "expected goals",
    "shots",
    "shots on target",
    "big chances",
    "head to head",
    "h2h",
    "tactical",
    "manager",
    "pressing",
    "transition",
    "set pieces",
    "league position",
    "points",
    "goal difference",
    "rest",
    "rotation",
  ];

  for (
    const term of usefulTerms
  ) {
    if (title.includes(term)) {
      score += 4;
    }

    if (content.includes(term)) {
      score += 2;
    }
  }

  /* Source quality */

  switch (sourceType) {
    case "official":
      score += 35;
      break;

    case "statistics":
      score += 30;
      break;

    case "major-news":
      score += 28;
      break;

    case "sports-media":
      score += 22;
      break;

    case "football-data":
      score += 14;
      break;

    case "video":
      score -= 10;
      break;

    case "social":
      score -= 25;
      break;

    case "betting":
    case "prediction":
    case "seo":
      score -= 50;
      break;
  }

  /* URL signals */

  if (
    url.includes("preview") ||
    url.includes("team-news") ||
    url.includes("injury") ||
    url.includes("squad") ||
    url.includes("lineup")
  ) {
    score += 5;
  }

  return Math.min(
    100,
    Math.max(0, score),
  );
}

/* ============================================================
 * QUERY BUILDING
 *
 * IMPORTANT:
 *
 * Do NOT send every possible research concept in one giant
 * Tavily query. Search engines perform better with focused
 * intent.
 * ============================================================
 */

function buildPrimaryQuery(
  match: PredictionMatchInput,
): string {
  return [
    `"${match.homeTeam}" vs "${match.awayTeam}"`,
    `"${match.competition}"`,
    `"${match.fixtureDate}"`,
    "match preview",
    "team news",
    "injuries",
    "suspensions",
    "player availability",
    "manager comments",
    "probable lineup",
    "recent form",
    "recent results",
    "home form",
    "away form",
    "official club sources",
    "official competition sources",
  ].join(" ");
}

function buildFallbackQuery(
  match: PredictionMatchInput,
): string {
  return [
    `"${match.homeTeam}"`,
    `"${match.awayTeam}"`,
    `"${match.competition}"`,
    "latest",
    "preview",
    "injury news",
    "team news",
    "form",
    "lineup",
    "head to head",
  ].join(" ");
}

function buildStatisticsQuery(
  match: PredictionMatchInput,
): string {
  return [
    `"${match.homeTeam}"`,
    `"${match.awayTeam}"`,
    `"${match.competition}"`,
    "statistics",
    "xG",
    "xGA",
    "goals",
    "shots",
    "shots on target",
    "clean sheets",
    "recent results",
    "home form",
    "away form",
    "head to head",
  ].join(" ");
}

/* ============================================================
 * URL NORMALIZATION
 * ============================================================
 */

function normalizeUrl(
  url: string,
): string {
  return url
    .trim()
    .toLowerCase()
    .replace(
      /^https?:\/\//,
      "",
    )
    .replace(
      /^www\./,
      "",
    )
    .replace(
      /\/$/,
      "",
    );
}

/* ============================================================
 * DEDUPLICATION
 * ============================================================
 */

function deduplicateSources(
  results: TavilySearchResult[],
): TavilySearchResult[] {
  const seen =
    new Set<string>();

  return results.filter(
    (result) => {
      if (
        typeof result.url !==
        "string"
      ) {
        return false;
      }

      const normalized =
        normalizeUrl(
          result.url,
        );

      if (
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    },
  );
}

/* ============================================================
 * NORMALIZATION
 * ============================================================
 */

function normalizeSources(
  results: TavilySearchResult[],
  match: PredictionMatchInput,
): ResearchSource[] {
  return results
    .filter(
      (result) =>
        typeof result.title ===
          "string" &&
        typeof result.url ===
          "string" &&
        typeof result.content ===
          "string" &&
        result.content.trim()
          .length > 0,
    )
    .map(
      (result) => {
        const title =
          result.title as string;

        const url =
          result.url as string;

        const content =
          result.content as string;

        const domain =
          getDomain(url);

        const sourceType =
          classifySource(
            domain,
            title,
            url,
            content,
          );

        const quality =
          classifyQuality(
            sourceType,
          );

        return {
          title,
          url,
          content,

          score:
            typeof result.score ===
            "number"
              ? result.score
              : null,

          domain,
          sourceType,
          quality,

          relevance:
            calculateRelevance(
              result,
              match,
              sourceType,
            ),
        };
      },
    );
}

/* ============================================================
 * RANKING
 * ============================================================
 */

function getQualityRank(
  quality: SourceQuality,
): number {
  switch (quality) {
    case "high":
      return 3;

    case "medium":
      return 2;

    default:
      return 1;
  }
}

function getSourceTypeRank(
  sourceType: SourceType,
): number {
  switch (sourceType) {
    case "official":
      return 7;

    case "statistics":
      return 6;

    case "major-news":
      return 5;

    case "sports-media":
      return 4;

    case "football-data":
      return 3;

    case "other":
      return 2;

    case "video":
      return 1;

    default:
      return 0;
  }
}

/* ============================================================
 * SOURCE SELECTION
 * ============================================================
 */

function selectBestSources(
  sources: ResearchSource[],
): ResearchSource[] {
  const usable =
    sources.filter(
      (source) =>
        source.sourceType !==
          "betting" &&
        source.sourceType !==
          "prediction" &&
        source.sourceType !==
          "seo" &&
        source.sourceType !==
          "social" &&
        source.sourceType !==
          "video",
    );

  const sorted =
    [...usable].sort(
      (a, b) => {
        const quality =
          getQualityRank(b.quality) -
          getQualityRank(a.quality);

        if (quality !== 0) {
          return quality;
        }

        const relevance =
          b.relevance -
          a.relevance;

        if (relevance !== 0) {
          return relevance;
        }

        const type =
          getSourceTypeRank(
            b.sourceType,
          ) -
          getSourceTypeRank(
            a.sourceType,
          );

        if (type !== 0) {
          return type;
        }

        return (
          (b.score ?? 0) -
          (a.score ?? 0)
        );
      },
    );

  const selected: ResearchSource[] =
    [];

  const selectedUrls =
    new Set<string>();

  const domainCounts =
    new Map<string, number>();

  const typeCounts =
    new Map<
      SourceType,
      number
    >();

  const MAX_PER_DOMAIN = 2;

  const MAX_PER_TYPE: Record<
    SourceType,
    number
  > = {
    official: 3,
    statistics: 2,
    "major-news": 2,
    "sports-media": 2,
    "football-data": 2,
    other: 1,
    video: 0,
    social: 0,
    betting: 0,
    prediction: 0,
    seo: 0,
  };

  for (
    const source of sorted
  ) {
    if (
      selected.length >=
      MAX_SELECTED_SOURCES
    ) {
      break;
    }

    const normalizedUrl =
      normalizeUrl(
        source.url,
      );

    if (
      selectedUrls.has(
        normalizedUrl,
      )
    ) {
      continue;
    }

    const domainCount =
      domainCounts.get(
        source.domain,
      ) ?? 0;

    if (
      domainCount >=
      MAX_PER_DOMAIN
    ) {
      continue;
    }

    const typeCount =
      typeCounts.get(
        source.sourceType,
      ) ?? 0;

    if (
      typeCount >=
      MAX_PER_TYPE[
        source.sourceType
      ]
    ) {
      continue;
    }

    /*
     * Hard minimum evidence threshold.
     *
     * A weak source with a good Tavily score is still weak.
     */
    if (
      source.relevance < 35
    ) {
      continue;
    }

    selected.push(source);

    selectedUrls.add(
      normalizedUrl,
    );

    domainCounts.set(
      source.domain,
      domainCount + 1,
    );

    typeCounts.set(
      source.sourceType,
      typeCount + 1,
    );
  }

  return selected;
}

/* ============================================================
 * TAVILY REQUEST
 * ============================================================
 */

async function executeTavilySearch(
  apiKey: string,
  query: string,
): Promise<TavilyResponse> {
  const response =
    await fetch(
      TAVILY_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            api_key: apiKey,
            query,

            search_depth:
              "advanced",

            topic:
              "general",

            max_results:
              TAVILY_MAX_RESULTS,

            include_answer:
              true,

            include_raw_content:
              false,
          }),

        signal:
          AbortSignal.timeout(
            TAVILY_TIMEOUT_MS,
          ),
      },
    );

  let data: TavilyResponse;

  try {
    data =
      (await response.json()) as TavilyResponse;
  } catch {
    throw new Error(
      "Tavily returned invalid JSON.",
    );
  }

  if (!response.ok) {
    console.error(
      "========== TAVILY API ERROR ==========",
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    console.error(
      "======================================",
    );

    throw new Error(
      `Tavily request failed with status ${response.status}.`,
    );
  }

  return data;
}

/* ============================================================
 * QUALITY LOGGING
 * ============================================================
 */

function logResearchQuality(
  sources: ResearchSource[],
): void {
  const counts = {
    official: 0,
    statistics: 0,
    majorNews: 0,
    sportsMedia: 0,
    footballData: 0,
    other: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (
    const source of sources
  ) {
    switch (
      source.sourceType
    ) {
      case "official":
        counts.official++;
        break;

      case "statistics":
        counts.statistics++;
        break;

      case "major-news":
        counts.majorNews++;
        break;

      case "sports-media":
        counts.sportsMedia++;
        break;

      case "football-data":
        counts.footballData++;
        break;

      default:
        counts.other++;
        break;
    }

    switch (
      source.quality
    ) {
      case "high":
        counts.high++;
        break;

      case "medium":
        counts.medium++;
        break;

      case "low":
        counts.low++;
        break;
    }
  }

  console.log(
    "========== RESEARCH QUALITY ==========",
  );

  console.log(
    `Total selected sources: ${sources.length}`,
  );

  console.log(
    `Official: ${counts.official}`,
  );

  console.log(
    `Statistics: ${counts.statistics}`,
  );

  console.log(
    `Major news: ${counts.majorNews}`,
  );

  console.log(
    `Sports media: ${counts.sportsMedia}`,
  );

  console.log(
    `Football data: ${counts.footballData}`,
  );

  console.log(
    `Other: ${counts.other}`,
  );

  console.log(
    `High quality: ${counts.high}`,
  );

  console.log(
    `Medium quality: ${counts.medium}`,
  );

  console.log(
    `Low quality: ${counts.low}`,
  );

  console.log(
    "======================================",
  );
}

/* ============================================================
 * MAIN RESEARCH FUNCTION
 * ============================================================
 */

export async function researchPrediction(
  match: PredictionMatchInput,
): Promise<PredictionResearch> {
  const apiKey =
    process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "TAVILY_API_KEY is not configured.",
    );
  }

  const primaryQuery =
    buildPrimaryQuery(match);

  console.log(
    "========== TAVILY RESEARCH START ==========",
  );

  console.log(
    `Researching: ${match.homeTeam} vs ${match.awayTeam}`,
  );

  console.log(
    `Competition: ${match.competition}`,
  );

  console.log(
    `Fixture date: ${match.fixtureDate}`,
  );

  console.log(
    `Season: ${
      getSeasonLabel(
        match.fixtureDate,
      ) || "Unknown"
    }`,
  );

  console.log(
    "Primary research query:",
  );

  console.log(
    primaryQuery,
  );

  const startedAt =
    Date.now();

  let primaryData:
    TavilyResponse;

  try {
    primaryData =
      await executeTavilySearch(
        apiKey,
        primaryQuery,
      );
  } catch (error) {
    console.error(
      "Primary Tavily search failed.",
    );

    console.error(error);

    throw new Error(
      "Tavily research request failed.",
    );
  }

  console.log(
    `Primary Tavily request completed in ${
      Date.now() - startedAt
    }ms`,
  );

  /*
   * ==========================================================
   * FIRST EVIDENCE PASS
   * ==========================================================
   */

  let allResults =
    deduplicateSources(
      primaryData.results ?? [],
    );

  let normalized =
    normalizeSources(
      allResults,
      match,
    );

  let selected =
    selectBestSources(
      normalized,
    );

  /*
   * ==========================================================
   * TARGETED FALLBACK
   *
   * Only execute additional searches when the first search
   * failed to produce enough useful evidence.
   * ==========================================================
   */

  if (
    selected.length <
    MIN_PREFERRED_SOURCES
  ) {
    console.warn(
      `Only ${selected.length} strong sources found. Running targeted fallback research.`,
    );

    const fallbackQueries = [
      buildFallbackQuery(match),
      buildStatisticsQuery(match),
    ];

    for (
      const fallbackQuery of
      fallbackQueries
    ) {
      if (
        selected.length >=
        MIN_PREFERRED_SOURCES
      ) {
        break;
      }

      console.log(
        "========== TAVILY FALLBACK ==========",
      );

      console.log(
        fallbackQuery,
      );

      try {
        const fallbackData =
          await executeTavilySearch(
            apiKey,
            fallbackQuery,
          );

        allResults =
          deduplicateSources([
            ...allResults,
            ...(fallbackData.results ??
              []),
          ]);

        normalized =
          normalizeSources(
            allResults,
            match,
          );

        selected =
          selectBestSources(
            normalized,
          );
      } catch (error) {
        console.warn(
          "Tavily fallback search failed.",
        );

        console.warn(error);
      }
    }
  }

  /*
   * ==========================================================
   * FINAL VALIDATION
   * ==========================================================
   */

  if (
    selected.length ===
    0
  ) {
    throw new Error(
      "Tavily returned no usable research sources.",
    );
  }

  if (
    selected.length <
    MIN_PREFERRED_SOURCES
  ) {
    console.warn(
      `Research evidence remains limited: ${selected.length} strong sources available.`,
    );
  }

  logResearchQuality(
    selected,
  );

  /*
   * ==========================================================
   * SOURCE LOGGING
   * ==========================================================
   */

  console.log(
    "========== TAVILY SOURCES ==========",
  );

  console.log(
    `Selected sources: ${selected.length}`,
  );

  selected.forEach(
    (source, index) => {
      console.log(
        `SOURCE ${index + 1}:`,
      );

      console.log(
        `Title: ${source.title}`,
      );

      console.log(
        `Domain: ${source.domain}`,
      );

      console.log(
        `Type: ${source.sourceType}`,
      );

      console.log(
        `Quality: ${source.quality}`,
      );

      console.log(
        `Relevance: ${source.relevance}`,
      );

      console.log(
        `URL: ${source.url}`,
      );

      console.log(
        `Score: ${
          source.score ?? "N/A"
        }`,
      );

      console.log(
        "------------------------------------",
      );
    },
  );

  console.log(
    "====================================",
  );

  console.log(
    "========== TAVILY RESEARCH COMPLETE ==========",
  );

  /*
   * ==========================================================
   * RETURN STABLE CONTRACT
   * ==========================================================
   */

  return {
    query: primaryQuery,

    answer:
      typeof primaryData.answer ===
      "string"
        ? primaryData.answer
        : null,

    sources:
      selected.map(
        (source) => ({
          title:
            source.title,

          url:
            source.url,

          content:
            source.content,

          score:
            source.score,
        }),
      ),
  };
}