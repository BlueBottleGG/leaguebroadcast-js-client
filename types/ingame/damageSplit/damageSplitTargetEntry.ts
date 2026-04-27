/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { damageSplitSpellEntry } from "./damageSplitSpellEntry";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class damageSplitTargetEntry {
    target?: simpleChampionData;
    targetName: string = "";
    targetDisplayName: string = "";
    team?: number;
    spells: damageSplitSpellEntry[] = [];
    totalDamage: number = 0;
    damageByType: { [key: string]: number } = {};
}
