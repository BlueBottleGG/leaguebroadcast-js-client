/**
 * Auto-generated REST API client for Game CRUD and draft (picks/bans) endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-05
 */

import type { ApiClient } from "../ApiClient";
import type { gameWithTeams } from "#types/shared/gamewithteams";
import type { simpleChampionData } from "#types/shared/simplechampiondata";
import type { teamWithMembers } from "#types/shared/teamwithmembers";

export class GameApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET game/current` */
  async getCurrentGame(): Promise<gameWithTeams> {
    return this.client.get<gameWithTeams>('game/current');
  }

  /** `GET game/previous` */
  async getPreviousGame(): Promise<number> {
    return this.client.get<number>('game/previous');
  }

  /** `GET game/{gameid}` */
  async getGame(gameid: number): Promise<gameWithTeams> {
    return this.client.get<gameWithTeams>(`game/${gameid}`);
  }

  /** `PATCH game/{gameid}` */
  async updateGame(gameid: number, game: unknown): Promise<void> {
    return this.client.patch<void>(`game/${gameid}`, game);
  }

  /** `PUT game/{gameid}/teams` */
  async setSideSelection(gameid: number, teams: number[]): Promise<void> {
    return this.client.put<void>(`game/${gameid}/teams`, teams);
  }

  /** `GET game/{gameid}/teams` */
  async getTeamsInGame(gameid: number): Promise<teamWithMembers[]> {
    return this.client.get<teamWithMembers[]>(`game/${gameid}/teams`);
  }

  /** `DELETE game/{gameid}/winner` */
  async removeGameWinner(gameid: number): Promise<void> {
    return this.client.delete<void>(`game/${gameid}/winner`);
  }

  /** `PUT game/{gameid}/winner/{teamid}` */
  async setGameWinner(gameid: number, teamid: number): Promise<void> {
    return this.client.put<void>(`game/${gameid}/winner/${teamid}`);
  }

  /** `GET game/{gameid}/bans` */
  async getBans(gameid: number): Promise<simpleChampionData[]> {
    return this.client.get<simpleChampionData[]>(`game/${gameid}/bans`);
  }

  /** `GET game/{gameid}/bans/{teamid}` */
  async getBansForTeam(gameid: number, teamid: number): Promise<simpleChampionData[]> {
    return this.client.get<simpleChampionData[]>(`game/${gameid}/bans/${teamid}`);
  }

  /** `PUT game/{gameid}/bans` */
  async setBans(gameid: number, bans: Record<number, (string | null)[]>): Promise<void> {
    return this.client.put<void>(`game/${gameid}/bans`, bans);
  }

  /** `PUT game/{gameid}/bans/{teamid}` */
  async setBansForTeam(gameid: number, teamid: number, bans: (string | null)[]): Promise<void> {
    return this.client.put<void>(`game/${gameid}/bans/${teamid}`, bans);
  }

  /** `GET game/{gameid}/picks` */
  async getPicks(gameid: number): Promise<Record<number, simpleChampionData[]>> {
    return this.client.get<Record<number, simpleChampionData[]>>(`game/${gameid}/picks`);
  }

  /** `GET game/{gameid}/picks/{teamid}` */
  async getPicksForTeam(gameid: number, teamid: number): Promise<simpleChampionData[]> {
    return this.client.get<simpleChampionData[]>(`game/${gameid}/picks/${teamid}`);
  }

  /** `PUT game/{gameid}/picks` */
  async setPicks(gameid: number, picks: Record<number, (string | null)[]>): Promise<void> {
    return this.client.put<void>(`game/${gameid}/picks`, picks);
  }

  /** `PUT game/{gameid}/picks/{teamid}` */
  async setPicksForTeam(gameid: number, teamid: number, picks: (string | null)[]): Promise<void> {
    return this.client.put<void>(`game/${gameid}/picks/${teamid}`, picks);
  }
}

