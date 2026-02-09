/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { centerContent } from "./centerContent";
import { championSlot } from "./championSlot";
import { coachSlot } from "./coachSlot";
import { HeroStatsDisplayMode } from "./HeroStatsDisplayMode";
import { layoutStyle } from "../../shared/style/layoutStyle";
import { phaseTimer } from "./phaseTimer";
import { pickBans } from "./pickBans";
import { playerSlot } from "./playerSlot";
import { PreGameScoreDisplayMode } from "./PreGameScoreDisplayMode";
import { teamName } from "./teamName";
import { tournamentData } from "./tournamentData";

export class championSelectEUStyle {
    fileVersion: string = "1.0";
    layout: layoutStyle = {} as layoutStyle;
    playerSlotLeft: playerSlot = {} as playerSlot;
    playerSlotRight: playerSlot = {} as playerSlot;
    championSlotLeft: championSlot = {} as championSlot;
    championSlotRight: championSlot = {} as championSlot;
    pickBansLeft: pickBans = {} as pickBans;
    pickBansRight: pickBans = {} as pickBans;
    tournamentData: tournamentData = {} as tournamentData;
    teamNameRight: teamName = {} as teamName;
    teamNameLeft: teamName = {} as teamName;
    coachSlotLeft: coachSlot = {} as coachSlot;
    coachSlotRight: coachSlot = {} as coachSlot;
    phaseTimer: phaseTimer = {} as phaseTimer;
    centerContent: centerContent = {} as centerContent;
    heroStats: HeroStatsDisplayMode = HeroStatsDisplayMode.None;
    heroStatDurationSeconds: number = 0;
    showCoaches: boolean = false;
    preGameScoreDisplay: PreGameScoreDisplayMode = PreGameScoreDisplayMode.None;
}
