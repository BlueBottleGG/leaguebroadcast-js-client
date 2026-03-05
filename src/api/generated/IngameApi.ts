/**
 * Auto-generated REST API client for In-game overlay and serialization endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-05
 */

import type { ApiClient } from "../ApiClient";

export class IngameApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET ingame/status` */
  async getGameState(): Promise<number> {
    return this.client.get<number>('ingame/status');
  }

  /** `POST ingame/enable` */
  async enableComponent(): Promise<void> {
    return this.client.post<void>('ingame/enable');
  }

  /** `POST ingame/disable` */
  async disableComponent(): Promise<void> {
    return this.client.post<void>('ingame/disable');
  }

  /** `POST ingame/mock/{doMocking}` */
  async mockIngame(doMocking: boolean): Promise<void> {
    return this.client.post<void>(`ingame/mock/${doMocking}`);
  }

  /** `GET ingame/mock` */
  async getMockingStatus(): Promise<boolean> {
    return this.client.get<boolean>('ingame/mock');
  }

  /** `GET ingame/frontend` */
  async getFrontendUrl(): Promise<string> {
    return this.client.get<string>('ingame/frontend');
  }

  /** `GET ingame/showing` */
  async getCurrentCommonSerializationOptions(): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>('ingame/showing');
  }

  /** `POST ingame/showing` */
  async setCurrentCommonSerializationOptions(data: Record<string, unknown>): Promise<void> {
    return this.client.post<void>('ingame/showing', data);
  }

  /** `GET ingame/showing/{socketid}` */
  async getCurrentFrontendSerializationOptions(socketid: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(`ingame/showing/${socketid}`);
  }

  /** `POST ingame/showing/{socketid}` */
  async setCurrentFrontendSerializationOptions(socketid: string, data: Record<string, unknown>): Promise<void> {
    return this.client.post<void>(`ingame/showing/${socketid}`, data);
  }

  /** `GET ingame/stage/{stageSide}/{playerSlot}/networkId` */
  async getPlayerPUUIDInSlot(stageSide: number, playerSlot: number): Promise<number> {
    return this.client.get<number>(`ingame/stage/${stageSide}/${playerSlot}/networkId`);
  }

  /** `GET ingame/stage/{stageSide}/ingameteamid` */
  async getIngameTeamOnStageSide(stageSide: number): Promise<number> {
    return this.client.get<number>(`ingame/stage/${stageSide}/ingameteamid`);
  }

  /** `GET ingame/state/activeOverlays` */
  async getActiveOverlays(): Promise<string[]> {
    return this.client.get<string[]>('ingame/state/activeOverlays');
  }
}

