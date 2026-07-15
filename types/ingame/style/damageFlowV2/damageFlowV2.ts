/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { damageFlowPlayerStyleV2 } from "./damageFlowPlayerStyleV2";
import { damageFlowRibbonStyleV2 } from "./damageFlowRibbonStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textStyleV2 } from "../../../shared/style/textStyleV2";

export class damageFlowV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeamLabel: textStyleV2 = {} as textStyleV2;
    directionLabel: textStyleV2 = {} as textStyleV2;
    redTeamLabel: textStyleV2 = {} as textStyleV2;
    canvas: containerElementStyleV2 = {} as containerElementStyleV2;
    player: damageFlowPlayerStyleV2 = {} as damageFlowPlayerStyleV2;
    ribbon: damageFlowRibbonStyleV2 = {} as damageFlowRibbonStyleV2;
    cycleDurationMs: number = 0;
    maximumPlayersPerSide: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
