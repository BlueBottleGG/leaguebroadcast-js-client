/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { playerAnalysisIdentityStyleV2 } from "./playerAnalysisIdentityStyleV2";
import { playerAnalysisItemsStyleV2 } from "./playerAnalysisItemsStyleV2";
import { playerAnalysisRunesStyleV2 } from "./playerAnalysisRunesStyleV2";
import { playerAnalysisStatisticsStyleV2 } from "./playerAnalysisStatisticsStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class playerAnalysisV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    identity: playerAnalysisIdentityStyleV2 = {} as playerAnalysisIdentityStyleV2;
    content: containerElementStyleV2 = {} as containerElementStyleV2;
    runes: playerAnalysisRunesStyleV2 = {} as playerAnalysisRunesStyleV2;
    items: playerAnalysisItemsStyleV2 = {} as playerAnalysisItemsStyleV2;
    statistics: playerAnalysisStatisticsStyleV2 = {} as playerAnalysisStatisticsStyleV2;
    playerNameTemplate: string = "";
    championNameTemplate: string = "";
    teamNameTemplate: string = "";
    useTeamColors: boolean = false;
    defaultMaximumStatistics: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
