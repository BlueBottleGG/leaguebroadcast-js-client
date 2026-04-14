/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { teamfightKillEvent } from "./teamfightKillEvent";
import { teamfightTimelinePlayer } from "./teamfightTimelinePlayer";
import { teamfightTimelineSample } from "./teamfightTimelineSample";

export class ingameTeamfightTimelineData {
    startTime: number = 0;
    endTime: number = 0;
    samples: teamfightTimelineSample[] = [];
    players: teamfightTimelinePlayer[] = [];
    kills: teamfightKillEvent[] = [];
    totalDamagePerPlayer: number[] = [];
    blueTotalDamage: number = 0;
    redTotalDamage: number = 0;
    blueKills: number = 0;
    redKills: number = 0;
}
