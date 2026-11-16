import type { ingameScoreboardData } from "#types/ingame/topScoreboard/ingameScoreboardData";
import type { ingameObjectiveBountyData } from "#types/ingame/topScoreboard/ingameObjectiveBountyData";
import { IngameObjectiveBountyState } from "#types/ingame/topScoreboard/ingameObjectiveBountyState";
import { getRemaining } from "./ingameTimerUtils";

/**
 * Index into `scoreboard.teams` of the team holding the objective bounty,
 * or `undefined` when no team has one. `0` is a valid result, so compare
 * against `undefined` rather than testing truthiness.
 */
export function getObjectiveBountyTeam(
  scoreboard: ingameScoreboardData | null | undefined,
): number | undefined {
  const index = scoreboard?.teams?.findIndex((t) => t.objectiveBounty) ?? -1;
  return index === -1 ? undefined : index;
}

/**
 * Seconds left on an Upcoming or Ending bounty's countdown, clamped at `0`.
 * Returns `undefined` for an Active bounty (it does not expire at `endTime`)
 * or when there is no bounty.
 */
export function getObjectiveBountyRemaining(
  bounty: ingameObjectiveBountyData | null | undefined,
  gameTime: number,
): number | undefined {
  if (
    bounty?.state !== IngameObjectiveBountyState.Upcoming &&
    bounty?.state !== IngameObjectiveBountyState.Ending
  )
    return undefined;
  return getRemaining(bounty.endTime, gameTime);
}
