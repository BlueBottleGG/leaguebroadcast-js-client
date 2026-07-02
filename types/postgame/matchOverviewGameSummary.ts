/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { matchOverviewTeamSummary } from "./matchOverviewTeamSummary";

export class matchOverviewGameSummary {
    gameId: number = 0;
    gameNumber: number = 0;
    gameTime: number = 0;
    gameDate?: Date;
    gameWinnerId?: number;
    teamSummaries: { [key: number]: matchOverviewTeamSummary } = {};
    isComplete: boolean = false;
}
