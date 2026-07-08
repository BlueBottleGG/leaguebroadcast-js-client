/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championCombatStats } from "./championCombatStats";
import { championRuneStat } from "./championRuneStat";
import { ingameAbilityInfo } from "../ingameAbilityInfo";
import { ingameHealthData } from "../tab/ingameHealthData";
import { ingameResourceData } from "../tab/ingameResourceData";
import { itemWithAsset } from "../itemWithAsset";
import { simpleChampionData } from "../../shared/simpleChampionData";
import { Team } from "../../shared/style/Team";

export class championDetailData {
    playerIndex: number = 0;
    team: Team = Team.None;
    name: string = "";
    displayName?: string;
    championAssets?: simpleChampionData;
    level: number = 0;
    health: ingameHealthData = {} as ingameHealthData;
    resource: ingameResourceData = {} as ingameResourceData;
    stats: championCombatStats = {} as championCombatStats;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    creepScore: number = 0;
    gold: number = 0;
    totalGold: number = 0;
    shutdownGold: number = 0;
    respawnAt?: number;
    items?: itemWithAsset[];
    abilities: ingameAbilityInfo[] = [];
    summonerSpells: ingameAbilityInfo[] = [];
    runes: championRuneStat[] = [];
}
