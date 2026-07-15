/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { animationStyleV2 } from "./animationStyleV2";
import { backgroundStyleV2 } from "./backgroundStyleV2";
import { borderStyleV2 } from "./borderStyleV2";
import { layoutStyleV2 } from "./layoutStyleV2";
import { positionTransformStyleV2 } from "./positionTransformStyleV2";
import { shadowStyleV2 } from "./shadowStyleV2";
import { sizingStyleV2 } from "./sizingStyleV2";

export class containerStyleV2 {
    animation?: animationStyleV2;
    layout: layoutStyleV2 = {} as layoutStyleV2;
    sizing: sizingStyleV2 = {} as sizingStyleV2;
    shadows?: shadowStyleV2;
    positionTransform: positionTransformStyleV2 = {} as positionTransformStyleV2;
    background: backgroundStyleV2 = {} as backgroundStyleV2;
    border: borderStyleV2 = {} as borderStyleV2;
    customCss?: string;
}
