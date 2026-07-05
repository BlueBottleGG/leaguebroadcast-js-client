import { postGameOverview } from "./postGameOverview";
import type { activeComponentChangedEventArgs } from "../message/ui/activeComponentChangedEventArgs";

export class postGameStateData {
    isActive: boolean = false;
    isConnected: boolean = false;
    isMocking: boolean = false;
    gameId?: number;
    overview: postGameOverview | null = null;
    activeComponent?: activeComponentChangedEventArgs | null;
}
