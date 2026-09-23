/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championDetailBarStyleV2 } from "./championDetailBarStyleV2";
import { championDetailPortraitStyleV2 } from "./championDetailPortraitStyleV2";
import { championDetailSlotStyleV2 } from "./championDetailSlotStyleV2";
import { championDetailStatsStyleV2 } from "./championDetailStatsStyleV2";
import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textElementStyleV2 } from "../../../shared/style/textElementStyleV2";

export class championDetailV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    panel: containerElementStyleV2 = {} as containerElementStyleV2;
    topRow: containerElementStyleV2 = {} as containerElementStyleV2;
    portrait: championDetailPortraitStyleV2 = {} as championDetailPortraitStyleV2;
    identity: containerElementStyleV2 = {} as containerElementStyleV2;
    playerName: textElementStyleV2 = {} as textElementStyleV2;
    championName: textElementStyleV2 = {} as textElementStyleV2;
    bounty: textElementStyleV2 = {} as textElementStyleV2;
    health: championDetailBarStyleV2 = {} as championDetailBarStyleV2;
    resource: championDetailBarStyleV2 = {} as championDetailBarStyleV2;
    experience: championDetailBarStyleV2 = {} as championDetailBarStyleV2;
    abilityRow: containerElementStyleV2 = {} as containerElementStyleV2;
    abilitySlot: championDetailSlotStyleV2 = {} as championDetailSlotStyleV2;
    summonerSlot: championDetailSlotStyleV2 = {} as championDetailSlotStyleV2;
    kda: textElementStyleV2 = {} as textElementStyleV2;
    stats: championDetailStatsStyleV2 = {} as championDetailStatsStyleV2;
    bountyThreshold: number = 0;
    rotationIntervalMs: number = 0;
    showRunes: boolean = false;
    customCss?: string;
    fileVersion: string = "1.0";
}
