import type { activeComponentChangedEventArgs } from "#types/message/ui/activeComponentChangedEventArgs";
import type { postGameOverview } from "#types/postgame/postGameOverview";

export class postGameStateData {
  isActive: boolean = false;
  isConnected: boolean = false;
  isMocking: boolean = false;
  gameId?: number;
  overview?: postGameOverview;
  activeComponent?: activeComponentChangedEventArgs | null;
  /**
   * Monotonic counter bumped whenever the backend reports that freshly
   * persisted post-game stats are available ("postgame-stats-available").
   * Watch this to re-fetch REST post-game data on pages that are already
   * loaded when a game ends.
   */
  statsVersion: number = 0;
  /** Game id of the most recent "postgame-stats-available" broadcast. */
  latestStatsGameId?: number;
}
