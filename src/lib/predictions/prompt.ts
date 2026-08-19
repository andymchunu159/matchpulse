/**
 * MatchPulse Prediction Prompt Engine
 *
 * Architecture:
 *
 * MatchPulse structured data
 *        +
 * Tavily evidence
 *        ↓
 * Evidence classification
 *        ↓
 * Fixture-specific reasoning
 *        ↓
 * Probability modelling
 *        ↓
 * Gemini structured output
 *
 * Design goals:
 *
 * 1. Evidence-first reasoning
 * 2. Fixture-specific analysis
 * 3. Currentness awareness
 * 4. Historical/current separation
 * 5. No unsupported statistics
 * 6. No fabricated player availability
 * 7. No generic football commentary
 * 8. Probabilities must reflect evidence
 * 9. Confidence must reflect evidence quality
 * 10. Explicit uncertainty handling
 */

/**
 * IMPORTANT:
 *
 * This type is intentionally exported from prompt.ts because
 * gemini.ts imports PredictionMatchInput from "./prompt".
 *
 * Do NOT import PredictionMatchInput from "./types" here while
 * also declaring it locally. That creates the TypeScript conflict
 * present in the previous version.
 */
export type PredictionMatchInput = {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  fixtureDate: string;

  // ------------------------------------------------------------
  // League context
  // ------------------------------------------------------------

  homePosition?: number | null;
  awayPosition?: number | null;

  homePoints?: number | null;
  awayPoints?: number | null;

  homeGoalDifference?: number | null;
  awayGoalDifference?: number | null;

  // ------------------------------------------------------------
  // Recent form
  // ------------------------------------------------------------

  homeRecentResults?: string[] | null;
  awayRecentResults?: string[] | null;

  // ------------------------------------------------------------
  // Goal production / prevention
  // ------------------------------------------------------------

  homeGoalsScored?: number | null;
  awayGoalsScored?: number | null;

  homeGoalsConceded?: number | null;
  awayGoalsConceded?: number | null;

  homeCleanSheets?: number | null;
  awayCleanSheets?: number | null;

  // ------------------------------------------------------------
  // Expected-goals data
  // ------------------------------------------------------------

  homeXG?: number | null;
  awayXG?: number | null;

  homeXGA?: number | null;
  awayXGA?: number | null;

  // ------------------------------------------------------------
  // Shooting
  // ------------------------------------------------------------

  homeShotsOnTarget?: number | null;
  awayShotsOnTarget?: number | null;

  // ------------------------------------------------------------
  // Venue-specific form
  // ------------------------------------------------------------

  homeHomeRecord?: string | null;
  awayAwayRecord?: string | null;

  // ------------------------------------------------------------
  // Head-to-head
  // ------------------------------------------------------------

  h2hResults?: string[] | null;
};

/**
 * Converts optional structured values into safe prompt text.
 */
function formatValue(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "NOT AVAILABLE";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "NOT AVAILABLE";
    }

    return value.join(" | ");
  }

  return String(value);
}

/**
 * Calculates whether a value is actually available.
 *
 * Used inside the prompt so Gemini can distinguish
 * missing data from zero.
 */
function hasValue(
  value: unknown,
): boolean {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  if (
    Array.isArray(value) &&
    value.length === 0
  ) {
    return false;
  }

  return true;
}

/**
 * Builds a compact data-availability summary.
 *
 * This is important because Gemini must NOT interpret
 * missing values as zero values.
 */
