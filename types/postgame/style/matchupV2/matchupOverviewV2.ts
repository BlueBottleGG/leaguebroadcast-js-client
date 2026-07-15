/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyleV2 } from "../../../shared/style/colorStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { imageElementStyleV2 } from "../../../shared/style/imageElementStyleV2";
import { matchupScoreStyleV2 } from "./matchupScoreStyleV2";
import { matchupTeamStyleV2 } from "./matchupTeamStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class matchupOverviewV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    subtitle: textElementStyleV2 = {} as textElementStyleV2;
    teamBar: containerElementStyleV2 = {} as containerElementStyleV2;
    team: matchupTeamStyleV2 = {} as matchupTeamStyleV2;
    versus: textElementStyleV2 = {} as textElementStyleV2;
    rows: containerElementStyleV2 = {} as containerElementStyleV2;
    gameRow: containerElementStyleV2 = {} as containerElementStyleV2;
    championList: containerElementStyleV2 = {} as containerElementStyleV2;
    champion: imageElementStyleV2 = {} as imageElementStyleV2;
    kda: textElementStyleV2 = {} as textElementStyleV2;
    gameLabel: textElementStyleV2 = {} as textElementStyleV2;
    score: matchupScoreStyleV2 = {} as matchupScoreStyleV2;
    unplayed: textElementStyleV2 = {} as textElementStyleV2;
    titleTemplate: string = "";
    subtitleTemplate: string = "";
    teamNameTemplate: string = "";
    versusText: string = "";
    gameLabelTemplate: string = "";
    unplayedTemplate: string = "";
    activeBackground: colorStyleV2 = {} as colorStyleV2;
    customCss?: string;
    fileVersion: string = "1.0";
}
