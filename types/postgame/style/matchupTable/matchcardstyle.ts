/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyle } from "../../../shared/style/colorStyle";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { matchupScoreStyle } from "./matchupScoreStyle";
import { matchupVersusStyle } from "./matchupVersusStyle";
import { textStyle } from "../../../shared/style/textStyle";

export class matchCardStyle {
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    teamTag: textStyle = {} as textStyle;
    versus: matchupVersusStyle = {} as matchupVersusStyle;
    score: matchupScoreStyle = {} as matchupScoreStyle;
    iconSize: string = "";
    upcomingHighlight: string | colorStyle = "";
    upcomingBorder: string | colorStyle = "";
    winnerColor: string | colorStyle = "";
    loserColor: string | colorStyle = "";
    defaultColor: string | colorStyle = "";
    dateText: textStyle = {} as textStyle;
    dateTimeTemplate: string = "";
    teamTagTemplate: string = "";
}
