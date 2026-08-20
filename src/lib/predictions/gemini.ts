import { GoogleGenAI } from "@google/genai";

import {
  buildPredictionPrompt,
  type PredictionMatchInput,
} from "./prompt";

import {
  researchPrediction,
  type PredictionResearch,
} from "./tavily";

import {
  predictionSchema,
  type Prediction,
} from "./types";

/**
 * ============================================================
 * MATCHPULSE PREDICTION INTELLIGENCE ENGINE
 * ============================================================
 *
 * Architecture:
 *
 * Tavily
 *   ↓
 * Source normalization
 *   ↓
 * Evidence classification
 *   ↓
 * Evidence quality scoring
 *   ↓
 * Gemini structured reasoning
 *   ↓
 * Zod validation
 *   ↓
 * Fixture validation
 *   ↓
 * Probability validation
 *   ↓
 * Quality gate
 *   ↓
 * Optional repair pass
 *
 * The goal is NOT to make Gemini sound intelligent.
 *
 * The goal is to make Gemini reason from evidence.
 */

const GEMINI_MODEL =
  "gemini-3.6-flash";

const GEMINI_REPAIR_MODEL =
  "gemini-3.6-flash";

const MAX_RESEARCH_SOURCES = 12;

const MINIMUM_ACCEPTABLE_QUALITY =
  45;

/**
 * ============================================================
 * GEMINI CLIENT
 * ============================================================
 */

