/**
 * Auto-generated REST API client for Season management endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-07-15
 */

import type { ApiClient } from "../ApiClient";
import type { matchWithGamesAndTeams } from "#types/shared/matchWithGamesAndTeams";
import type { seasonData } from "#types/shared/seasonData";
import type { seasonStandingRow } from "#types/shared/seasonStandingRow";
import type { seasonUsage } from "#types/shared/seasonUsage";
import type { teamData } from "#types/shared/teamData";
import type { teamScore } from "#types/shared/teamScore";
import type { teamWithMembers } from "#types/shared/teamWithMembers";

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

  /** `GET season/{seasonId}/usage` */
  async getSeasonUsage(seasonId: number): Promise<seasonUsage> {
    return this.client.get<seasonUsage>(`season/${seasonId}/usage`);
  }

  /** `GET season/{seasonId}/standings` */
  async getSeasonStandings(seasonId: number): Promise<seasonStandingRow[]> {
    return this.client.get<seasonStandingRow[]>(`season/${seasonId}/standings`);
  }

  /** `PUT season/{seasonId}/standings/{teamId}` */
  async setSeasonStanding(seasonId: number, teamId: number, score: teamScore): Promise<void> {
    return this.client.put<void>(`season/${seasonId}/standings/${teamId}`, score);
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
  async deleteSeason(seasonId: number): Promise<unknown> {
    return this.client.delete<unknown>(`season/${seasonId}`);
  }
}

