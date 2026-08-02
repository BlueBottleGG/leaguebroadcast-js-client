/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { gameAnalysisDamageStyleV2 } from "./gameAnalysisDamageStyleV2";
import { gameAnalysisHeaderStyleV2 } from "./gameAnalysisHeaderStyleV2";
import { gameAnalysisSummaryStyleV2 } from "./gameAnalysisSummaryStyleV2";
import { goldGraphV2 } from "../../../ingame/style/graph/goldGraphV2/goldGraphV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class gameAnalysisV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    content: containerElementStyleV2 = {} as containerElementStyleV2;
    header: gameAnalysisHeaderStyleV2 = {} as gameAnalysisHeaderStyleV2;
    main: containerElementStyleV2 = {} as containerElementStyleV2;
    damage: gameAnalysisDamageStyleV2 = {} as gameAnalysisDamageStyleV2;
    summary: gameAnalysisSummaryStyleV2 = {} as gameAnalysisSummaryStyleV2;
    goldGraph: goldGraphV2 = {} as goldGraphV2;
    showHeralds: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
