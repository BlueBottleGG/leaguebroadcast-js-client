/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DamageFlowView } from "./damageFlow/DamageFlowView";
import { ObjectiveRecapDisplayMode } from "./damageRecap/ObjectiveRecapDisplayMode";
import { playerHotkeyDto } from "../hotkey/playerHotkeyDto";
import { Team } from "../shared/style/Team";

export class ingameStateSettingsWrapper {
    timePeriod?: number;
    show: boolean = false;
    team?: Team;
    players?: playerHotkeyDto[];
    overlaysToDisable: number[] = [];
    customSettings: { [key: string]: any } = {};
    damageFlowView?: DamageFlowView;
    highlightPlayerName?: string;
    showDamageTypes?: boolean;
    selectedDamageEventId?: number;
    displayMode?: ObjectiveRecapDisplayMode;
}