function buildDataAvailability(
  match: PredictionMatchInput,
): string {
  const fields = [
    ["League position", match.homePosition, match.awayPosition],
    ["Points", match.homePoints, match.awayPoints],
    ["Goal difference", match.homeGoalDifference, match.awayGoalDifference],
    ["Recent results", match.homeRecentResults, match.awayRecentResults],
    ["Goals scored", match.homeGoalsScored, match.awayGoalsScored],
    ["Goals conceded", match.homeGoalsConceded, match.awayGoalsConceded],
    ["Clean sheets", match.homeCleanSheets, match.awayCleanSheets],
    ["xG", match.homeXG, match.awayXG],
    ["xGA", match.homeXGA, match.awayXGA],
    ["Shots on target", match.homeShotsOnTarget, match.awayShotsOnTarget],
    ["Venue records", match.homeHomeRecord, match.awayAwayRecord],
    ["H2H", match.h2hResults, null],
  ];

  const available: string[] = [];
  const missing: string[] = [];

  for (
    const [label, homeValue, awayValue] of fields
  ) {
    const homeAvailable =
      hasValue(homeValue);

    const awayAvailable =
      awayValue === null
        ? true
        : hasValue(awayValue);

    if (
      homeAvailable &&
      awayAvailable
    ) {
      available.push(String(label));
    } else {
      missing.push(String(label));
    }
  }

  return `
==================================================
DATA AVAILABILITY AUDIT
==================================================

AVAILABLE STRUCTURED DATA:
${available.length > 0 ? available.join(", ") : "NONE"}

MISSING / PARTIAL STRUCTURED DATA:
${missing.length > 0 ? missing.join(", ") : "NONE"}

IMPORTANT:

A missing metric is NOT zero.

A missing metric is NOT evidence that the team performed badly.

A missing metric is NOT permission to use a typical league value.

If a metric is unavailable, reduce the influence of that metric
rather than inventing a replacement.
`;
}

/**
 * Builds the structured MatchPulse data section.
 */
function buildMatchData(
  match: PredictionMatchInput,
): string {
  return `
==================================================
MATCHPULSE STRUCTURED MATCH DATA
==================================================

FIXTURE
--------------------------------------------------

Home Team:
${match.homeTeam}

Away Team:
${match.awayTeam}

Competition:
${match.competition}

Fixture Date:
${match.fixtureDate}

==================================================
LEAGUE CONTEXT
==================================================

${match.homeTeam} league position:
${formatValue(match.homePosition)}

${match.awayTeam} league position:
${formatValue(match.awayPosition)}

${match.homeTeam} points:
${formatValue(match.homePoints)}

${match.awayTeam} points:
${formatValue(match.awayPoints)}

${match.homeTeam} goal difference:
${formatValue(match.homeGoalDifference)}

${match.awayTeam} goal difference:
${formatValue(match.awayGoalDifference)}

==================================================
RECENT COMPETITIVE FORM
==================================================

${match.homeTeam} recent results:
${formatValue(match.homeRecentResults)}

${match.awayTeam} recent results:
${formatValue(match.awayRecentResults)}

IMPORTANT:

Do not invent recent results.

Do not infer a win/loss sequence from reputation.

Do not treat historical results as recent form.

==================================================
GOAL PRODUCTION
==================================================

${match.homeTeam} goals scored:
${formatValue(match.homeGoalsScored)}

${match.awayTeam} goals scored:
${formatValue(match.awayGoalsScored)}

${match.homeTeam} goals conceded:
${formatValue(match.homeGoalsConceded)}

${match.awayTeam} goals conceded:
${formatValue(match.awayGoalsConceded)}

==================================================
DEFENSIVE PERFORMANCE
==================================================

${match.homeTeam} clean sheets:
${formatValue(match.homeCleanSheets)}

${match.awayTeam} clean sheets:
${formatValue(match.awayCleanSheets)}

==================================================
EXPECTED GOALS
==================================================

${match.homeTeam} xG:
${formatValue(match.homeXG)}

${match.awayTeam} xG:
${formatValue(match.awayXG)}

${match.homeTeam} xGA:
${formatValue(match.homeXGA)}

${match.awayTeam} xGA:
${formatValue(match.awayXGA)}

IMPORTANT:

Never manufacture xG or xGA.

Never replace missing xG with goals scored.

==================================================
SHOOTING
==================================================

${match.homeTeam} shots on target:
${formatValue(match.homeShotsOnTarget)}

${match.awayTeam} shots on target:
${formatValue(match.awayShotsOnTarget)}

==================================================
VENUE-SPECIFIC FORM
==================================================

${match.homeTeam} home record:
${formatValue(match.homeHomeRecord)}

${match.awayTeam} away record:
${formatValue(match.awayAwayRecord)}

==================================================
HEAD-TO-HEAD
==================================================

${formatValue(match.h2hResults)}

IMPORTANT:

H2H is secondary evidence.

H2H must never dominate current-form evidence.

H2H must never be treated as current injury,
availability or tactical evidence.
`;
}

