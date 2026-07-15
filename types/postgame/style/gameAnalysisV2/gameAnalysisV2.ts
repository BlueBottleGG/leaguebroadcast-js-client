/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { gameAnalysisDamageStyleV2 } from "./gameAnalysisDamageStyleV2";
import { gameAnalysisGoldStyleV2 } from "./gameAnalysisGoldStyleV2";
import { gameAnalysisObjectivesStyleV2 } from "./gameAnalysisObjectivesStyleV2";
import { gameAnalysisTeamIdentityStyleV2 } from "./gameAnalysisTeamIdentityStyleV2";
import { gameAnalysisTimerStyleV2 } from "./gameAnalysisTimerStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class gameAnalysisV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    root: containerElementStyleV2 = {} as containerElementStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeam: gameAnalysisTeamIdentityStyleV2 = {} as gameAnalysisTeamIdentityStyleV2;
    timer: gameAnalysisTimerStyleV2 = {} as gameAnalysisTimerStyleV2;
    redTeam: gameAnalysisTeamIdentityStyleV2 = {} as gameAnalysisTeamIdentityStyleV2;
    main: containerElementStyleV2 = {} as containerElementStyleV2;
    damage: gameAnalysisDamageStyleV2 = {} as gameAnalysisDamageStyleV2;
    objectives: gameAnalysisObjectivesStyleV2 = {} as gameAnalysisObjectivesStyleV2;
    gold: gameAnalysisGoldStyleV2 = {} as gameAnalysisGoldStyleV2;
    blueTeamNameTemplate: string = "";
    redTeamNameTemplate: string = "";
    useTeamColors: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
