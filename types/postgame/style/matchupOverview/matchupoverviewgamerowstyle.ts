/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championIconStyle } from "../../../shared/style/championIconStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { ContentAlign } from "../../../shared/style/contentAlign";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class matchupOverviewGameRowStyle {
    background: string | colorStyle = "";
    activeBackground: string | colorStyle = "";
    layout: layoutStyle = {} as layoutStyle;
    gap: string = "";
    championIcon: championIconStyle = {} as championIconStyle;
    championIconGap: string = "";
    championsAlign: ContentAlign = ContentAlign.TopLeft;
    kdaText: textStyle = {} as textStyle;
    kdaLayout: layoutStyle = {} as layoutStyle;
    gameTimeText: textStyle = {} as textStyle;
    scoreText: textStyle = {} as textStyle;
    scoreLayout: layoutStyle = {} as layoutStyle;
    gameTimeLabelText: string = "";
    winnerColor: string | colorStyle = "";
    loserColor: string | colorStyle = "";
    showDifferentTextWhenUnplayed: boolean = false;
    unplayedScoreRow: textStyle = {} as textStyle;
    unplayedScoreRowLabelText: string = "";
}
