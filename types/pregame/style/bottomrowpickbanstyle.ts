/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { bottomRowSizeStyle } from "./bottomrow/bottomRowSizeStyle";
import { bottomRowTeamStyle } from "./bottomRowTeamStyle";
import { bottomRowTournamentData } from "./bottomRow/bottomRowTournamentData";
import { colorStyle } from "../../shared/style/colorStyle";
import { HeroStatsDisplayMode } from "./HeroStatsDisplayMode";

export class bottomRowPickBanStyle {
    fileVersion: string = "1.0";
    background: string | colorStyle = "";
    size: bottomRowSizeStyle = {} as bottomRowSizeStyle;
    tournamentData: bottomRowTournamentData = {} as bottomRowTournamentData;
    neutralColor: string | colorStyle = "";
    leftTeam: bottomRowTeamStyle = {} as bottomRowTeamStyle;
    rightTeam: bottomRowTeamStyle = {} as bottomRowTeamStyle;
    heroStats: HeroStatsDisplayMode = HeroStatsDisplayMode.None;
    heroStatDurationSeconds: number = 0;
}
