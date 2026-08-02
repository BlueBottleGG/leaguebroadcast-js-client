/**
 * Auto-generated REST API client for Companion remote-control pairing token management.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-07-23
 */

import type { ApiClient } from "../ApiClient";
import type { companionPairingCreatedDto } from "#types/rest/companion/companionPairingCreatedDto";
import type { companionPairingCreateRequestDto } from "#types/rest/companion/companionPairingCreateRequestDto";
import type { companionPairingTokenDto } from "#types/rest/companion/companionPairingTokenDto";

export class CompanionPairingApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET settings/companion/pairing` */
  async listTokens(): Promise<companionPairingTokenDto[]> {
    return this.client.get<companionPairingTokenDto[]>('settings/companion/pairing');
  }

  /** `POST settings/companion/pairing` */
  async createToken(request: companionPairingCreateRequestDto): Promise<companionPairingCreatedDto> {
    return this.client.post<companionPairingCreatedDto>('settings/companion/pairing', request);
  }

  /** `DELETE settings/companion/pairing/{id}` */
  async revokeToken(id: string): Promise<void> {
    return this.client.delete<void>(`settings/companion/pairing/${id}`);
  }
}

