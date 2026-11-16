/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BestOfType } from "../../shared/BestOfType";

export class addMatchRequestArgs {
    name?: string;
    type: BestOfType = BestOfType.BestOf1;
    teams: number[] = [];
    isCurrent: boolean = false;
    onStage?: boolean;
    seasonId?: number;
    stageId?: number;
    groupId?: number;
    roundNumber?: number;
    sortOrder: number = 0;
    winnerNextMatchPosition?: number;
    loserNextMatchPosition?: number;
    nextMatchId?: number;
    winnerNextMatchId?: number;
    loserNextMatchId?: number;
    matchDate?: string;
    timePerGame?: number;
    ruleSet: string = "";
}
