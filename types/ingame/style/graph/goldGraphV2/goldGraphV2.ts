/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../../shared/style/containerStyleV2";
import { goldGraphGridStyleV2 } from "./goldGraphGridStyleV2";
import { goldGraphSeriesStyleV2 } from "./goldGraphSeriesStyleV2";
import { styleNodeMeta } from "../../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../../shared/style/textElementStyleV2";
import { textStyleV2 } from "../../../../shared/style/textStyleV2";

export class goldGraphV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeam: textElementStyleV2 = {} as textElementStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    difference: textElementStyleV2 = {} as textElementStyleV2;
    redTeam: textElementStyleV2 = {} as textElementStyleV2;
    plot: containerElementStyleV2 = {} as containerElementStyleV2;
    axis: textStyleV2 = {} as textStyleV2;
    grid: goldGraphGridStyleV2 = {} as goldGraphGridStyleV2;
    blueSeries: goldGraphSeriesStyleV2 = {} as goldGraphSeriesStyleV2;
    redSeries: goldGraphSeriesStyleV2 = {} as goldGraphSeriesStyleV2;
    extendToSide: boolean = false;
    showPreviousGames: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
