/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorRGBA } from "./colorRGBA";
import { StrokeLayer } from "./StrokeLayer";
import { StrokeLineStyle } from "./StrokeLineStyle";
import { StrokeTimeMode } from "./StrokeTimeMode";
import { StrokeTipStyle } from "./StrokeTipStyle";
import { StrokeTool } from "./StrokeTool";

export class partialStrokeProperties {
    active?: boolean;
    tool?: StrokeTool;
    color?: colorRGBA;
    width?: number;
    layer?: StrokeLayer;
    startTip?: StrokeTipStyle;
    endTip?: StrokeTipStyle;
    lineStyle?: StrokeLineStyle;
    vanishTime?: number;
    timeMode?: StrokeTimeMode;
    fillColor?: colorRGBA;
    hasOutline?: boolean;
    anchorMode?: boolean;
    selectedAnchorNetworkId?: number;
    cameraLockNetworkId?: number;
}
