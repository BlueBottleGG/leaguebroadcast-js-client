/**
 * Auto-generated REST API client for In-game overlay and serialization endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-04-27
 */

import type { ApiClient } from "../ApiClient";
import type { damageEventHistoryEntry } from "#types/ingame/damageEvent/damageEventHistoryEntry";
import type { ObjectiveRecapDisplayMode } from "#types/ingame/damageRecap/objectiveRecapDisplayMode";

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

  /** `GET ingame/damage/history` */
  async getDamageEventHistory(): Promise<damageEventHistoryEntry[]> {
    return this.client.get<damageEventHistoryEntry[]>('ingame/damage/history');
  }

  /** `POST ingame/damage/select/{eventId}` */
  async selectDamageEvent(eventId: number, displayMode?: ObjectiveRecapDisplayMode | null): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>(`ingame/damage/select/${eventId}${displayMode !== undefined ? `?displayMode=${encodeURIComponent(String(displayMode))}` : ''}`);
  }

  /** `POST ingame/damage/deselect` */
  async deselectDamageEvent(): Promise<void> {
    return this.client.post<void>('ingame/damage/deselect');
  }

  /** `POST ingame/objective/select/{eventId}` */
  async selectObjectiveForDps(eventId: number): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>(`ingame/objective/select/${eventId}`);
  }

  /** `POST ingame/objective/deselect` */
  async deselectObjectiveForDps(): Promise<void> {
    return this.client.post<void>('ingame/objective/deselect');
  }

  /** `POST ingame/teamfight/start` */
  async startTeamfightTracking(): Promise<unknown> {
    return this.client.post<unknown>('ingame/teamfight/start');
  }

  /** `POST ingame/teamfight/stop` */
  async stopTeamfightTracking(): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>('ingame/teamfight/stop');
  }

  /** `GET ingame/teamfight/active` */
  async getActiveTeamfight(): Promise<unknown> {
    return this.client.get<unknown>('ingame/teamfight/active');
  }

  /** `POST ingame/teamfight/select/{eventId}` */
  async selectTeamfightTimeline(eventId: number): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>(`ingame/teamfight/select/${eventId}`);
  }

  /** `POST ingame/teamfight/deselect` */
  async deselectTeamfightTimeline(): Promise<void> {
    return this.client.post<void>('ingame/teamfight/deselect');
  }

  /** `POST ingame/damage/select/latest` */
  async selectLatestDamageEvent(displayMode?: ObjectiveRecapDisplayMode | null): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>(`ingame/damage/select/latest${displayMode !== undefined ? `?displayMode=${encodeURIComponent(String(displayMode))}` : ''}`);
  }

  /** `POST ingame/objective/select/latest` */
  async selectLatestObjectiveEvent(displayMode?: ObjectiveRecapDisplayMode | null, dps?: boolean): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>(`ingame/objective/select/latest${displayMode !== undefined ? `?displayMode=${encodeURIComponent(String(displayMode))}` : ''}${dps !== undefined ? `&dps=${encodeURIComponent(String(dps))}` : ''}`);
  }

  /** `POST ingame/teamfight/select/latest` */
  async selectLatestTeamfightTimeline(): Promise<damageEventHistoryEntry> {
    return this.client.post<damageEventHistoryEntry>('ingame/teamfight/select/latest');
  }
}

