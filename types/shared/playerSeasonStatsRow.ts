/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { playerSeasonChampionRow } from "./playerSeasonChampionRow";
import { TeamMemberRole } from "./TeamMemberRole";

export class playerSeasonStatsRow {
    puuid: string = "";
    memberId?: number;
    alias: string = "";
    tag: string = "";
    role: TeamMemberRole = TeamMemberRole.Unknown;
    teamId?: number;
    gamesPlayed: number = 0;
    wins: number = 0;
    winRate: number = 0;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    kdaRatio: number = 0;
    killParticipation: number = 0;
    damageShare: number = 0;
    csPerMinute: number = 0;
    goldPerMinute: number = 0;
    damagePerMinute: number = 0;
    visionScorePerGame: number = 0;
    champions: playerSeasonChampionRow[] = [];
}
