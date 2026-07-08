/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { overlayHealthIssueDto } from "../../rest/overlayhealth/overlayHealthIssueDto";
import { overlayHealthMetricsDto } from "../../rest/overlayhealth/overlayHealthMetricsDto";
import { overlaySourceDto } from "../../rest/overlayhealth/overlaySourceDto";

export class overlayHealthSnapshot {
    sessionId: string = "";
    source: overlaySourceDto = {} as overlaySourceDto;
    url: string = "";
    severity: string = "";
    lastSeen: number = 0;
    metrics: overlayHealthMetricsDto = {} as overlayHealthMetricsDto;
    issues: overlayHealthIssueDto[] = [];
}
