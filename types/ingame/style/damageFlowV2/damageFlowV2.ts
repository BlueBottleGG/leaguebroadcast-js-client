/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { damageFlowCanvasStyleV2 } from "./damageFlowCanvasStyleV2";
import { damageFlowHeaderStyleV2 } from "./damageFlowHeaderStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class damageFlowV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: damageFlowHeaderStyleV2 = {} as damageFlowHeaderStyleV2;
    canvas: damageFlowCanvasStyleV2 = {} as damageFlowCanvasStyleV2;
    cycleDurationMs: number = 0;
    maximumPlayersPerSide: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
