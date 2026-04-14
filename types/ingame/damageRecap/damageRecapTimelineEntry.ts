/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DamageType } from "./damageType";

export class damageRecapTimelineEntry {
    gameTime: number = 0;
    sourceName: string = "";
    spellKey?: string;
    damage: number = 0;
    damageType: DamageType = DamageType.Physical;
    targetHealthBefore: number = 0;
    targetHealthAfter: number = 0;
    isSmite: boolean = false;
}
