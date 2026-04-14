/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { championIconStyle } from "../../../shared/style/championIconStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { teamfightDeathIconStyle } from "./teamfightDeathIconStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class teamfightTimelineStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    border: borderStyle = {} as borderStyle;
    headerBackground: string | colorStyle = "";
    titleText: textStyle = {} as textStyle;
    timeText: textStyle = {} as textStyle;
    playerNameText: textStyle = {} as textStyle;
    damageValueText: textStyle = {} as textStyle;
    blueTeamColor: string | colorStyle = "";
    redTeamColor: string | colorStyle = "";
    championIcon: championIconStyle = {} as championIconStyle;
    killFeedBackground: string | colorStyle = "";
    killFeedTimeText: textStyle = {} as textStyle;
    chartGridColor: string | colorStyle = "";
    tabText: textStyle = {} as textStyle;
    tabActiveBackground: string | colorStyle = "";
    tabInactiveBackground: string | colorStyle = "";
    overviewLabel: string = "";
    timelineLabel: string = "";
    deathIcon: teamfightDeathIconStyle = {} as teamfightDeathIconStyle;
    chartLegendText: textStyle = {} as textStyle;
    chartAxisText: textStyle = {} as textStyle;
    chartStatsText: textStyle = {} as textStyle;
    overviewDurationMs: number = 0;
    timelineDurationMs: number = 0;
    killsPerPage: number = 0;
    fileVersion: string = "1.0";
}
