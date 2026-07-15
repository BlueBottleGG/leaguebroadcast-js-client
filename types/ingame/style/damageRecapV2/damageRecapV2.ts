/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerElementStyleV2 } from "../../../shared/style/containerElementStyleV2";
import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { damagePaletteV2 } from "./damagePaletteV2";
import { damageRecapEntryStyleV2 } from "./damageRecapEntryStyleV2";
import { imageElementStyleV2 } from "../../../shared/style/imageElementStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { textStyleV2 } from "../../../shared/style/textStyleV2";

export class damageRecapV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    header: containerElementStyleV2 = {} as containerElementStyleV2;
    victimPortrait: imageElementStyleV2 = {} as imageElementStyleV2;
    victimDetails: containerElementStyleV2 = {} as containerElementStyleV2;
    title: textStyleV2 = {} as textStyleV2;
    victimName: textStyleV2 = {} as textStyleV2;
    totalDamage: textStyleV2 = {} as textStyleV2;
    damageStripe: containerElementStyleV2 = {} as containerElementStyleV2;
    damageColors: damagePaletteV2 = {} as damagePaletteV2;
    entries: containerElementStyleV2 = {} as containerElementStyleV2;
    entry: damageRecapEntryStyleV2 = {} as damageRecapEntryStyleV2;
    pagination: containerElementStyleV2 = {} as containerElementStyleV2;
    paginate: boolean = false;
    pageDurationInSeconds: number = 0;
    entriesPerPage: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
