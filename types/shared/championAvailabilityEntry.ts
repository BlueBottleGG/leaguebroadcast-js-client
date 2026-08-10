/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { AvailabilitySource } from "./AvailabilitySource";
import { championAvailabilityWindow } from "./championAvailabilityWindow";

export class championAvailabilityEntry {
    championId: number = 0;
    alias: string = "";
    name: string = "";
    squareImg?: string;
    source: AvailabilitySource = AvailabilitySource.Derived;
    windows: championAvailabilityWindow[] = [];
    ledgerFirstSeenPatch?: string;
    eligibleGames: number = 0;
    pickCount: number = 0;
    banCount: number = 0;
    conflictGames: number = 0;
}
