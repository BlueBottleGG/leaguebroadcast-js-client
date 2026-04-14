/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BestOfType } from "../../shared/bestOfType";

export class addMatchRequestArgs {
    name?: string;
    type: BestOfType = BestOfType.BestOf1;
    teams: number[] = [];
    isCurrent: boolean = false;
    onStage?: boolean;
    seasonId?: number;
    nextMatchId?: number;
    winnerNextMatchId?: number;
    loserNextMatchId?: number;
    matchDate?: string;
    timePerGame?: number;
    ruleSet: string = "";
}
