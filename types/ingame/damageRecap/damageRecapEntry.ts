/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { damageRecapSpellEntry } from "./damageRecapSpellEntry";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class damageRecapEntry {
    source?: simpleChampionData;
    sourceName: string = "";
    team?: number;
    spells: damageRecapSpellEntry[] = [];
    totalDamage: number = 0;
    damageByType: { [key: string]: number } = {};
}
