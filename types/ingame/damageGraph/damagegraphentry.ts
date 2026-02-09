/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ingameAbilityInfo } from "../ingameAbilityInfo";
import { itemWithAsset } from "../itemWithAsset";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class damageGraphEntry {
    champion?: simpleChampionData;
    abilities?: ingameAbilityInfo[];
    activeItems?: itemWithAsset[];
    name: string = "";
    team?: number;
    damageByType: { [key: string]: number } = {};
    totalDamageDealt: number = 0;
    respawnTime?: number;
    level?: number;
    health: number = 0;
    maxHealth: number = 0;
    role: string = "";
}
