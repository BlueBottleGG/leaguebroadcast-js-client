/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { dbBackupAnalysis } from "./dbBackupAnalysis";
import { dbCloudSyncResult } from "./dbCloudSyncResult";

export class dbCloudStatusResponse {
    hasFeature: boolean = false;
    syncOnLaunch: boolean = false;
    autoBackup: boolean = false;
    lastBackupAt?: Date;
    hasLocalChanges: boolean = false;
    cloudVersionCount: number = 0;
    cloudBytesUsed?: number;
    maxBytes?: number;
    maxVersions?: number;
    cloudReachable: boolean = false;
    maxFileSize?: number;
    isBackingUp: boolean = false;
    isAnalyzing: boolean = false;
    pendingSince?: Date;
    lastAttemptAt?: Date;
    lastFailure?: dbCloudSyncResult;
    cloudError?: dbCloudSyncResult;
    analysis?: dbBackupAnalysis;
    analysisCurrent: boolean = false;
    statusRevision: number = 0;
}
