/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championSelectTeamStyleV2 } from "./championSelectTeamStyleV2";
import { championSelectTimerStyleV2 } from "./championSelectTimerStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { imageElementStyleV2 } from "../../../shared/style/imageElementStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class championSelectEUV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    root: containerElementStyleV2 = {} as containerElementStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    patch: textElementStyleV2 = {} as textElementStyleV2;
    tournamentIcon: imageElementStyleV2 = {} as imageElementStyleV2;
    timer: championSelectTimerStyleV2 = {} as championSelectTimerStyleV2;
    eventName: textElementStyleV2 = {} as textElementStyleV2;
    teams: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeam: championSelectTeamStyleV2 = {} as championSelectTeamStyleV2;
    redTeam: championSelectTeamStyleV2 = {} as championSelectTeamStyleV2;
    showCoaches: boolean = false;
    showChampionStatistics: boolean = false;
    statisticsDurationSeconds: number = 0;
    teamNameTemplate: string = "";
    playerNameTemplate: string = "";
    customCss?: string;
    fileVersion: string = "1.0";
}
