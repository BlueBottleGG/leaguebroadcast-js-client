/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { AssetType } from "./AssetType";
import { CacheOperation } from "./CacheOperation";

export class communityDragonV2ProgressMessage {
    type: string = "";
    operation: CacheOperation = CacheOperation.Starting;
    version?: string;
    assetType?: AssetType;
    current: number = 0;
    total: number = 0;
    fileName?: string;
    message?: string;
    progressPercent: number = 0;
    estimatedRemainingMs?: number;
    elapsedMs: number = 0;
    isStepComplete: boolean = false;
    isVersionComplete: boolean = false;
    aggregateTotal: number = 0;
    aggregateCurrent: number = 0;
    aggregateProgressPercent: number = 0;
    aggregateElapsedMs: number = 0;
    aggregateEstimatedRemainingMs?: number;
}
