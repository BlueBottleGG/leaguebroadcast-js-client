/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { gameTimer } from "./gameTimer";
import { globalScoreboardSection } from "./globalScoreboardSection";
import { objectiveTimer } from "./objectiveTimer";
import { tournamentLogo } from "./tournamentLogo";

export class globalScoreboard {
    tournamentLogo: tournamentLogo = {} as tournamentLogo;
    leftTeamSection: globalScoreboardSection = {} as globalScoreboardSection;
    rightTeamSection: globalScoreboardSection = {} as globalScoreboardSection;
    dragonPit: objectiveTimer = {} as objectiveTimer;
    baronPit: objectiveTimer = {} as objectiveTimer;
    gameTimer: gameTimer = {} as gameTimer;
    fileVersion: string = "1.0";
}
