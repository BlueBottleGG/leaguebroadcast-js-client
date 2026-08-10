/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyleV2 } from "../../../shared/style/colorStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { imageElementStyleV2 } from "../../../shared/style/imageElementStyleV2";
import { SeasonLeaderboardStat } from "./SeasonLeaderboardStat";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class seasonLeaderboardV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    title: textElementStyleV2 = {} as textElementStyleV2;
    subtitle: textElementStyleV2 = {} as textElementStyleV2;
    table: containerElementStyleV2 = {} as containerElementStyleV2;
    columnHeader: containerElementStyleV2 = {} as containerElementStyleV2;
    columnLabel: textElementStyleV2 = {} as textElementStyleV2;
    row: containerElementStyleV2 = {} as containerElementStyleV2;
    rank: textElementStyleV2 = {} as textElementStyleV2;
    champion: imageElementStyleV2 = {} as imageElementStyleV2;
    alias: textElementStyleV2 = {} as textElementStyleV2;
    value: textElementStyleV2 = {} as textElementStyleV2;
    games: textElementStyleV2 = {} as textElementStyleV2;
    winRate: textElementStyleV2 = {} as textElementStyleV2;
    status: textElementStyleV2 = {} as textElementStyleV2;
    titleTemplate: string = "";
    subtitleTemplate: string = "";
    rankTemplate: string = "";
    gamesTemplate: string = "";
    winRateTemplate: string = "";
    defaultStat: SeasonLeaderboardStat = SeasonLeaderboardStat.KdaRatio;
    defaultCount: number = 0;
    showChampion: boolean = false;
    leaderBackground: colorStyleV2 = {} as colorStyleV2;
    leaderAccent: colorStyleV2 = {} as colorStyleV2;
    customCss?: string;
    fileVersion: string = "1.0";
}
