import type { ConfidenceLevel } from "../../contract/profile";

export function clamp0to100(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

/**
 * Linear map to 0..100 using a min/max range.
 * Values below min clamp to 0, above max clamp to 100.
 */
export function scaleTo100(value: number, min: number, max: number): number {
  if (max <= min) return 50;
  const t = (value - min) / (max - min);
  return clamp0to100(t * 100);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function stdDev(nums: number[]): number {
  if (nums.length <= 1) return 0;
  const m = avg(nums);
  const variance = avg(nums.map((x) => (x - m) ** 2));
  return Math.sqrt(variance);
}

/**
 * Deterministic confidence heuristic from sample size.
 * (We’ll refine later; this keeps cards honest.)
 */
export function confidenceFromMatches(matchCount: number): ConfidenceLevel {
  if (matchCount >= 25) return "high";
  if (matchCount >= 12) return "medium";
  return "low";
}
