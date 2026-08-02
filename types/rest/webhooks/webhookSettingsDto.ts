/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { webhookEndpointDto } from "./webhookEndpointDto";
import { webhookEventCategoryDto } from "./webhookEventCategoryDto";

export class webhookSettingsDto {
    endpoints: webhookEndpointDto[] = [];
    availableEvents: string[] = [];
    categories: webhookEventCategoryDto[] = [];
    requiredFeature: string = "";
    entitled: boolean = false;
    sendMockEvents: boolean = false;
}
