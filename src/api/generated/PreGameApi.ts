/**
 * Auto-generated REST API client for Champion select (pre-game) endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-05
 */

import type { ApiClient } from "../ApiClient";
import type { simpleChampionData } from "#types/shared/simplechampiondata";

export class PreGameApi {
  constructor(private readonly client: ApiClient) {}

  /** `POST championselect/mock/{doMocking}` */
  async mockChampionSelect(doMocking: boolean, randomizationinterval?: number): Promise<boolean> {
    return this.client.post<boolean>(`championselect/mock/${doMocking}${randomizationinterval !== undefined ? `?randomizationinterval=${encodeURIComponent(String(randomizationinterval))}` : ''}`);
  }

  /** `GET championselect/mock` */
  async getMockingStatus(): Promise<boolean> {
    return this.client.get<boolean>('championselect/mock');
  }

  /** `GET championselect/bans` */
  async getBans(): Promise<Record<number, Record<number, simpleChampionData[]>>> {
    return this.client.get<Record<number, Record<number, simpleChampionData[]>>>('championselect/bans');
  }

  /** `GET championselect/frontend` */
  async getFrontendUrl(): Promise<string> {
    return this.client.get<string>('championselect/frontend');
  }

  /** `GET championselect/stage/{stageSide}/teamid` */
  async getTeamIdOnSide(stageSide: number): Promise<number> {
    return this.client.get<number>(`championselect/stage/${stageSide}/teamid`);
  }

  /** `POST championselect/frontend` */
  async changeRouting(uri: string): Promise<void> {
    return this.client.post<void>(`championselect/frontend?uri=${encodeURIComponent(String(uri))}`);
  }

  /** `GET championselect/stage/{stageside}/{slotid}` */
  async getPlayerPUUIDInSlot(stageside: number, slotid: number): Promise<string> {
    return this.client.get<string>(`championselect/stage/${stageside}/${slotid}`);
  }
}

