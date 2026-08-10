/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { playerAnalysisContentStyleV2 } from "./playerAnalysisContentStyleV2";
import { playerAnalysisIdentityStyleV2 } from "./playerAnalysisIdentityStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class playerAnalysisV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    identity: playerAnalysisIdentityStyleV2 = {} as playerAnalysisIdentityStyleV2;
    content: playerAnalysisContentStyleV2 = {} as playerAnalysisContentStyleV2;
    playerNameTemplate: string = "";
    championNameTemplate: string = "";
    teamNameTemplate: string = "";
    useTeamColors: boolean = false;
    defaultMaximumStatistics: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