function getGeminiClient(): GoogleGenAI {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * ============================================================
 * DOMAIN HELPERS
 * ============================================================
 */

function getDomain(
  url: string,
): string {
  try {
    return new URL(url)
      .hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isAuthoritativeDomain(
  domain: string,
): boolean {
  const authoritativeDomains = [
    "premierleague.com",
    "liverpoolfc.com",
    "arsenal.com",
    "uefa.com",
    "thefa.com",
    "fifa.com",
  ];

  return authoritativeDomains.some(
    (allowed) =>
      domain === allowed ||
      domain.endsWith(
        `.${allowed}`,
      ),
  );
}

function isStatisticsDomain(
  domain: string,
): boolean {
  const domains = [
    "statmuse.com",
    "fbref.com",
    "fotmob.com",
    "theanalyst.com",
    "statsperform.com",
  ];

  return domains.some(
    (allowed) =>
      domain === allowed ||
      domain.endsWith(
        `.${allowed}`,
      ),
  );
}

function isEstablishedMediaDomain(
  domain: string,
): boolean {
  const domains = [
    "bbc.com",
    "bbc.co.uk",
    "skysports.com",
    "espn.com",
    "reuters.com",
    "theguardian.com",
    "independent.co.uk",
  ];

  return domains.some(
    (allowed) =>
      domain === allowed ||
      domain.endsWith(
        `.${allowed}`,
      ),
  );
}

function isWeakDomain(
  domain: string,
): boolean {
  const indicators = [
    "betting",
    "bet",
    "prediction",
    "tips",
    "tipster",
    "coupon",
    "odds",
    "picks",
  ];

  return indicators.some(
    (indicator) =>
      domain.includes(indicator),
  );
}

/**
 * ============================================================
 * SOURCE QUALITY
 * ============================================================
 */

type SourceClassification =
  | "official"
  | "statistics"
  | "media"
  | "football-data"
  | "weak"
  | "unknown";

function classifySource(
  domain: string,
): SourceClassification {
  if (
    isAuthoritativeDomain(domain)
  ) {
    return "official";
  }

  if (
    isStatisticsDomain(domain)
  ) {
    return "statistics";
  }

  if (
    isEstablishedMediaDomain(
      domain,
    )
  ) {
    return "media";
  }

  if (
    isWeakDomain(domain)
  ) {
    return "weak";
  }

  return "football-data";
}

function getSourceQualityScore(
  classification: SourceClassification,
): number {
  switch (classification) {
    case "official":
      return 100;

    case "statistics":
      return 90;

    case "media":
      return 82;

    case "football-data":
      return 65;

    case "unknown":
      return 45;

    case "weak":
      return 15;
  }
}

/**
 * ============================================================
 * EVIDENCE CONTEXT
 * ============================================================
 */

function buildResearchContext(
  research: PredictionResearch,
): string {
  const sources =
    research.sources
      .slice(
        0,
        MAX_RESEARCH_SOURCES,
      )
      .map(
        (
          source,
          index,
        ) => {
          const domain =
            getDomain(
              source.url,
            );

          const classification =
            classifySource(
              domain,
            );

          const quality =
            getSourceQualityScore(
              classification,
            );

          return [
            `SOURCE ${index + 1}`,
            `Title: ${source.title}`,
            `Domain: ${
              domain || "unknown"
            }`,
            `URL: ${source.url}`,
            `Classification: ${classification}`,
            `Internal Quality Score: ${quality}/100`,
            `Tavily Relevance: ${
              source.score ??
              "N/A"
            }`,
            "",
            "SOURCE CONTENT:",
            source.content,
          ].join("\n");
        },
      )
      .join(
        "\n\n------------------------------------------\n\n",
      );

  const qualitySummary =
    calculateResearchQuality(
      research,
    );

  return `
==================================================
TAVILY RESEARCH EVIDENCE
==================================================

Research query:

${research.query}

Tavily answer:

${research.answer ??
  "No Tavily synthesis available."}

==================================================
RESEARCH QUALITY PROFILE
==================================================

Overall research quality:
${qualitySummary.score}/100

Official sources:
${qualitySummary.official}

Statistical sources:
${qualitySummary.statistics}

Established media:
${qualitySummary.media}

Weak sources:
${qualitySummary.weak}

Total sources:
${qualitySummary.total}

IMPORTANT:

Research quality measures the evidence package.

It does NOT mean every claim inside the package is true.

Gemini must independently evaluate:

- source authority
- temporal relevance
- fixture specificity
- corroboration
- contradiction
- factual support

==================================================
SOURCE EVIDENCE
==================================================

${sources}

==================================================
END TAVILY RESEARCH
==================================================
`;
}

/**
 * ============================================================
 * RESEARCH QUALITY
 * ============================================================
 */

function calculateResearchQuality(
  research: PredictionResearch,
): {
  score: number;
  official: number;
  statistics: number;
  media: number;
  weak: number;
  total: number;
} {
  const sources =
    research.sources.slice(
      0,
      MAX_RESEARCH_SOURCES,
    );

  if (
    sources.length === 0
  ) {
    return {
      score: 0,
      official: 0,
      statistics: 0,
      media: 0,
      weak: 0,
      total: 0,
    };
  }

  let totalQuality = 0;

  let official = 0;
  let statistics = 0;
  let media = 0;
  let weak = 0;

  for (const source of sources) {
    const domain =
      getDomain(
        source.url,
      );

    const classification =
      classifySource(
        domain,
      );

    const quality =
      getSourceQualityScore(
        classification,
      );

    totalQuality += quality;

    if (
      classification ===
      "official"
    ) {
      official++;
    }

    if (
      classification ===
      "statistics"
    ) {
      statistics++;
    }

    if (
      classification ===
      "media"
    ) {
      media++;
    }

    if (
      classification === "weak"
    ) {
      weak++;
    }
  }

  return {
    score: Math.round(
      totalQuality /
        sources.length,
    ),
    official,
    statistics,
    media,
    weak,
    total: sources.length,
  };
}

/**
 * ============================================================
 * GEMINI PROMPT
 * ============================================================
 */

function buildGeminiPrompt(
  match: PredictionMatchInput,
  research: PredictionResearch,
): string {
  return `
You are MatchPulse's production football prediction engine.

You are NOT a generic football chatbot.

You are an evidence-weighted probabilistic reasoning system.

==================================================
TARGET FIXTURE
==================================================

${match.homeTeam}
vs
${match.awayTeam}

Competition:
${match.competition}

Date:
${match.fixtureDate}

==================================================
PRIMARY RULE
==================================================

Use ONLY:

1. MatchPulse structured data supplied in the prompt.
2. Tavily research supplied in the prompt.

Do NOT perform another search.

Do NOT rely on hidden knowledge to fill missing information.

If information is missing:

MARK IT AS UNKNOWN.

Do not manufacture it.

==================================================
EVIDENCE DISCIPLINE
==================================================

Every factual statement in your analysis must be traceable to
the supplied evidence.

Historical information is allowed.

But label it mentally as historical.

Do not present historical information as current.

Current injury / suspension / availability information requires
current fixture-specific evidence.

==================================================
PROBABILITY ENGINE
==================================================

Construct the probability distribution from weighted evidence.

Consider:

A. Current form
B. Home/away form
C. Goals
D. Defensive performance
E. xG/xGA
F. Shots
G. Clean sheets
H. League context
I. Player availability
J. Tactical matchup
K. H2H
L. Venue
M. Rest / schedule

WEIGHTING PRINCIPLE:

Current statistical evidence > historical reputation.

Current fixture-specific team news > old team news.

Direct official evidence > aggregator.

H2H is supporting evidence, NOT the primary model.

==================================================
ANTI-GENERIC REQUIREMENT
==================================================

Your final analysis must be impossible to reuse unchanged for
another fixture.

Therefore it must include concrete fixture-specific evidence.

Do NOT write:

"Both teams are strong."

Do NOT write:

"Liverpool have home advantage."

Do NOT write:

"Arsenal are defensively solid."

UNLESS the supplied evidence gives specific supporting information.

Instead:

"Supplied evidence reports..."

"Official match records show..."

"The supplied recent results indicate..."

"The statistical evidence reports..."

If the number is not supplied:

DO NOT INVENT IT.

==================================================
CONTRADICTION HANDLING
==================================================

If sources conflict:

- identify the contradiction internally
- prefer official
- prefer recent
- prefer fixture-specific
- prefer corroborated

If unresolved:

treat as uncertain.

Do not turn uncertainty into a player injury.

Do not turn uncertainty into a suspension.

Do not turn uncertainty into a confirmed absence.

==================================================
CONFIDENCE
==================================================

Confidence represents evidence reliability.

NOT outcome probability.

Reduce confidence when:

- research is sparse
- sources conflict
- current lineup information is missing
- injury information is unresolved
- statistics are incomplete
- fixture is early in the season

==================================================
GOAL PROBABILITIES
==================================================

Ensure:

Over 1.5 >= Over 2.5 >= Over 3.5

BTTS Yes + BTTS No = 100

Do not select goal probabilities based on reputation.

Use available:

- scoring
- conceding
- xG
- xGA
- shots
- recent results
- venue performance
- tactical context

==================================================
1X2
==================================================

Home Win + Draw + Away Win = 100.

The distribution should reflect the evidence.

==================================================
DOUBLE CHANCE
==================================================

1X = Home Win + Draw

X2 = Draw + Away Win

12 = Home Win + Away Win

Choose the strongest logical combination.

==================================================
MOST LIKELY SCORE
==================================================

Do NOT default to:

1-1

2-1

1-0

Choose the score that best matches the overall scoring
distribution and tactical evidence.

==================================================
KEY FACTORS
==================================================

Return 4-6 concrete factors.

Each must contain an actual reason.

Avoid generic football language.

==================================================
RISKS
==================================================

Return 3-5 concrete risks.

They must arise from the actual evidence package.

==================================================
ANALYSIS
==================================================

Return a detailed but concise fixture-specific analysis.

It must cover:

1. Match context
2. Statistical evidence
3. Home/away situation
4. Tactical matchup
5. Player availability ONLY if supported
6. Why the probabilities are distributed this way
7. Main uncertainty

Do not merely repeat keyFactors.

==================================================
FINAL INTERNAL AUDIT
==================================================

Before responding:

- Verify fixture identity.
- Verify date.
- Verify competition.
- Verify every statistic.
- Verify every injury claim.
- Verify every suspension claim.
- Verify every lineup claim.
- Separate current from historical.
- Check contradictions.
- Check H2H weighting.
- Check probability totals.
- Check score consistency.
- Check confidence.
- Check whether the analysis is genuinely fixture-specific.

If information is missing, preserve uncertainty.

==================================================

${buildPredictionPrompt(
  match,
)}

==================================================

${buildResearchContext(
  research,
)}

==================================================

Return ONLY valid JSON.
`;
}

/**
 * ============================================================
 * GEMINI SCHEMA
 * ============================================================
 */

const GEMINI_RESPONSE_SCHEMA =
  {
    type: "object",

    properties: {
      match: {
        type: "object",

        properties: {
          homeTeam: {
            type: "string",
          },

          awayTeam: {
            type: "string",
          },

          competition: {
            type: "string",
          },

          fixtureDate: {
            type: "string",
          },
        },

        required: [
          "homeTeam",
          "awayTeam",
          "competition",
          "fixtureDate",
        ],
      },

      prediction: {
        type: "object",

        properties: {
          homeWin: {
            type: "number",
          },

          draw: {
            type: "number",
          },

          awayWin: {
            type: "number",
          },

          over15: {
            type: "number",
          },

          over25: {
            type: "number",
          },

          over35: {
            type: "number",
          },

          bttsYes: {
            type: "number",
          },

          bttsNo: {
            type: "number",
          },

          mostLikelyScore: {
            type: "string",
          },

          doubleChance: {
            type: "string",

            enum: [
              "1X",
              "X2",
              "12",
            ],
          },

          confidence: {
            type: "number",
          },
        },

        required: [
          "homeWin",
          "draw",
          "awayWin",
          "over15",
          "over25",
          "over35",
          "bttsYes",
          "bttsNo",
          "mostLikelyScore",
          "doubleChance",
          "confidence",
        ],
      },

      analysis: {
        type: "string",
      },

      keyFactors: {
        type: "array",

        items: {
          type: "string",
        },
      },

      risks: {
        type: "array",

        items: {
          type: "string",
        },
      },
    },

    required: [
      "match",
      "prediction",
      "analysis",
      "keyFactors",
      "risks",
    ],
  } as const;

/**
 * ============================================================
 * GEMINI REQUEST
 * ============================================================
 */

async function requestGemini(
  ai: GoogleGenAI,
  prompt: string,
  model: string,
): Promise<string> {
  const response =
    await ai.models.generateContent(
      {
        model,

        contents: prompt,

        config: {
          temperature: 0.2,

          responseMimeType:
            "application/json",

          responseSchema:
            GEMINI_RESPONSE_SCHEMA,
        },
      },
    );

  const text =
    response.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response.",
    );
  }

  return text;
}

/**
 * ============================================================
 * JSON PARSING
 * ============================================================
 */

function parseGeminiJson(
  text: string,
): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Gemini returned invalid JSON.",
    );
  }
}

