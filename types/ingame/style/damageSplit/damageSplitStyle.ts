/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyle } from "../../../shared/style/colorStyle";
import { damageCompositionColors } from "../damageComposition/damageCompositionColors";
import { damageSplitEntryStyle } from "./damageSplitEntryStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { imageStyle } from "../../../shared/style/imageStyle";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class damageSplitStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    accentColor: string | colorStyle = "";
    playerNameText: textStyle = {} as textStyle;
    subtitleText: textStyle = {} as textStyle;
    totalDamageText: textStyle = {} as textStyle;
    entry: damageSplitEntryStyle = {} as damageSplitEntryStyle;
    portraitImage: imageStyle = {} as imageStyle;
    damageTypeColors: damageCompositionColors = {} as damageCompositionColors;
    paginate: boolean = false;
    pageDurationInSeconds: number = 0;
    fileVersion: string = "1.0";
}
