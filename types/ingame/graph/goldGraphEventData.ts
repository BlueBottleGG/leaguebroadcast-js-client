/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { GoldGraphEventType } from "./GoldGraphEventType";
import { IngameObjectiveType } from "../objective/IngameObjectiveType";

export class goldGraphEventData {
    gameTime: number = 0;
    type: GoldGraphEventType = GoldGraphEventType.Turret;
    team: number = 0;
    objective?: IngameObjectiveType;
    killerName?: string;
    killerDisplayName?: string;
}
