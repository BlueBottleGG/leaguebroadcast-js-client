/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { announcerEvent } from "../announcer/announcerEvent";
import { ingameObjectiveEvent } from "./ingameObjectiveEvent";
import { killFeedEvent } from "./killFeedEvent";
import { playerUpdateEvent } from "./playerUpdateEvent";
import { smiteReactionResult } from "../smiteReaction/smiteReactionResult";
import { teamUpdateResults } from "./teamUpdateResults";

export class transitionEvents {
    player?: playerUpdateEvent[];
    team?: teamUpdateResults[];
    objective?: ingameObjectiveEvent[];
    firstTower?: number;
    announcements?: announcerEvent[];
    killFeed?: killFeedEvent[];
    smiteReaction?: smiteReactionResult;
}
