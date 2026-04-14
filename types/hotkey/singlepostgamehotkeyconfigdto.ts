/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { Team } from "../shared/style/team";
import { Tier } from "../shared/style/set/tier";

export class singlePostgameHotkeyConfigDto {
    minTier: Tier = Tier.Free;
    id: number = 0;
    name: string = "";
    componentName: string = "";
    hotkey?: string;
    hotkeyCode?: string;
    hotkeyModifiers?: string[];
    backgroundColor: string = "";
    team?: Team;
    playerIndex?: number;
    allowPlayers: boolean = false;
    allowTeams: boolean = false;
    allowStats: boolean = false;
    selectedStats?: string[];
    requiresCompletedGame: boolean = false;
}
