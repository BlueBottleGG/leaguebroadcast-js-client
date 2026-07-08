/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { overlayHealthIssueDto } from "./overlayHealthIssueDto";
import { overlayHealthMetricsDto } from "./overlayHealthMetricsDto";
import { overlaySourceDto } from "./overlaySourceDto";

export class overlayHealthReportDto {
    source: overlaySourceDto = {} as overlaySourceDto;
    sessionId: string = "";
    url: string = "";
    userAgent: string = "";
    timestamp: number = 0;
    metrics: overlayHealthMetricsDto = {} as overlayHealthMetricsDto;
    issues: overlayHealthIssueDto[] = [];
}
