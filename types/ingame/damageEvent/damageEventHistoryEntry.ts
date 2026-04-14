/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DamageEventType } from "./damageEventType";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class damageEventHistoryEntry {
    id: number = 0;
    eventType: DamageEventType = DamageEventType.PlayerDeath;
    gameTime: number = 0;
    victimChampion?: simpleChampionData;
    victimName: string = "";
    killerChampion?: simpleChampionData;
    killerName: string = "";
    totalDamage: number = 0;
    victimTeam?: number;
    teamfightStartTime?: number;
    teamfightEndTime?: number;
}
