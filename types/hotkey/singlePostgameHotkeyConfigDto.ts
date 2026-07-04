/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { Feature } from "../shared/style/set/feature";
import { Team } from "../shared/style/team";

export class singlePostgameHotkeyConfigDto {
    minFeature?: Feature;
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
