/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { announcerEvent } from "../announcer/announcerEvent";
import { ingameObjectiveEvent } from "./ingameObjectiveEvent";
import { killFeedEvent } from "./killFeedEvent";
import { playerUpdateEvent } from "./playerUpdateEvent";
import { Team } from "../../shared/style/Team";
import { teamUpdateResults } from "./teamUpdateResults";

export class transitionEvents {
    player?: playerUpdateEvent[];
    team?: teamUpdateResults[];
    objective?: ingameObjectiveEvent[];
    firstTower?: Team;
    announcements?: announcerEvent[];
    killFeed?: killFeedEvent[];
}
