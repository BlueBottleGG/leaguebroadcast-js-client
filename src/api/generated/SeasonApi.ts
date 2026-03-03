/**
 * Auto-generated REST API client for Season management endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-03
 */

import type { ApiClient } from "../ApiClient";
import type { matchWithGamesAndTeams } from "#types/shared/matchwithgamesandteams";
import type { seasonData } from "#types/shared/seasondata";
import type { teamData } from "#types/shared/teamdata";
import type { teamWithMembers } from "#types/shared/teamwithmembers";

export class SeasonApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET season/current` */
  async getCurrentSeason(): Promise<seasonData> {
    return this.client.get<seasonData>('season/current');
  }

  /** `GET season/current/match` */
  async getCurrentSeasonScheduledMatch(): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>('season/current/match');
  }

  /** `GET season/current/id` */
  async getCurrentSeasonId(): Promise<number> {
    return this.client.get<number>('season/current/id');
  }

  /** `POST season/current` */
  async setCurrentSeason(newCurrentSeasonId: number): Promise<void> {
    return this.client.post<void>('season/current', newCurrentSeasonId);
  }

  /** `GET season/current/teams` */
  async getCurrentSeasonTeams(): Promise<teamData[]> {
    return this.client.get<teamData[]>('season/current/teams');
  }

  /** `GET season/current/teamswithmembers` */
  async getCurrentSeasonTeamsWithMembers(): Promise<teamWithMembers[]> {
    return this.client.get<teamWithMembers[]>('season/current/teamswithmembers');
  }

  /** `GET season/current/icon` */
  async getCurrentSeasonIcon(): Promise<string> {
    return this.client.get<string>('season/current/icon');
  }

  /** `PUT season/current/icon` */
  async setCurrentSeasonIcon(): Promise<string> {
    return this.client.put<string>('season/current/icon');
  }

  /** `GET season` */
  async getAllSeasons(): Promise<seasonData[]> {
    return this.client.get<seasonData[]>('season');
  }

  /** `GET season/{seasonId}` */
  async getSeasonById(seasonId: number): Promise<seasonData> {
    return this.client.get<seasonData>(`season/${seasonId}`);
  }

  /** `GET season/{seasonId}/matches` */
  async getMatchesInSeason(seasonId: number): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`season/${seasonId}/matches`);
  }

  /** `GET season/{seasonId}/matches/count` */
  async getMatchesInSeasonCount(seasonId: number): Promise<number> {
    return this.client.get<number>(`season/${seasonId}/matches/count`);
  }

  /** `GET season/{seasonId}/matches/day/{day}` */
  async getMatchesInSeasonOnDay(seasonId: number, day: string): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`season/${seasonId}/matches/day/${day}`);
  }

  /** `GET season/{seasonId}/teams` */
  async getTeamsInSeason(seasonId: number): Promise<teamData[]> {
    return this.client.get<teamData[]>(`season/${seasonId}/teams`);
  }

  /** `GET season/{seasonId}/teamswithmembers` */
  async getTeamsWithMembersInSeason(seasonId: number): Promise<teamWithMembers[]> {
    return this.client.get<teamWithMembers[]>(`season/${seasonId}/teamswithmembers`);
  }

  /** `POST season` */
  async createOrUpdateSeason(seasonData: seasonData): Promise<number> {
    return this.client.post<number>('season', seasonData);
  }

  /** `GET season/{seasonId}/icon` */
  async getSeasonIcon(seasonId: number): Promise<string> {
    return this.client.get<string>(`season/${seasonId}/icon`);
  }

  /** `PUT season/{seasonId}/icon` */
  async setSeasonIcon(seasonId: number): Promise<string> {
    return this.client.put<string>(`season/${seasonId}/icon`);
  }

  /** `DELETE season/{seasonId}` */
  async deleteSeason(seasonId: number): Promise<void> {
    return this.client.delete<void>(`season/${seasonId}`);
  }
}

