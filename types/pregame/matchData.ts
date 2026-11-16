/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BestOfType } from "../shared/BestOfType";
import { MatchLifecycleState } from "../shared/MatchLifecycleState";
import { MatchRuleSet } from "../shared/MatchRuleSet";

export class matchData {
    matchId: number = 0;
    seasonId: number = 0;
    stageId?: number;
    groupId?: number;
    roundNumber?: number;
    sortOrder: number = 0;
    winnerNextMatchPosition?: number;
    loserNextMatchPosition?: number;
    leftSeedGroupId?: number;
    leftSeedRank?: number;
    rightSeedGroupId?: number;
    rightSeedRank?: number;
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
