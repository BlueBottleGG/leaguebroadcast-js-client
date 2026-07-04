/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { postGameDamageGraph } from "./damage/postGameDamageGraph";
import { postGameGoldGraph } from "./gold/postGameGoldGraph";
import { postGameTeamOverview } from "./postGameTeamOverview";
import { teamData } from "../shared/teamData";

export class postGameOverview {
    gameTime: number = 0;
    gameDate?: Date;
    patch: string = "";
    winnerSide?: number;
    teamInfoBySide: { [key: number]: teamData } = {};
    teamOverviewBySide: { [key: number]: postGameTeamOverview } = {};
    goldGraph?: postGameGoldGraph;
    damageGraph?: postGameDamageGraph;
}
