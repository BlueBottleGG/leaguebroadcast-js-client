/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { objectiveDpsSample } from "./objectiveDpsSample";
import { smiteReactionResult } from "../smiteReaction/smiteReactionResult";

export class ingameObjectiveDpsData {
    objectiveName: string = "";
    startTime: number = 0;
    endTime: number = 0;
    maxHealth: number = 0;
    samples: objectiveDpsSample[] = [];
    smiteReaction?: smiteReactionResult;
}
