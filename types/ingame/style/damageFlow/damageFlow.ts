/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { damageFlowNodeStyle } from "./damageFlowNodeStyle";
import { damageFlowRibbonStyle } from "./damageFlowRibbonStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class damageFlow {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    border: borderStyle = {} as borderStyle;
    headerText: textStyle = {} as textStyle;
    playerNameText: textStyle = {} as textStyle;
    playerDamageText: textStyle = {} as textStyle;
    blueNode: damageFlowNodeStyle = {} as damageFlowNodeStyle;
    redNode: damageFlowNodeStyle = {} as damageFlowNodeStyle;
    ribbon: damageFlowRibbonStyle = {} as damageFlowRibbonStyle;
    nodeSize: string = "";
    nodeGap: string = "";
    cycleDurationMs: number = 0;
    fileVersion: string = "1.0";
}
