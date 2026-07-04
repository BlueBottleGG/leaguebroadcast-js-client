/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { MatchRuleSet } from "./matchRuleSet";
import { teamWithMembers } from "./teamWithMembers";

export class gameWithTeams {
    teams: teamWithMembers[] = [];
    gameId: number = 0;
    matchId: number = 0;
    gameNumber: number = 0;
    gameWinnerId?: number;
    isActive: boolean = false;
    isComplete: boolean = false;
    gameTime?: number;
    gameDate?: Date;
    ruleSet: MatchRuleSet = MatchRuleSet.Standard;
    patch: string = "";
    gameVersion: string = "0.0.0";
    assetPatch: string = "0.0.0";
}
