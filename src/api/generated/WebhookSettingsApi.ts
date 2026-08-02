/**
 * Auto-generated REST API client for Outbound webhook endpoint management.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-07-25
 */

import type { ApiClient } from "../ApiClient";
import type { webhookEndpointCreatedDto } from "#types/rest/webhooks/webhookEndpointCreatedDto";
import type { webhookEndpointCreateRequestDto } from "#types/rest/webhooks/webhookEndpointCreateRequestDto";
import type { webhookEndpointDto } from "#types/rest/webhooks/webhookEndpointDto";
import type { webhookEndpointUpdateRequestDto } from "#types/rest/webhooks/webhookEndpointUpdateRequestDto";
import type { webhookOptionsUpdateRequestDto } from "#types/rest/webhooks/webhookOptionsUpdateRequestDto";
import type { webhookSettingsDto } from "#types/rest/webhooks/webhookSettingsDto";
import type { webhookTestResultDto } from "#types/rest/webhooks/webhookTestResultDto";

export class WebhookSettingsApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET settings/webhooks` */
  async getSettings(): Promise<webhookSettingsDto> {
    return this.client.get<webhookSettingsDto>('settings/webhooks');
  }

  /** `POST settings/webhooks` */
  async createEndpoint(request: webhookEndpointCreateRequestDto): Promise<webhookEndpointCreatedDto> {
    return this.client.post<webhookEndpointCreatedDto>('settings/webhooks', request);
  }

  /** `PUT settings/webhooks/{id}` */
  async updateEndpoint(id: string, request: webhookEndpointUpdateRequestDto): Promise<webhookEndpointDto> {
    return this.client.put<webhookEndpointDto>(`settings/webhooks/${id}`, request);
  }

  /** `DELETE settings/webhooks/{id}` */
  async deleteEndpoint(id: string): Promise<void> {
    return this.client.delete<void>(`settings/webhooks/${id}`);
  }

  /** `POST settings/webhooks/{id}/rotate-secret` */
  async rotateSecret(id: string): Promise<webhookEndpointCreatedDto> {
    return this.client.post<webhookEndpointCreatedDto>(`settings/webhooks/${id}/rotate-secret`);
  }

  /** `POST settings/webhooks/{id}/test` */
  async testEndpoint(id: string): Promise<webhookTestResultDto> {
    return this.client.post<webhookTestResultDto>(`settings/webhooks/${id}/test`);
  }

  /** `PUT settings/webhooks/options` */
  async updateOptions(request: webhookOptionsUpdateRequestDto): Promise<void> {
    return this.client.put<void>('settings/webhooks/options', request);
  }
}

