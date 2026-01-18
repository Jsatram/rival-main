// packages/analysis-core/src/contract/profile.ts

/**
 * Epic 2 -> Epic 3 stable output contract.
 * Epic 3 renders this payload; Epic 2 computes it.
 *
 * Rule: Epic 3 should not depend on raw match data structures.
 * Rule: Epic 2 should not change this contract without a deliberate version bump.
 */

export type ConfidenceLevel = "low" | "medium" | "high";

export type Role = "duelist" | "initiator" | "controller" | "sentinel" | "flex";

export type Archetype =
  | "entry"
  | "support"
  | "anchor"
  | "lurker"
  | "playmaker"
  | "igl"
  | "flex";

/**
 * A compact, render-friendly signal summary.
 * Keep this stable and UI-ready.
 */
export type SignalSummary = {
  /** Stable identifier used by UI */
  key:
    | "combatImpact"
    | "openingDuel"
    | "objectivePlay"
    | "clutch"
    | "discipline"
    | "utility"
    | "teamplay";

  /** Short label for display */
  label: string;

  /**
   * Normalized 0..100 (percentile-like). 50 = average.
   * Keep it numeric for consistent rendering and sorting.
   */
  score: number;

  /**
   * Directionality hint for UI (optional)
   * Example: "higher is better" vs "lower is better"
   */
  polarity?: "higherBetter" | "lowerBetter";

  /** Evidence bullets, short and human readable */
  evidence: string[];

  /** Confidence of this signal (separate from overall payload confidence) */
  confidence: ConfidenceLevel;
};

export type RoleFit = {
  declaredRole: Role;
  expressedRole: Role;
  /** 0..100 where 100 = perfect alignment */
  fitScore: number;
  /** Short reason for the fit rating */
  reason: string;
};

export type ArchetypeScores = {
  primary: Archetype;
  secondary?: Archetype;
  /**
   * Raw per-archetype scores, normalized 0..100.
   * UI can show top N, radar, etc.
   */
  scores: Record<Archetype, number>;
};

export type UnorthodoxTag = "standard" | "creative" | "high-risk";

export type UnorthodoxProfile = {
  /**
   * How far from typical patterns this player appears.
   * 0..100 where higher = more deviation.
   */
  deviationScore: number;

  /**
   * Whether the deviation appears efficient (positive value) or costly.
   * 0..100 where higher = more efficient.
   */
  efficiencyScore: number;

  tag: UnorthodoxTag;

  /** Short reason shown on profile */
  reason: string;
};

export type PayloadConfidence = {
  level: ConfidenceLevel;
  reason: string;
};

export type AnalysisWindow = {
  /**
   * Count of matches used.
   * This should match matchesAnalyzed, but window is more descriptive for UI.
   */
  matches: number;

  /**
   * Human friendly descriptor, e.g. "last 20 competitive matches"
   * Keep as string to avoid UI recomputing business phrasing.
   */
  label: string;
};

export type PlayerProfilePayload = {
  /** The “topline” insights */
  signals: SignalSummary[];

  archetypeScores: ArchetypeScores;

  roleFit: RoleFit;

  unorthodox: UnorthodoxProfile;

  confidence: PayloadConfidence;

  matchesAnalyzed: number;

  window: AnalysisWindow;

  /**
   * ISO timestamp (UTC). Example: new Date().toISOString()
   */
  lastComputedAt: string;
};