/**
 * Main MatchPulse prediction prompt.
 */
export function buildPredictionPrompt(
  match: PredictionMatchInput,
): string {
  const matchData =
    buildMatchData(match);

  const dataAvailability =
    buildDataAvailability(match);

  return `
You are the MatchPulse Football Intelligence Engine.

You are NOT a generic football article writer.

You are a probabilistic football-analysis engine.

Your task is to evaluate exactly one fixture:

${match.homeTeam} vs ${match.awayTeam}

Competition:
${match.competition}

Fixture date:
${match.fixtureDate}

Your output will be consumed directly by the MatchPulse application.

==================================================
PRIMARY OBJECTIVE
==================================================

Generate an evidence-driven probability distribution for:

1. Home Win
2. Draw
3. Away Win
4. Over 1.5 Goals
5. Over 2.5 Goals
6. Over 3.5 Goals
7. BTTS Yes
8. BTTS No

Also generate:

- most likely score
- double chance
- confidence
- detailed analysis
- concrete key factors
- concrete risks

The prediction must be specific to THIS fixture.

==================================================
FIXTURE LOCK
==================================================

The fixture identity is immutable.

HOME:
${match.homeTeam}

AWAY:
${match.awayTeam}

COMPETITION:
${match.competition}

DATE:
${match.fixtureDate}

NEVER substitute:

- another fixture
- another season
- another competition
- reversed home/away teams
- a different meeting between the clubs

Historical meetings may be used ONLY as historical evidence.

==================================================
EVIDENCE HIERARCHY
==================================================

Use evidence according to this priority:

TIER 1 — PRIMARY

- official Premier League
- official UEFA
- official FIFA
- official club websites
- official competition announcements

TIER 2 — HIGH QUALITY DATA

- Opta
- Stats Perform
- StatMuse
- FBref
- FotMob
- established football databases

TIER 3 — ESTABLISHED JOURNALISM

- BBC Sport
- Reuters
- Sky Sports
- ESPN
- The Guardian
- other established football journalism

TIER 4 — AGGREGATORS

- FootyStats
- 365Scores
- similar statistical databases

TIER 5 — LOW QUALITY

Do not use as authoritative evidence:

- betting sites
- prediction sites
- tipster sites
- SEO articles
- affiliate pages
- unsupported social posts

IMPORTANT:

Tavily relevance score is NOT evidence quality.

Search ranking is NOT factual verification.

==================================================
SOURCE SPECIALIZATION
==================================================

Use each source according to what it can actually establish.

Official club source:

Good for:

- injuries
- availability
- squad announcements
- manager comments
- confirmed lineups

Official competition source:

Good for:

- fixture identity
- official results
- competition context
- league statistics

Statistical provider:

Good for:

- results
- goals
- xG
- xGA
- shots
- shots on target
- clean sheets
- H2H

Established journalism:

Good for:

- developing injury situations
- training reports
- manager comments
- tactical information
- selection uncertainty

NEVER use:

- an H2H page to establish a current injury
- an old lineup to establish a current lineup
- an old article to establish current availability
- a prediction article as evidence that a result is likely

==================================================
TEMPORAL INTELLIGENCE
==================================================

For every factual claim, internally classify it as:

CURRENT
HISTORICAL
UNCERTAIN
UNSUPPORTED

CURRENT:

Directly relevant to the target fixture date.

HISTORICAL:

From previous matches, seasons or meetings.

UNCERTAIN:

Conflicting, incomplete or ambiguous evidence.

UNSUPPORTED:

Not established by supplied evidence.

Rules:

HISTORICAL ≠ CURRENT.

UNCERTAIN ≠ FACT.

UNSUPPORTED ≠ FACT.

==================================================
CURRENT TEAM NEWS
==================================================

For:

- injuries
- suspensions
- player availability
- transfers
- manager comments
- probable lineups
- tactical changes

require evidence that is clearly relevant to:

${match.fixtureDate}

If such evidence is unavailable:

state that availability is unconfirmed.

DO NOT name a player as injured merely because:

- an old article says so
- another season contained an injury
- a database lists an old injury
- a search result mentions the player
- another source has conflicting historical information

==================================================
CONFLICT RESOLUTION
==================================================

When sources conflict:

1. Prefer official evidence.
2. Prefer direct evidence.
3. Prefer the newest relevant evidence.
4. Prefer fixture-specific evidence.
5. Prefer independently corroborated evidence.

If the conflict cannot be resolved:

DO NOT guess.

Treat the information as uncertain.

Increase risk.

Reduce confidence.

Do not manufacture a definitive player-availability statement.

==================================================
EVIDENCE DEDUPLICATION
==================================================

Do not double-count duplicated reporting.

If five websites repeat the same historical result from the same
underlying source, this is ONE underlying fact.

Repeated reporting does not equal independent confirmation.

==================================================
STATISTICAL REASONING
==================================================

For 1X2 probabilities consider, where supplied:

- home advantage
- recent competitive form
- home/away performance
- goals scored
- goals conceded
- xG
- xGA
- shots
- shots on target
- clean sheets
- league position
- points
- goal difference
- player availability
- tactical matchup
- rest
- fixture congestion
- H2H

Do NOT assume that every metric exists.

Do NOT invent missing metrics.

Do NOT allow reputation to substitute for evidence.

Do NOT allow H2H to dominate current evidence.

==================================================
HOME / AWAY ASYMMETRY
==================================================

This is a home/away fixture.

Therefore explicitly compare:

${match.homeTeam} HOME evidence

against

${match.awayTeam} AWAY evidence.

If home/away records are unavailable:

do not invent them.

Instead state that venue-specific evidence is limited.

==================================================
GOAL MODEL
==================================================

Goal-market probabilities must be coherent with the supplied
scoring and defensive evidence.

Required relationship:

Over 1.5 >= Over 2.5 >= Over 3.5

Required relationship:

BTTS Yes + BTTS No = 100

Use, when available:

- goals scored
- goals conceded
- xG
- xGA
- shots on target
- clean sheets
- recent results
- home/away performance

Do not assign goal probabilities simply because the teams are
well-known attacking teams.

==================================================
1X2 PROBABILITY MODEL
==================================================

Required:

Home Win + Draw + Away Win = 100

The three values must represent relative likelihood.

Do not force:

- a home win because the match is at home
- a draw because the teams are strong
- an away win because one club has greater reputation

The probabilities should emerge from the evidence package.

==================================================
DOUBLE CHANCE
==================================================

Calculate conceptually:

1X = Home Win + Draw

X2 = Draw + Away Win

12 = Home Win + Away Win

Select the strongest combination.

==================================================
MOST LIKELY SCORE
==================================================

Do NOT automatically return:

1-1

2-1

1-0

Instead select the score that best represents the predicted scoring
environment.

The score must be compatible with:

- BTTS probability
- Over 1.5 probability
- Over 2.5 probability
- Over 3.5 probability
- relative 1X2 probabilities

A single score does NOT need to equal the exact market probabilities,
but it must not obviously contradict them.

==================================================
CONFIDENCE ENGINE
==================================================

Confidence is NOT the probability of the predicted outcome.

Confidence measures the reliability of the evidence package.

Consider:

- source quality
- source agreement
- statistical depth
- currentness
- fixture specificity
- lineup certainty
- availability certainty
- amount of missing data
- amount of contradictory data

Use this framework:

80-100
Very strong evidence package.

65-79
Strong evidence package.

50-64
Moderate evidence package.

35-49
Weak / incomplete evidence.

0-34
Very limited evidence.

IMPORTANT:

If the research package has serious temporal contradictions,
missing current team news, or poor source coverage:

confidence MUST decrease.

Do not output high confidence simply because the teams are famous.

==================================================
ANTI-GENERIC ANALYSIS ENGINE
==================================================

The analysis MUST contain concrete evidence.

BAD:

"Liverpool are strong at home."

BAD:

"Arsenal are a quality team."

BAD:

"Both teams have dangerous attackers."

BAD:

"Home advantage gives Liverpool an edge."

These statements are too generic unless backed by supplied data.

GOOD:

"Supplied home-form data shows Liverpool recorded X wins from
the available home sample."

GOOD:

"Supplied xG data gives Liverpool X compared with Arsenal's Y."

GOOD:

"The supplied last-five results show Liverpool scored X goals
while Arsenal scored Y."

If the number does not exist:

DO NOT invent it.

==================================================
ANTI-REPUTATION RULE
==================================================

Do not use:

"big club"

"title contender"

"world-class"

"elite"

"strong attack"

"solid defence"

as analytical evidence unless the supplied evidence provides
a measurable basis.

Football reputation is not a statistic.

==================================================
ANALYSIS STRUCTURE
==================================================

The analysis must be a substantive fixture-specific explanation.

It should cover:

1. Fixture context
2. Available recent statistical evidence
3. Home/away asymmetry
4. Goal-scoring environment
5. Tactical or player-availability evidence ONLY when supported
6. Main uncertainty
7. Why the final probability distribution follows from the evidence

Do not merely restate keyFactors.

Do not write generic preview language.

==================================================
KEY FACTORS
==================================================

Return 4-6 factors.

Every factor must be:

- concrete
- evidence-based
- fixture-specific
- concise
- non-duplicative

Prefer measurable facts over adjectives.

==================================================
RISKS
==================================================

Return 3-5 concrete risks.

Valid risks include:

- missing current form
- missing home/away data
- unresolved player availability
- contradictory sources
- limited statistical sample
- early-season uncertainty
- tactical uncertainty
- insufficient xG data

Do NOT invent a risk merely to fill the field.

==================================================
EARLY-SEASON SPECIAL RULE
==================================================

If:

${match.fixtureDate}

is near the beginning of a new league season, recognize that:

- league position may be unavailable or meaningless
- recent league form may be extremely small
- squad integration may create uncertainty
- transfer activity may affect tactical continuity
- historical data has lower predictive relevance than current evidence

Do not pretend that a tiny sample is a robust form signal.

==================================================
EVIDENCE WEIGHTING
==================================================

Conceptually prioritize evidence approximately as follows:

CURRENT FIXTURE-SPECIFIC DATA
        ↓
CURRENT HOME/AWAY DATA
        ↓
CURRENT RECENT FORM
        ↓
CURRENT UNDERLYING METRICS
        ↓
CURRENT PLAYER AVAILABILITY
        ↓
TACTICAL CONTEXT
        ↓
HISTORICAL H2H
        ↓
GENERAL TEAM REPUTATION

Do not reverse this hierarchy.

==================================================
MISSING DATA RULE
==================================================

Missing data must reduce certainty.

Missing data must NOT be converted into:

- league averages
- assumed values
- typical team values
- guessed player availability
- guessed form
- guessed xG

If the evidence package is thin:

make a more conservative prediction
and lower confidence.

==================================================
FINAL INTERNAL AUDIT
==================================================

Before returning JSON, internally verify:

1. Exact home team?
2. Exact away team?
3. Exact competition?
4. Exact fixture date?
5. Did I accidentally use another fixture?
6. Did I confuse historical and current evidence?
7. Did I invent an injury?
8. Did I invent a suspension?
9. Did I invent player availability?
10. Did I invent a lineup?
11. Did I invent xG?
12. Did I invent recent results?
13. Did I invent home/away form?
14. Did I overuse H2H?
15. Did I double-count duplicated evidence?
16. Are 1X2 probabilities exactly 100?
17. Are BTTS probabilities exactly 100?
18. Is Over 1.5 >= Over 2.5?
19. Is Over 2.5 >= Over 3.5?
20. Is the most likely score plausible?
21. Does confidence reflect evidence quality?
22. Does the analysis contain concrete evidence?
23. Are key factors non-generic?
24. Are risks supported by actual uncertainty?
25. If team names were removed, would the analysis still sound
generic?

If #25 is YES:

rewrite the analysis before returning the answer.

==================================================
OUTPUT CONTRACT
==================================================

Return ONLY valid JSON matching the supplied response schema.

Do NOT return Markdown.

Do NOT return explanations outside JSON.

Do NOT return citations.

Do NOT return source lists.

Do NOT fabricate statistics.

Do NOT fabricate injuries.

Do NOT fabricate lineups.

Do NOT fabricate manager quotes.

Do NOT manufacture certainty.

==================================================

${dataAvailability}

${matchData}

==================================================
BEGIN FIXTURE-SPECIFIC EVIDENCE ANALYSIS
==================================================
`;
}