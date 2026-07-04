/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { banSlot } from "./banSlot";
import { pickSlot } from "./pickSlot";
import { simpleChampionData } from "../shared/simpleChampionData";
import { teamScore } from "../shared/teamScore";
import { teamWithMembers } from "../shared/teamWithMembers";
import { timelineEntry } from "./timelineEntry";

export class championSelectTeam {
    metaData?: teamWithMembers;
    bans: banSlot[] = [];
    slots: pickSlot[] = [];
    timeline: timelineEntry[] = [];
    index: number = 0;
    scoreMatch: teamScore = {} as teamScore;
    scoreSeason: teamScore = {} as teamScore;
    fearlessBans?: { [key: number]: simpleChampionData[] };
}
