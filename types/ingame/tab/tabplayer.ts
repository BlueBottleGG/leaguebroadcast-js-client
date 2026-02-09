/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ingameAbilityInfo } from "../ingameAbilityInfo";
import { ingameExperienceData } from "./ingameExperienceData";
import { ingameHealthData } from "./ingameHealthData";
import { ingameResourceData } from "./ingameResourceData";
import { perkInfoV2 } from "../../shared/perkInfoV2";
import { simpleChampionData } from "../../shared/simpleChampionData";

export class tabPlayer {
    id: string = "";
    playerName: string = "";
    playerHashtag: string = "";
    championAssets?: simpleChampionData;
    abilities: ingameAbilityInfo[] = [];
    perks: perkInfoV2[] = [];
    health: ingameHealthData = {} as ingameHealthData;
    resource: ingameResourceData = {} as ingameResourceData;
    stacksData?: number;
    hasBaron: boolean = false;
    hasElder: boolean = false;
    level: number = 0;
    experience: ingameExperienceData = {} as ingameExperienceData;
    timeToRespawn?: number;
}
