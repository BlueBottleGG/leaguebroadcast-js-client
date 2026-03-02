/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { Team } from "../shared/style/Team";
import { Tier } from "../shared/style/set/Tier";

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
    requiresCompletedGame: boolean = false;
}
