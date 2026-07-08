/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */
import { matchOverviewTeamSummary } from "./matchOverviewTeamSummary";
export declare class matchOverviewGameSummary {
    gameId: number;
    gameNumber: number;
    gameTime: number;
    gameDate?: Date;
    gameWinnerId?: number;
    teamSummaries: {
        [key: number]: matchOverviewTeamSummary;
    };
    isComplete: boolean;
}
