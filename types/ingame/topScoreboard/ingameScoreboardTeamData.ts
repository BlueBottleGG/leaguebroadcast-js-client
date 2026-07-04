/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ingameObjectivePowerPlay } from "../ingameObjectivePowerPlay";
import { teamScore } from "../../shared/teamScore";

export class ingameScoreboardTeamData {
    teamName: string = "";
    teamTag: string = "";
    teamIconUrl: string = "";
    seriesScore: teamScore = {} as teamScore;
    totalScore: teamScore = {} as teamScore;
    infoText: string = "";
    gold: number = 0;
    kills: number = 0;
    towers: number = 0;
    towerPlates: number = 0;
    grubs: number = 0;
    dragons: string[] = [];
    baronPowerPlay?: ingameObjectivePowerPlay;
    dragonPowerPlay?: ingameObjectivePowerPlay;
}
