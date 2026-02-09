/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { singleGameGoldGraph } from "./singleGameGoldGraph";
import { teamData } from "../../shared/teamData";

export class postGameGoldGraph {
    current: singleGameGoldGraph = {} as singleGameGoldGraph;
    previousGames?: singleGameGoldGraph[];
    title?: string;
    teams: { [key: number]: teamData } = {};
}
