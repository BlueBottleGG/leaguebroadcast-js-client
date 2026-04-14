/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { smiteReactionBadgeStyle } from "./smiteReactionBadgeStyle";
import { smiteReactionPoweredByStyle } from "./smiteReactionPoweredByStyle";
import { smiteReactionRingStyle } from "./smiteReactionRingStyle";
import { smiteReactionTextStyle } from "./smiteReactionTextStyle";

export class smiteReactionStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    border: borderStyle = {} as borderStyle;
    ring: smiteReactionRingStyle = {} as smiteReactionRingStyle;
    texts: smiteReactionTextStyle = {} as smiteReactionTextStyle;
    badges: smiteReactionBadgeStyle = {} as smiteReactionBadgeStyle;
    poweredBy: smiteReactionPoweredByStyle = {} as smiteReactionPoweredByStyle;
    durationInSeconds: number = 0;
    fileVersion: string = "1.0";
}
