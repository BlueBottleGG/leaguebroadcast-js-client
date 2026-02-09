/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championData } from "../shared/championData";
import { pickBanTimer } from "./pickBanTimer";
import { TimeLineActionType } from "./TimeLineActionType";

export class timelineEntry {
    type: TimeLineActionType = TimeLineActionType.HoverPick;
    champion: championData = {} as championData;
    timer: pickBanTimer = {} as pickBanTimer;
}
