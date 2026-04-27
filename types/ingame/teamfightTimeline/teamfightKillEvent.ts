/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { simpleChampionData } from "../../shared/simpleChampionData";
import { Team } from "../../shared/style/team";

export class teamfightKillEvent {
    gameTime: number = 0;
    killerName: string = "";
    killerDisplayName: string = "";
    victimName: string = "";
    victimDisplayName: string = "";
    killerChampion?: simpleChampionData;
    victimChampion?: simpleChampionData;
    killerTeam: Team = Team.None;
    assisterNames: string[] = [];
    assisterDisplayNames: string[] = [];
}
