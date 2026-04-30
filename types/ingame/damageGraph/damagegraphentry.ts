/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ingameAbilityInfo } from "../ingameAbilityInfo";
import { ingameExperienceData } from "../tab/ingameExperienceData";
import { ingameHealthData } from "../tab/ingameHealthData";
import { ingameResourceData } from "../tab/ingameResourceData";
import { itemWithAsset } from "../itemWithAsset";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class damageGraphEntry {
    champion?: simpleChampionData;
    abilities?: ingameAbilityInfo[];
    activeItems?: itemWithAsset[];
    name: string = "";
    displayName: string = "";
    team?: number;
    damageByType: { [key: string]: number } = {};
    totalDamageDealt: number = 0;
    respawnAt?: number;
    level?: number;
    health?: ingameHealthData;
    resource?: ingameResourceData;
    experience?: ingameExperienceData;
    role: string = "";
}
