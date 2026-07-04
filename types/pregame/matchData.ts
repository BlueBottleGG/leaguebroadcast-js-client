/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BestOfType } from "../shared/bestOfType";
import { MatchRuleSet } from "../shared/matchRuleSet";

export class matchData {
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
    ruleSet: MatchRuleSet = MatchRuleSet.Standard;
    onStage: boolean = false;
}
