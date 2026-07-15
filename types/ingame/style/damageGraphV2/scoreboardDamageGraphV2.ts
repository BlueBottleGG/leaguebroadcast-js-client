/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyleV2 } from "../../../shared/style/colorStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { scoreboardDamageGraphSideV2 } from "./scoreboardDamageGraphSideV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class scoreboardDamageGraphV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    blueTeam: scoreboardDamageGraphSideV2 = {} as scoreboardDamageGraphSideV2;
    redTeam: scoreboardDamageGraphSideV2 = {} as scoreboardDamageGraphSideV2;
    physicalDamage: colorStyleV2 = {} as colorStyleV2;
    magicDamage: colorStyleV2 = {} as colorStyleV2;
    trueDamage: colorStyleV2 = {} as colorStyleV2;
    titleContent: string = "";
    fillByDamageType: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
