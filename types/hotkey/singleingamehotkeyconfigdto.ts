/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { playerHotkeyDto } from "./playerHotkeyDto";
import { Team } from "../shared/style/team";
import { Tier } from "../shared/style/set/tier";

export class singleIngameHotkeyConfigDto {
    minTier: Tier = Tier.Free;
    buttonId: string = "";
    name: string = "";
    hotkey?: string;
    hotkeyCode?: string;
    hotkeyModifiers?: string[];
    overlayName: string = "";
    timePeriod: number = 0;
    team?: Team;
    players?: playerHotkeyDto[];
    backgroundColor: string = "";
    hasSettings: boolean = false;
    allowSinglePlayers: boolean = false;
    allowTimePeriod: boolean = false;
    customSettings?: { [key: string]: any };
}
