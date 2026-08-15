/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { licensingResponseRecord } from "./licensingResponseRecord";

export class licensingStatusResponse {
    authorityAvailable: boolean = false;
    requiresResponse: boolean = false;
    canDecline?: boolean;
    plan?: string;
    useRight?: string;
    currentBaseTermsVersion?: string;
    currentLeagueBroadcastScheduleVersion?: string;
    effectiveAt?: Date;
    responseDeadlineAt?: Date;
    paidThrough?: Date;
    cancellationEffectiveAt?: Date;
    termsUrls?: { [key: string]: string };
    scheduleUrls?: { [key: string]: string };
    response?: licensingResponseRecord;
    grantedUseRight?: string;
    legacyUseRight?: string;
    legacyUseUntil?: Date;
}