/**
 * ============================================================
 * FIXTURE VALIDATION
 * ============================================================
 */

function validateFixtureIdentity(
  match: PredictionMatchInput,
  prediction: Prediction,
): void {
  const actual =
    prediction.match;

  if (
    actual.homeTeam
      .trim()
      .toLowerCase() !==
    match.homeTeam
      .trim()
      .toLowerCase()
  ) {
    throw new Error(
      "Gemini returned an incorrect home team.",
    );
  }

  if (
    actual.awayTeam
      .trim()
      .toLowerCase() !==
    match.awayTeam
      .trim()
      .toLowerCase()
  ) {
    throw new Error(
      "Gemini returned an incorrect away team.",
    );
  }

  if (
    actual.competition
      .trim()
      .toLowerCase() !==
    match.competition
      .trim()
      .toLowerCase()
  ) {
    throw new Error(
      "Gemini returned an incorrect competition.",
    );
  }

  if (
    actual.fixtureDate !==
    match.fixtureDate
  ) {
    throw new Error(
      "Gemini returned an incorrect fixture date.",
    );
  }
}

/**
 * ============================================================
 * PROBABILITY VALIDATION
 * ============================================================
 */

function validatePredictionProbabilities(
  prediction: Prediction,
): void {
  const values = {
    homeWin:
      prediction.prediction.homeWin,

    draw:
      prediction.prediction.draw,

    awayWin:
      prediction.prediction.awayWin,

    over15:
      prediction.prediction.over15,

    over25:
      prediction.prediction.over25,

    over35:
      prediction.prediction.over35,

    bttsYes:
      prediction.prediction.bttsYes,

    bttsNo:
      prediction.prediction.bttsNo,

    confidence:
      prediction.prediction.confidence,
  };

  for (const [
    name,
    value,
  ] of Object.entries(values)) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new Error(
        `Invalid ${name}: ${value}`,
      );
    }
  }

  const oneX2 =
    prediction.prediction.homeWin +
    prediction.prediction.draw +
    prediction.prediction.awayWin;

  if (
    Math.abs(oneX2 - 100) >
    0.5
  ) {
    throw new Error(
      `1X2 probabilities must equal 100. Received ${oneX2}.`,
    );
  }

  const btts =
    prediction.prediction.bttsYes +
    prediction.prediction.bttsNo;

  if (
    Math.abs(btts - 100) >
    0.5
  ) {
    throw new Error(
      `BTTS probabilities must equal 100. Received ${btts}.`,
    );
  }

  if (
    prediction.prediction.over15 <
    prediction.prediction.over25
  ) {
    throw new Error(
      "Over 1.5 cannot be lower than Over 2.5.",
    );
  }

  if (
    prediction.prediction.over25 <
    prediction.prediction.over35
  ) {
    throw new Error(
      "Over 2.5 cannot be lower than Over 3.5.",
    );
  }
}

