/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CombinedViewTransitionType } from "./CombinedViewTransitionType";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class postGameTransitionV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    layer: containerElementStyleV2 = {} as containerElementStyleV2;
    stinger: containerElementStyleV2 = {} as containerElementStyleV2;
    type: CombinedViewTransitionType = CombinedViewTransitionType.Cut;
    durationMs: number = 0;
    stingerUrl: string = "";
    stingerSwapTimeMs: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
