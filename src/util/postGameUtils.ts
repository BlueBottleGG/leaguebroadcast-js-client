import type { postGameOverview } from "#types/postgame/postGameOverview";
import type { singleGameGoldGraph } from "#types/postgame/gold/singleGameGoldGraph";
import type { postGameDamageGraphByTeam } from "#types/postgame/damage/postGameDamageGraphByTeam";
import type { postGameDamageGraphEntry } from "#types/postgame/damage/postGameDamageGraphEntry";

// ---------------------------------------------------------------------------
// Sides
// ---------------------------------------------------------------------------

/**
 * Returns the sorted numeric side keys present in a post-game overview.
 *
 * Prefers the keys of `teamOverviewBySide`; falls back to `teamInfoBySide`
 * when no overview-by-side data is present.
 *
 * @example
 * ```ts
 * getPostGameSides(overview); // [100, 200]
 * ```
 */
export function getPostGameSides(overview: postGameOverview): number[] {
  const source =
    overview.teamOverviewBySide &&
    Object.keys(overview.teamOverviewBySide).length > 0
      ? overview.teamOverviewBySide
      : (overview.teamInfoBySide ?? {});
  return Object.keys(source)
    .map(Number)
    .sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// Gold series
// ---------------------------------------------------------------------------

/**
 * Flattens a `singleGameGoldGraph.goldAtTime` map into a chronological series.
 *
 * Each entry pairs a numeric `time` with the per-side gold map at that time.
 * Entries are sorted ascending by numeric time.
 *
 * @example
 * ```ts
 * buildGoldSeries(graph);
 * // [{ time: 0, goldBySide: { 100: 2500, 200: 2500 } }, ...]
 * ```
 */
export function buildGoldSeries(
  graph: singleGameGoldGraph,
): { time: number; goldBySide: Record<number, number> }[] {
  const goldAtTime = graph?.goldAtTime ?? {};
  return Object.keys(goldAtTime)
    .map(Number)
    .sort((a, b) => a - b)
    .map((time) => ({
      time,
      goldBySide: goldAtTime[time] as Record<number, number>,
    }));
}

/**
 * Builds a gold-difference series relative to a reference side.
 *
 * For each timestamp the value is `referenceSide gold - other side gold`.
 * A positive value means the reference side is ahead. When more than two
 * sides are present, all non-reference sides are summed as "other".
 * `referenceSide` defaults to the lowest numeric side key in the series.
 *
 * @example
 * ```ts
 * buildGoldDiffSeries(graph);        // reference = lowest side
 * buildGoldDiffSeries(graph, 200);   // reference = side 200
 * ```
 */
export function buildGoldDiffSeries(
  graph: singleGameGoldGraph,
  referenceSide?: number,
): { time: number; diff: number }[] {
  const series = buildGoldSeries(graph);
  if (series.length === 0) return [];

  const ref =
    referenceSide ??
    Math.min(
      ...series.flatMap((entry) => Object.keys(entry.goldBySide).map(Number)),
    );

  return series.map((entry) => {
    const refGold = entry.goldBySide[ref] ?? 0;
    let otherGold = 0;
    for (const [side, gold] of Object.entries(entry.goldBySide)) {
      if (Number(side) !== ref) otherGold += gold;
    }
    return { time: entry.time, diff: refGold - otherGold };
  });
}

// ---------------------------------------------------------------------------
// Clock formatting
// ---------------------------------------------------------------------------

/**
 * Formats a duration in seconds as a game clock string.
 *
 * Renders `M:SS` (or `MM:SS`) below an hour and `H:MM:SS` from one hour up.
 * Negative inputs are clamped to `0`.
 *
 * @example
 * ```ts
 * formatGameClock(75);    // "1:15"
 * formatGameClock(605);   // "10:05"
 * formatGameClock(3661);  // "1:01:01"
 * formatGameClock(-5);    // "0:00"
 * ```
 */
export function formatGameClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const ss = secs.toString().padStart(2, "0");
  if (hours > 0) {
    const mm = minutes.toString().padStart(2, "0");
    return `${hours}:${mm}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

// ---------------------------------------------------------------------------
// Damage graph helpers
// ---------------------------------------------------------------------------

/**
 * Sums the damage across all entries of a team's damage graph.
 *
 * @example
 * ```ts
 * damageGraphTeamTotal(team); // 84210
 * ```
 */
export function damageGraphTeamTotal(team: postGameDamageGraphByTeam): number {
  return (team?.entries ?? []).reduce((sum, entry) => sum + entry.damage, 0);
}

/**
 * Returns a new array of damage entries sorted by total damage descending.
 * Non-mutating — the input array is left untouched.
 *
 * @example
 * ```ts
 * sortDamageEntries(team.entries); // highest-damage entry first
 * ```
 */
export function sortDamageEntries(
  entries: postGameDamageGraphEntry[],
): postGameDamageGraphEntry[] {
  return [...entries].sort((a, b) => b.damage - a.damage);
}