/**
 * ============================================================
 * DOUBLE CHANCE VALIDATION
 * ============================================================
 */

function validateDoubleChance(
  prediction: Prediction,
): void {
  const {
    homeWin,
    draw,
    awayWin,
    doubleChance,
  } =
    prediction.prediction;

  const values = {
    "1X":
      homeWin + draw,

    X2:
      draw + awayWin,

    12:
      homeWin + awayWin,
  };

  const selected =
    values[doubleChance];

  const strongest =
    Math.max(
      values["1X"],
      values["X2"],
      values["12"],
    );

  if (
    selected + 5 <
    strongest
  ) {
    throw new Error(
      `Double chance ${doubleChance} is inconsistent with the probability distribution.`,
    );
  }
}

/**
 * ============================================================
 * SCORE VALIDATION
 * ============================================================
 */

function parseScore(
  score: string,
): [number, number] | null {
  const match =
    score
      .trim()
      .match(
        /^(\d+)\s*-\s*(\d+)$/,
      );

  if (!match) {
    return null;
  }

  return [
    Number(match[1]),
    Number(match[2]),
  ];
}

function validateMostLikelyScore(
  prediction: Prediction,
): void {
  const score =
    parseScore(
      prediction.prediction
        .mostLikelyScore,
    );

  if (!score) {
    throw new Error(
      "Invalid most likely score.",
    );
  }

  const totalGoals =
    score[0] + score[1];

  if (
    totalGoals >= 4 &&
    prediction.prediction
      .over35 < 20
  ) {
    throw new Error(
      "Score conflicts with Over 3.5 probability.",
    );
  }

  if (
    totalGoals <= 1 &&
    prediction.prediction
      .over25 > 85
  ) {
    throw new Error(
      "Score conflicts with Over 2.5 probability.",
    );
  }
}

