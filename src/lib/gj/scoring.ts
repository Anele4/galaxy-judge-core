/**
 * Galaxy Judge — scoring calculations.
 * Weighted score = (score / max) * weight, summed across criteria = 0..100.
 */
import type { Criterion, Evaluation, Team } from "./types";

export function weightedScore(scores: Record<string, number>, rubric: Criterion[]): number {
  return rubric.reduce((sum, c) => {
    const s = scores[c.id];
    if (typeof s !== "number") return sum;
    return sum + (s / c.max) * c.weight;
  }, 0);
}

export function rubricTotalWeight(rubric: Criterion[]): number {
  return rubric.reduce((s, c) => s + c.weight, 0);
}

export function isRubricValid(rubric: Criterion[]): boolean {
  return Math.round(rubricTotalWeight(rubric) * 100) / 100 === 100;
}

export interface Ranking {
  team: Team;
  score: number;
  evaluations: number;
  breakdown: { criterion: Criterion; percent: number }[];
}

/** Final rankings, calculated from locked evaluations only. */
export function calculateRankings(
  teams: Team[],
  evaluations: Evaluation[],
  rubric: Criterion[],
): Ranking[] {
  return teams
    .filter((t) => t.active)
    .map((team) => {
      const evals = evaluations.filter((e) => e.teamId === team.id && e.status === "locked");
      const score = evals.length
        ? evals.reduce((s, e) => s + weightedScore(e.scores, rubric), 0) / evals.length
        : 0;
      const breakdown = rubric.map((c) => {
        const vals = evals.map((e) => e.scores[c.id]).filter((v): v is number => typeof v === "number");
        const percent = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length / c.max) * 100 : 0;
        return { criterion: c, percent };
      });
      return { team, score, evaluations: evals.length, breakdown };
    })
    .sort((a, b) => b.score - a.score);
}

/** Fairness Shield: flags large gaps between criteria — advisory only, never changes a score. */
export function fairnessFlags(
  scores: Record<string, number>,
  rubric: Criterion[],
): string[] {
  const flags: string[] = [];
  const entries = rubric
    .map((c) => ({ c, v: scores[c.id] }))
    .filter((e): e is { c: Criterion; v: number } => typeof e.v === "number");
  if (entries.length < 2) return flags;
  const sorted = [...entries].sort((a, b) => a.v - b.v);
  const low = sorted[0]!;
  const high = sorted[sorted.length - 1]!;
  if (high.v - low.v >= 6) {
    flags.push(
      `There is a significant difference between your ${high.c.name} (${high.v}/${high.c.max}) and ${low.c.name} (${low.v}/${low.c.max}) evaluations.`,
    );
  }
  const values = entries.map((e) => e.v);
  const spread = Math.max(...values) - Math.min(...values);
  if (spread === 0 && entries.length === rubric.length) {
    flags.push("Every criterion received an identical score. Please confirm this reflects your judgement.");
  }
  return flags;
}

/** Scoring pattern review for admins — neutral, descriptive language only. */
export function judgePatterns(evaluations: Evaluation[], rubric: Criterion[]) {
  const byJudge = new Map<string, number[]>();
  for (const e of evaluations) {
    if (e.status !== "locked") continue;
    const arr = byJudge.get(e.judgeId) ?? [];
    arr.push(weightedScore(e.scores, rubric));
    byJudge.set(e.judgeId, arr);
  }
  const all = [...byJudge.values()].flat();
  const panelAvg = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
  return [...byJudge.entries()].map(([judgeId, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const range = Math.max(...values) - Math.min(...values);
    const note =
      range < 8
        ? "Using a narrower scoring range than the overall panel."
        : avg > panelAvg + 6
          ? "Average scores sit above the overall panel average."
          : avg < panelAvg - 6
            ? "Average scores sit below the overall panel average."
            : "Scoring pattern is consistent with the overall panel.";
    return {
      judgeId,
      count: values.length,
      average: avg,
      range,
      note,
      review: note !== "Scoring pattern is consistent with the overall panel.",
    };
  });
}
