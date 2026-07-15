/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { damageBreakdownBarStyleV2 } from "../damageCompositionV2/damageBreakdownBarStyleV2";
import { damageSplitTargetStyleV2 } from "./damageSplitTargetStyleV2";
import { imageElementStyleV2 } from "../../../shared/style/imageElementStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class damageSplitV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    sourcePortrait: imageElementStyleV2 = {} as imageElementStyleV2;
    sourceDetails: containerElementStyleV2 = {} as containerElementStyleV2;
    sourceName: textElementStyleV2 = {} as textElementStyleV2;
    totalDamage: textElementStyleV2 = {} as textElementStyleV2;
    overallBar: damageBreakdownBarStyleV2 = {} as damageBreakdownBarStyleV2;
    targets: containerElementStyleV2 = {} as containerElementStyleV2;
    target: damageSplitTargetStyleV2 = {} as damageSplitTargetStyleV2;
    paginate: boolean = false;
    pageSize: number = 0;
    pageDurationInSeconds: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