/**
 * ============================================================
 * ANALYSIS QUALITY GATE
 * ============================================================
 *
 * This is deliberately conservative.
 *
 * We don't want Gemini returning:
 *
 * "Both teams are strong..."
 *
 * and calling that cutting-edge analysis.
 */

function evaluateAnalysisQuality(
  prediction: Prediction,
): {
  score: number;
  issues: string[];
} {
  const analysis =
    prediction.analysis
      .trim();

  const keyFactors =
    prediction.keyFactors
      .join(" ")
      .trim();

  const risks =
    prediction.risks
      .join(" ")
      .trim();

  const combined =
    `${analysis} ${keyFactors} ${risks}`
      .toLowerCase();

  const issues: string[] = [];

  let score = 100;

  const genericPhrases = [
    "home advantage",
    "strong attack",
    "strong defense",
    "strong defence",
    "both teams are strong",
    "high-quality squad",
    "top team",
    "closely matched",
    "tight matchup",
    "tight match",
    "good form",
    "quality players",
    "attacking threat",
    "defensive solidity",
    "tactical battle",
  ];

  let genericCount = 0;

  for (const phrase of genericPhrases) {
    if (
      combined.includes(
        phrase,
      )
    ) {
      genericCount++;
    }
  }

  if (
    genericCount >= 4
  ) {
    score -= 30;

    issues.push(
      "Analysis contains excessive generic football language.",
    );
  } else if (
    genericCount >= 2
  ) {
    score -= 15;

    issues.push(
      "Analysis contains some generic football language.",
    );
  }

  if (
    analysis.length < 500
  ) {
    score -= 20;

    issues.push(
      "Analysis is too short for a production prediction.",
    );
  }

  if (
    keyFactors.length < 200
  ) {
    score -= 10;

    issues.push(
      "Key factors lack sufficient detail.",
    );
  }

  if (
    risks.length < 120
  ) {
    score -= 5;

    issues.push(
      "Risk assessment is too shallow.",
    );
  }

  return {
    score: Math.max(
      0,
      score,
    ),
    issues,
  };
}

/**
 * ============================================================
 * FULL VALIDATION
 * ============================================================
 */

function validatePrediction(
  match: PredictionMatchInput,
  parsed: unknown,
): Prediction {
  const result =
    predictionSchema.safeParse(
      parsed,
    );

  if (!result.success) {
    console.error(
      "Prediction schema error:",
      result.error.flatten(),
    );

    throw new Error(
      "Gemini returned an invalid prediction structure.",
    );
  }

  const prediction =
    result.data;

  validateFixtureIdentity(
    match,
    prediction,
  );

  validatePredictionProbabilities(
    prediction,
  );

  validateDoubleChance(
    prediction,
  );

  validateMostLikelyScore(
    prediction,
  );

  return prediction;
}

