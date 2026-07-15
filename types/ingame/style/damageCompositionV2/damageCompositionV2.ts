/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { damageBreakdownBarStyleV2 } from "./damageBreakdownBarStyleV2";
import { damageCompositionTeamStyleV2 } from "./damageCompositionTeamStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class damageCompositionV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    content: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeam: damageCompositionTeamStyleV2 = {} as damageCompositionTeamStyleV2;
    legend: containerElementStyleV2 = {} as containerElementStyleV2;
    legendText: textElementStyleV2 = {} as textElementStyleV2;
    redTeam: damageCompositionTeamStyleV2 = {} as damageCompositionTeamStyleV2;
    damageBar: damageBreakdownBarStyleV2 = {} as damageBreakdownBarStyleV2;
    showPercentages: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
