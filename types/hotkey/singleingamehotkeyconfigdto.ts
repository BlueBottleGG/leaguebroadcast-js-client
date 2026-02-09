/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { playerHotkeyDto } from "./playerHotkeyDto";
import { Tier } from "../shared/style/set/Tier";

export class singleIngameHotkeyConfigDto {
    minTier: Tier = Tier.Free;
    overlayId: number = 0;
    name: string = "";
    hotkey?: string;
    hotkeyCode?: string;
    hotkeyModifiers?: string[];
    overlayName: string = "";
    timePeriod: number = 0;
    team?: string;
    players?: playerHotkeyDto[];
    backgroundColor: string = "";
    hasSettings: boolean = false;
    allowSinglePlayers: boolean = false;
    allowTimePeriod: boolean = false;
    overlaysToDisable: number[] = [];
}
