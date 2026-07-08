/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BestOfType } from "./BestOfType";
import { gameWithTeams } from "./gameWithTeams";
import { MatchLifecycleState } from "./MatchLifecycleState";
import { MatchRuleSet } from "./MatchRuleSet";
import { teamWithMembers } from "./teamWithMembers";

export class matchWithGamesAndTeams {
    games: gameWithTeams[] = [];
    teams: teamWithMembers[] = [];
    matchId: number = 0;
    seasonId: number = 0;
    winnerId?: number;
    isActive: boolean = false;
    type: BestOfType = BestOfType.BestOf1;
    nextMatchId?: number;
    winnerNextMatchId?: number;
    loserNextMatchId?: number;
    name?: string;
    date?: Date;
    lifecycleState: MatchLifecycleState = MatchLifecycleState.Scheduled;
    ruleSet: MatchRuleSet = MatchRuleSet.Standard;
    onStage: boolean = false;
}
