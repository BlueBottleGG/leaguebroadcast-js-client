/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export class webhookEndpointDto {
    id: string = "";
    name: string = "";
    url: string = "";
    enabled: boolean = false;
    events: string[] = [];
    createdAtUtc: Date = new Date();
    lastSuccessAtUtc?: Date;
    lastAttemptAtUtc?: Date;
    lastError?: string;
    consecutiveFailures: number = 0;
}
