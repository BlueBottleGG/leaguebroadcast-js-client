/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { diagnosticsCounterSnapshot } from "./diagnosticsCounterSnapshot";
import { diagnosticsResourceSnapshot } from "./diagnosticsResourceSnapshot";
import { diagnosticsStageSnapshot } from "./diagnosticsStageSnapshot";

export class ingameDiagnosticsSnapshotMessage {
    type: string = "";
    status: string = "";
    measuredSeconds: number = 0;
    stages: diagnosticsStageSnapshot[] = [];
    faults: diagnosticsCounterSnapshot[] = [];
    resources: diagnosticsResourceSnapshot[] = [];
    overlays: diagnosticsStageSnapshot[] = [];
    updateTrend: number[] = [];
    rateTrend: number[] = [];
}
