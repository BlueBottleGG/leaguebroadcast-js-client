/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { bottomRowCenterStyleV2 } from "./bottomRowCenterStyleV2";
import { bottomRowTeamStyleV2 } from "./bottomRowTeamStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { HeroStatsDisplayMode } from "../HeroStatsDisplayMode";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";

export class bottomRowV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    banRow: containerElementStyleV2 = {} as containerElementStyleV2;
    timerTrack: containerElementStyleV2 = {} as containerElementStyleV2;
    timerFill: containerElementStyleV2 = {} as containerElementStyleV2;
    draft: containerElementStyleV2 = {} as containerElementStyleV2;
    blueTeam: bottomRowTeamStyleV2 = {} as bottomRowTeamStyleV2;
    center: bottomRowCenterStyleV2 = {} as bottomRowCenterStyleV2;
    redTeam: bottomRowTeamStyleV2 = {} as bottomRowTeamStyleV2;
    activePickWidthMultiplier: number = 0;
    heroStats: HeroStatsDisplayMode = HeroStatsDisplayMode.None;
    heroStatDurationSeconds: number = 0;
    showTournament: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
