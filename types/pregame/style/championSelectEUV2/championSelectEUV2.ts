/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championSelectCoachesStyleV2 } from "./championSelectCoachesStyleV2";
import { championSelectDraftStyleV2 } from "./championSelectDraftStyleV2";
import { championSelectFooterStyleV2 } from "./championSelectFooterStyleV2";
import { championSelectTimerStyleV2 } from "./championSelectTimerStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class championSelectEUV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    coaches: championSelectCoachesStyleV2 = {} as championSelectCoachesStyleV2;
    timer: championSelectTimerStyleV2 = {} as championSelectTimerStyleV2;
    draft: championSelectDraftStyleV2 = {} as championSelectDraftStyleV2;
    footer: championSelectFooterStyleV2 = {} as championSelectFooterStyleV2;
    showCoaches: boolean = false;
    showChampionStatistics: boolean = false;
    statisticsDurationSeconds: number = 0;
    teamNameTemplate: string = "";
    playerNameTemplate: string = "";
    customCss?: string;
    fileVersion: string = "1.0";
}
