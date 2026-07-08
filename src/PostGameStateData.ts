import type { activeComponentChangedEventArgs } from "#types/message/ui/activeComponentChangedEventArgs";
import type { postGameOverview } from "#types/postgame/postGameOverview";

export class postGameStateData {
  isActive: boolean = false;
  isConnected: boolean = false;
  isMocking: boolean = false;
  gameId?: number;
  overview?: postGameOverview;
  activeComponent?: activeComponentChangedEventArgs | null;
}
