/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { itemWithAsset } from "../itemWithAsset";

export class playerUpdateEvent {
    playerNameAndTagLine: string = "";
    guid: string = "";
    boughtItems?: itemWithAsset[];
    soldOrConsumedItems?: itemWithAsset[];
    levelUp?: number[];
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
}
