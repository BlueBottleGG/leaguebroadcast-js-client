/**
 * Auto-generated REST API client for Live game state endpoints (requires active game).
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-05
 */

import type { ApiClient } from "../ApiClient";
import type { tabPlayer } from "#types/ingame/tab/tabplayer";

export class GameStateApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET game/state/time` */
  async getGameTime(): Promise<number> {
    return this.client.get<number>('game/state/time');
  }

  /** `GET game/state/team/{teamId}/dragons` */
  async getTeamDragons(teamId: number): Promise<string[]> {
    return this.client.get<string[]>(`game/state/team/${teamId}/dragons`);
  }

  /** `PATCH game/state/team/{teamId}/dragons` */
  async updateTeamDragons(teamId: number, dragons: string[]): Promise<void> {
    return this.client.patch<void>(`game/state/team/${teamId}/dragons`, dragons);
  }

  /** `GET game/state/team/all/index` */
  async getActiveTeams(): Promise<number[]> {
    return this.client.get<number[]>('game/state/team/all/index');
  }

  /** `GET game/state/team/all/participant` */
  async getAllTeamParticipants(): Promise<Record<number, tabPlayer[]>> {
    return this.client.get<Record<number, tabPlayer[]>>('game/state/team/all/participant');
  }

  /** `GET game/state/team/{teamId}/participant` */
  async getTeamParticipants(teamId: number): Promise<tabPlayer[]> {
    return this.client.get<tabPlayer[]>(`game/state/team/${teamId}/participant`);
  }

  /** `GET game/state/team/all/participant/order` */
  async getTeamParticipantOrder(): Promise<string[]> {
    return this.client.get<string[]>('game/state/team/all/participant/order');
  }

  /** `PUT game/state/team/all/participant/order` */
  async updateTeamParticipantOrder(orderedNames: string[]): Promise<void> {
    return this.client.put<void>('game/state/team/all/participant/order', orderedNames);
  }
}

