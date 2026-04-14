/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CampLocation } from "./campLocation";
import { IngameObjectiveType } from "./ingameObjectiveType";

export interface iObjectiveRespawnData {
    type: IngameObjectiveType;
    timeDestroy: number;
    timeAlive?: number;
    mapSide?: CampLocation;
}
