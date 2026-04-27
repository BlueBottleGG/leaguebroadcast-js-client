/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { damageRecapEntry } from "./damageRecapEntry";
import { damageRecapTimelineEntry } from "./damageRecapTimelineEntry";
import { ObjectiveRecapDisplayMode } from "./objectiveRecapDisplayMode";
import { simpleChampionData } from "../../shared/simpleChampionData";
import { smiteReactionResult } from "../smiteReaction/smiteReactionResult";
import type { iSpellObjectResource } from "./iSpellObjectResource";

export class ingameDamageRecapData {
    victim?: simpleChampionData;
    victimName: string = "";
    victimDisplayName: string = "";
    deathTime: number = 0;
    entries: damageRecapEntry[] = [];
    totalDamageReceived: number = 0;
    timeline?: damageRecapTimelineEntry[];
    sourceLookup?: { [key: string]: simpleChampionData };
    spellLookup?: { [key: string]: iSpellObjectResource };
    smiteReaction?: smiteReactionResult;
    dragonType?: string;
    displayMode: ObjectiveRecapDisplayMode = ObjectiveRecapDisplayMode.None;
}
