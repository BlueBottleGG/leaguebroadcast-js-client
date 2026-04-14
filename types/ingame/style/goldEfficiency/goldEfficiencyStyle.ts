/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { championIconStyle } from "../../../shared/style/championIconStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { goldEfficiencyHeaderStyle } from "./goldEfficiencyHeaderStyle";
import { goldEfficiencyHeatStyle } from "./goldEfficiencyHeatStyle";
import { goldEfficiencyPlayerRowStyle } from "./goldEfficiencyPlayerRowStyle";
import { layoutStyle } from "../../../shared/style/layoutStyle";

export class goldEfficiencyStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    border: borderStyle = {} as borderStyle;
    header: goldEfficiencyHeaderStyle = {} as goldEfficiencyHeaderStyle;
    playerRow: goldEfficiencyPlayerRowStyle = {} as goldEfficiencyPlayerRowStyle;
    championIcon: championIconStyle = {} as championIconStyle;
    heat: goldEfficiencyHeatStyle = {} as goldEfficiencyHeatStyle;
    fileVersion: string = "1.0";
}
