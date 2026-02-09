/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championData } from "../shared/championData";
import { championStatistics } from "../shared/championStatistics";
import { summonerSpellData } from "../shared/summonerSpellData";

export class pickSlot {
    id: number = 0;
    isActive: boolean = false;
    player: string = "";
    summonerSpells: summonerSpellData[] = [];
    champion?: championData;
    championStatistics?: championStatistics;
}