/**
 * ============================================================
 * REPAIR PASS
 * ============================================================
 *
 * Gemini receives its own validated-but-low-quality prediction
 * and is instructed to improve the analytical specificity.
 *
 * This is NOT a second web search.
 *
 * It only improves reasoning from the same evidence.
 */

async function repairPrediction(
  ai: GoogleGenAI,
  match: PredictionMatchInput,
  research: PredictionResearch,
  prediction: Prediction,
  issues: string[],
): Promise<Prediction> {
  const repairPrompt = `
You are the MatchPulse Prediction Quality Controller.

A prediction was generated for:

${match.homeTeam} vs ${match.awayTeam}

Competition:
${match.competition}

Date:
${match.fixtureDate}

The prediction passed structural validation but failed the
MatchPulse analytical quality gate.

QUALITY ISSUES:

${issues
  .map(
    (issue) =>
      `- ${issue}`,
  )
  .join("\n")}

==================================================
ORIGINAL PREDICTION
==================================================

${JSON.stringify(
  prediction,
  null,
  2,
)}

==================================================
EVIDENCE
==================================================

${buildResearchContext(
  research,
)}

==================================================
REPAIR OBJECTIVE
==================================================

Improve the prediction WITHOUT inventing information.

The final analysis must:

- use concrete supplied evidence
- distinguish historical from current evidence
- explicitly acknowledge unresolved contradictions
- avoid generic football language
- avoid unsupported injuries
- avoid unsupported statistics
- avoid unsupported lineups
- explain WHY the probability distribution looks the way it does
- remain specific to this exact fixture

Do NOT change probabilities merely for stylistic reasons.

Only change probabilities if the original reasoning is inconsistent
with the supplied evidence.

Return ONLY valid JSON matching the original schema.
`;

  const text =
    await requestGemini(
      ai,
      repairPrompt,
      GEMINI_REPAIR_MODEL,
    );

  const parsed =
    parseGeminiJson(text);

  return validatePrediction(
    match,
    parsed,
  );
}

/**
 * ============================================================
 * MAIN GENERATOR
 * ============================================================
 */

export async function generatePrediction(
  match: PredictionMatchInput,
): Promise<Prediction> {

  /**
   * ----------------------------------------------------------
   * STEP 1 — TAVILY
   * ----------------------------------------------------------
   */

  let research: PredictionResearch;

  try {
    research =
      await researchPrediction(
        match,
      );
  } catch (error) {
    console.error(
      "Tavily research failed:",
      error,
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to research fixture with Tavily.",
    );
  }

  const researchQuality =
    calculateResearchQuality(
      research,
    );

  /**
   * ----------------------------------------------------------
   * STEP 2 — GEMINI
   * ----------------------------------------------------------
   */

  const ai =
    getGeminiClient();

  const prompt =
    buildGeminiPrompt(
      match,
      research,
    );

  /**
   * ----------------------------------------------------------
   * STEP 3 — FIRST GEMINI PASS
   * ----------------------------------------------------------
   */

  const text =
    await requestGemini(
      ai,
      prompt,
      GEMINI_MODEL,
    );

  /**
   * ----------------------------------------------------------
   * STEP 4 — PARSE
   * ----------------------------------------------------------
   */

  const parsed =
    parseGeminiJson(
      text,
    );

  /**
   * ----------------------------------------------------------
   * STEP 5 — VALIDATE
   * ----------------------------------------------------------
   */

  let prediction =
    validatePrediction(
      match,
      parsed,
    );

  /**
   * ----------------------------------------------------------
   * STEP 6 — QUALITY GATE
   * ----------------------------------------------------------
   */

  const quality =
    evaluateAnalysisQuality(
      prediction,
    );

  /**
   * ----------------------------------------------------------
   * STEP 7 — OPTIONAL REPAIR
   * ----------------------------------------------------------
   */

  if (
    quality.score <
      MINIMUM_ACCEPTABLE_QUALITY &&
    research.sources.length > 0
  ) {

    prediction =
      await repairPrediction(
        ai,
        match,
        research,
        prediction,
        quality.issues,
      );

  }

  /**
   * ----------------------------------------------------------
   * STEP 8 — FINAL VALIDATION
   * ----------------------------------------------------------
   */

  validateFixtureIdentity(
    match,
    prediction,
  );

  validatePredictionProbabilities(
    prediction,
  );

  validateDoubleChance(
    prediction,
  );

  validateMostLikelyScore(
    prediction,
  );

  return prediction;
}