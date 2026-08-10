/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { AvailabilitySource } from "./AvailabilitySource";

export class championAvailabilityWindow {
    windowId: number = 0;
    seasonId: number = 0;
    championId: number = 0;
    fromPatch?: string;
    toPatch?: string;
    fromDate?: Date;
    toDate?: Date;
    note?: string;
    source: AvailabilitySource = AvailabilitySource.Derived;
}
