/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DamageSplitMode } from "./damageSplitMode";
import { damageSplitTargetEntry } from "./damageSplitTargetEntry";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class ingameDamageSplitData {
    mode: DamageSplitMode = DamageSplitMode.Detail;
    source?: simpleChampionData;
    sourceName: string = "";
    targets: damageSplitTargetEntry[] = [];
    totalDamageDealt: number = 0;
    damageByType: { [key: string]: number } = {};
}
