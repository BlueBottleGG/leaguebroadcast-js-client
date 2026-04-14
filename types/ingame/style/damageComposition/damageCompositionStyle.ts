/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { damageCompositionBarStyle } from "./damageCompositionBarStyle";
import { damageCompositionColors } from "./damageCompositionColors";
import { damageCompositionDonutStyle } from "./damageCompositionDonutStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { imageStyle } from "../../../shared/style/imageStyle";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class damageCompositionStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    headerText: textStyle = {} as textStyle;
    headerBackground: string | colorStyle = "";
    headerTitle: string = "";
    colors: damageCompositionColors = {} as damageCompositionColors;
    playerTotalText: textStyle = {} as textStyle;
    legendText: textStyle = {} as textStyle;
    playerBar: damageCompositionBarStyle = {} as damageCompositionBarStyle;
    championIcon: imageStyle = {} as imageStyle;
    border: borderStyle = {} as borderStyle;
    donutChart: damageCompositionDonutStyle = {} as damageCompositionDonutStyle;
    fileVersion: string = "1.0";
}
