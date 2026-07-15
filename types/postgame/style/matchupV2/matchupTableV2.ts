/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyleV2 } from "../../../shared/style/colorStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { matchupScoreStyleV2 } from "./matchupScoreStyleV2";
import { matchupTeamStyleV2 } from "./matchupTeamStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class matchupTableV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    subtitle: textElementStyleV2 = {} as textElementStyleV2;
    grid: containerElementStyleV2 = {} as containerElementStyleV2;
    card: containerElementStyleV2 = {} as containerElementStyleV2;
    date: textElementStyleV2 = {} as textElementStyleV2;
    team: matchupTeamStyleV2 = {} as matchupTeamStyleV2;
    versus: textElementStyleV2 = {} as textElementStyleV2;
    score: matchupScoreStyleV2 = {} as matchupScoreStyleV2;
    columns: number = 0;
    gap: string = "";
    titleTemplate: string = "";
    subtitleTemplate: string = "";
    dateTimeTemplate: string = "";
    teamNameTemplate: string = "";
    versusText: string = "";
    upcomingBackground: colorStyleV2 = {} as colorStyleV2;
    upcomingBorder: colorStyleV2 = {} as colorStyleV2;
    customCss?: string;
    fileVersion: string = "1.0";
}
