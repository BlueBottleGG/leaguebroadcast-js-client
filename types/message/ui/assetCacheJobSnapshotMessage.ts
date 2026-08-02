/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export class assetCacheJobSnapshotMessage {
    type: string = "";
    jobId: string = "";
    sequence: number = 0;
    version?: string;
    trigger: string = "";
    state: string = "";
    phase: string = "";
    readiness: string = "";
    assetType?: string;
    completedAssets: number = 0;
    totalAssets: number = 0;
    isTotalExact: boolean = false;
    progressPercent?: number;
    elapsedMs: number = 0;
    estimatedRemainingMs?: number;
    failedAssets: number = 0;
    currentFile?: string;
    errorCode?: string;
    errorDetail?: string;
    retryable: boolean = false;
    startedAtUtc: Date = new Date();
    updatedAtUtc: Date = new Date();
}
