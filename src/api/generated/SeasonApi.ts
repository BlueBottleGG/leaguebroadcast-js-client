/**
 * Auto-generated REST API client for Season management endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-09-26
 */

import type { ApiClient } from "../ApiClient";
import type { championAvailabilityWindow } from "#types/shared/championAvailabilityWindow";
import type { matchWithGamesAndTeams } from "#types/shared/matchWithGamesAndTeams";
import type { playerSeasonStatsRow } from "#types/shared/playerSeasonStatsRow";
import type { seasonAvailabilityView } from "#types/shared/seasonAvailabilityView";
import type { seasonData } from "#types/shared/seasonData";
import type { seasonGroup } from "#types/shared/seasonGroup";
import type { seasonStage } from "#types/shared/seasonStage";
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
  async getMatchesInSeason(seasonId: number, stageId?: number | null, groupId?: number | null): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`season/${seasonId}/matches${stageId !== undefined ? `?stageId=${encodeURIComponent(String(stageId))}` : ''}${groupId !== undefined ? `&groupId=${encodeURIComponent(String(groupId))}` : ''}`);
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

  /** `PUT season/{seasonId}/teams` */
  async setTeamsInSeason(seasonId: number, teamIds: number[]): Promise<void> {
    return this.client.put<void>(`season/${seasonId}/teams`, teamIds);
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
  async getSeasonStandings(seasonId: number, stageId?: number | null, groupId?: number | null): Promise<seasonStandingRow[]> {
    return this.client.get<seasonStandingRow[]>(`season/${seasonId}/standings${stageId !== undefined ? `?stageId=${encodeURIComponent(String(stageId))}` : ''}${groupId !== undefined ? `&groupId=${encodeURIComponent(String(groupId))}` : ''}`);
  }

  /** `GET season/{seasonId}/stages` */
  async getStages(seasonId: number): Promise<seasonStage[]> {
    return this.client.get<seasonStage[]>(`season/${seasonId}/stages`);
  }

  /** `POST season/{seasonId}/stages` */
  async saveStage(seasonId: number, stage: seasonStage): Promise<number> {
    return this.client.post<number>(`season/${seasonId}/stages`, stage);
  }

  /** `DELETE season/{seasonId}/stages/{stageId}` */
  async deleteStage(seasonId: number, stageId: number): Promise<void> {
    return this.client.delete<void>(`season/${seasonId}/stages/${stageId}`);
  }

  /** `GET season/{seasonId}/stages/{stageId}/groups` */
  async getGroups(seasonId: number, stageId: number): Promise<seasonGroup[]> {
    return this.client.get<seasonGroup[]>(`season/${seasonId}/stages/${stageId}/groups`);
  }

  /** `POST season/{seasonId}/stages/{stageId}/groups` */
  async saveGroup(seasonId: number, stageId: number, group: seasonGroup): Promise<number> {
    return this.client.post<number>(`season/${seasonId}/stages/${stageId}/groups`, group);
  }

  /** `DELETE season/{seasonId}/stages/{stageId}/groups/{groupId}` */
  async deleteGroup(seasonId: number, stageId: number, groupId: number): Promise<void> {
    return this.client.delete<void>(`season/${seasonId}/stages/${stageId}/groups/${groupId}`);
  }

  /** `GET season/{seasonId}/stages/{stageId}/groups/{groupId}/teams` */
  async getGroupTeams(seasonId: number, stageId: number, groupId: number): Promise<number[]> {
    return this.client.get<number[]>(`season/${seasonId}/stages/${stageId}/groups/${groupId}/teams`);
  }

  /** `PUT season/{seasonId}/stages/{stageId}/groups/{groupId}/teams` */
  async setGroupTeams(seasonId: number, stageId: number, groupId: number, teamIds: number[]): Promise<void> {
    return this.client.put<void>(`season/${seasonId}/stages/${stageId}/groups/${groupId}/teams`, teamIds);
  }

  /** `GET season/{seasonId}/playerstats` */
  async getPlayerStatsInSeason(seasonId: number, matchId?: number | null): Promise<playerSeasonStatsRow[]> {
    return this.client.get<playerSeasonStatsRow[]>(`season/${seasonId}/playerstats${matchId !== undefined ? `?matchId=${encodeURIComponent(String(matchId))}` : ''}`);
  }

  /** `GET season/{seasonId}/playerstats/mock` */
  async getMockPlayerStatsInSeason(seasonId: number): Promise<playerSeasonStatsRow[]> {
    return this.client.get<playerSeasonStatsRow[]>(`season/${seasonId}/playerstats/mock`);
  }

  /** `GET season/{seasonId}/availability` */
  async getSeasonAvailability(seasonId: number): Promise<seasonAvailabilityView> {
    return this.client.get<seasonAvailabilityView>(`season/${seasonId}/availability`);
  }

  /** `PUT season/{seasonId}/availability/{championId}` */
  async setChampionAvailability(seasonId: number, championId: number, windows: championAvailabilityWindow[]): Promise<championAvailabilityWindow[]> {
    return this.client.put<championAvailabilityWindow[]>(`season/${seasonId}/availability/${championId}`, windows);
  }

  /** `DELETE season/{seasonId}/availability/{championId}` */
  async clearChampionAvailability(seasonId: number, championId: number): Promise<void> {
    return this.client.delete<void>(`season/${seasonId}/availability/${championId}`);
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

