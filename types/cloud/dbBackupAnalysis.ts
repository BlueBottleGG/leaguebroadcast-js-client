/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { dbBackupSizeCategory } from "./dbBackupSizeCategory";
import { dbBackupSizeFile } from "./dbBackupSizeFile";

export class dbBackupAnalysis {
    analyzedAt: Date = new Date();
    archiveBytes: number = 0;
    uncompressedBytes: number = 0;
    overheadBytes: number = 0;
    categories: dbBackupSizeCategory[] = [];
    largestFiles: dbBackupSizeFile[] = [];
}
