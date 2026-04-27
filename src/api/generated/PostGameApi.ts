/**
 * Auto-generated REST API client for Post-game overview, stats, graphs, and analysis endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-04-27
 */

import type { ApiClient } from "../ApiClient";
import type { Lane } from "#types/hotkey/lane";
import type { activeComponentChangedEventArgs } from "#types/message/ui/activecomponentchangedeventargs";
import type { postGameDamageGraph } from "#types/postgame/damage/postGameDamageGraph";
import type { postGameGoldGraph } from "#types/postgame/gold/postGameGoldGraph";
import type { matchOverviewData } from "#types/postgame/matchoverviewdata";
import type { postGameOverview } from "#types/postgame/postGameOverview";
import type { postGamePlayerRunesAndItems } from "#types/postgame/postgameplayerrunesanditems";
import type { postGamePlayerStats } from "#types/postgame/postgameplayerstats";
import type { postGameTeamOverview } from "#types/postgame/postGameTeamOverview";
import type { matchWithGamesAndTeams } from "#types/shared/matchWithGamesAndTeams";
import type { Team } from "#types/shared/style/team";

export class PostGameApi {
  constructor(private readonly client: ApiClient) {}

  /** `POST postgame/route/{uri}` */
  async changeRoute(uri: string, ComponentData: unknown): Promise<unknown> {
    return this.client.post<unknown>(`postgame/route/${uri}`, ComponentData);
  }

  /** `POST postgame/mock/{mocking}` */
  async setMocking(mocking: boolean): Promise<boolean> {
    return this.client.post<boolean>(`postgame/mock/${mocking}`);
  }

  /** `GET postgame/mock` */
  async getMocking(): Promise<boolean> {
    return this.client.get<boolean>('postgame/mock');
  }

  /** `GET postgame/frontend` */
  async getFrontendUrl(): Promise<string> {
    return this.client.get<string>('postgame/frontend');
  }

  /** `POST postgame/frontend` */
  async changeRouting(uri: string): Promise<void> {
    return this.client.post<void>(`postgame/frontend?uri=${encodeURIComponent(String(uri))}`);
  }

  /** `GET postgame/overview/{gameId}` */
  async getGameOverview(gameId: number): Promise<postGameOverview> {
    return this.client.get<postGameOverview>(`postgame/overview/${gameId}`);
  }

  /** `GET postgame/overview/current` */
  async getCurrentGameOverview(): Promise<postGameOverview> {
    return this.client.get<postGameOverview>('postgame/overview/current');
  }

  /** `GET postgame/overview/mock` */
  async getMockGameOverview(): Promise<postGameOverview> {
    return this.client.get<postGameOverview>('postgame/overview/mock');
  }

  /** `GET postgame/matchdata/{gameId}` */
  async getMatchData(gameId: number): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>(`postgame/matchdata/${gameId}`);
  }

  /** `GET postgame/matchdata/current` */
  async getCurrentMatchData(): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>('postgame/matchdata/current');
  }

  /** `GET postgame/matchdata/mock` */
  async getMockMatchData(): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>('postgame/matchdata/mock');
  }

  /** `GET postgame/matchdata` */
  async getMatchDataRange(startDate: string | null, endDate: string | null, startGameId: number | null, endGameId: number | null, teamId: number | null): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`postgame/matchdata?startDate=${encodeURIComponent(String(startDate))}&endDate=${encodeURIComponent(String(endDate))}&startGameId=${encodeURIComponent(String(startGameId))}&endGameId=${encodeURIComponent(String(endGameId))}&teamId=${encodeURIComponent(String(teamId))}`);
  }

  /** `GET postgame/matchdata/mock/filter` */
  async getMockMatchDataRange(startDate: string | null, endDate: string | null, startGameId: number | null, endGameId: number | null, teamId: number | null): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`postgame/matchdata/mock/filter?startDate=${encodeURIComponent(String(startDate))}&endDate=${encodeURIComponent(String(endDate))}&startGameId=${encodeURIComponent(String(startGameId))}&endGameId=${encodeURIComponent(String(endGameId))}&teamId=${encodeURIComponent(String(teamId))}`);
  }

  /** `GET postgame/matchoverview/{matchId}` */
  async getMatchOverview(matchId: number): Promise<matchOverviewData> {
    return this.client.get<matchOverviewData>(`postgame/matchoverview/${matchId}`);
  }

  /** `GET postgame/matchoverview/current` */
  async getCurrentMatchOverview(): Promise<matchOverviewData> {
    return this.client.get<matchOverviewData>('postgame/matchoverview/current');
  }

  /** `GET postgame/matchoverview/mock` */
  async getMockMatchOverview(): Promise<matchOverviewData> {
    return this.client.get<matchOverviewData>('postgame/matchoverview/mock');
  }

  /** `GET postgame/items_and_runes/{gameId}/{playerIndex}` */
  async getItemsAndRunes(gameId: number, playerIndex: number): Promise<postGamePlayerRunesAndItems> {
    return this.client.get<postGamePlayerRunesAndItems>(`postgame/items_and_runes/${gameId}/${playerIndex}`);
  }

  /** `GET postgame/items_and_runes/{gameId}/{teamSide}/{lane}` */
  async getItemsAndRunesByTeamAndLane(gameId: number, teamSide: Team, lane: Lane): Promise<postGamePlayerRunesAndItems> {
    return this.client.get<postGamePlayerRunesAndItems>(`postgame/items_and_runes/${gameId}/${teamSide}/${lane}`);
  }

  /** `GET postgame/items_and_runes/mock` */
  async getMockItemAndRunes(): Promise<postGamePlayerRunesAndItems> {
    return this.client.get<postGamePlayerRunesAndItems>('postgame/items_and_runes/mock');
  }

  /** `GET postgame/player_stats/{gameId}/{playerIndex}` */
  async getPlayerStats(gameId: number, playerIndex: number): Promise<postGamePlayerStats> {
    return this.client.get<postGamePlayerStats>(`postgame/player_stats/${gameId}/${playerIndex}`);
  }

  /** `GET postgame/player_stats/{gameId}/{teamSide}/{lane}` */
  async getPlayerStatsByTeamAndLane(gameId: number, teamSide: Team, lane: Lane): Promise<postGamePlayerStats> {
    return this.client.get<postGamePlayerStats>(`postgame/player_stats/${gameId}/${teamSide}/${lane}`);
  }

  /** `GET postgame/player_stats/mock` */
  async getMockPlayerStats(): Promise<postGamePlayerStats> {
    return this.client.get<postGamePlayerStats>('postgame/player_stats/mock');
  }

  /** `GET postgame/gold/{gameId}` */
  async getGameGoldGraph(gameId: number): Promise<postGameGoldGraph> {
    return this.client.get<postGameGoldGraph>(`postgame/gold/${gameId}`);
  }

  /** `GET postgame/gold/mock` */
  async getMockGameGoldGraph(): Promise<postGameGoldGraph> {
    return this.client.get<postGameGoldGraph>('postgame/gold/mock');
  }

  /** `GET postgame/damage/{gameId}` */
  async getGameDamageGraph(gameId: number): Promise<postGameDamageGraph> {
    return this.client.get<postGameDamageGraph>(`postgame/damage/${gameId}`);
  }

  /** `GET postgame/damage/mock` */
  async getMockGameDamageGraph(): Promise<postGameDamageGraph> {
    return this.client.get<postGameDamageGraph>('postgame/damage/mock');
  }

  /** `GET postgame/team/{matchId}` */
  async getTeamPostGameData(matchId: number): Promise<Record<number, postGameTeamOverview>> {
    return this.client.get<Record<number, postGameTeamOverview>>(`postgame/team/${matchId}`);
  }

  /** `GET postgame/team/mock` */
  async getMockTeamPostGameData(): Promise<Record<number, postGameTeamOverview>> {
    return this.client.get<Record<number, postGameTeamOverview>>('postgame/team/mock');
  }

  /** `POST postgame/active/{componentType}/current` */
  async setActiveCurrentPostGameAnalysis(componentType: string, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/current`, body);
  }

  /** `POST postgame/active/{componentType}/current/team/{teamSide}` */
  async setActiveCurrentPostGameAnalysisWithTeam(componentType: string, teamSide: Team, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/current/team/${teamSide}`, body);
  }

  /** `POST postgame/active/{componentType}/current/player/{playerIndex}` */
  async setActiveCurrentPostGameAnalysisWithPlayer(componentType: string, playerIndex: number, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/current/player/${playerIndex}`, body);
  }

  /** `POST postgame/active/{componentType}/{gameId}` */
  async setActivePostGameAnalysis(componentType: string, gameId: number, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/${gameId}`, body);
  }

  /** `POST postgame/active/{componentType}/match/{matchId}` */
  async setActivePostGameAnalysisWithMatch(componentType: string, matchId: number, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/match/${matchId}`, body);
  }

  /** `POST postgame/active/{componentType}/{gameId}/team/{teamSide}` */
  async setActivePostGameAnalysisWithTeam(componentType: string, gameId: number, teamSide: Team, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/${gameId}/team/${teamSide}`, body);
  }

  /** `POST postgame/active/{componentType}/{gameId}/player/{playerIndex}` */
  async setActivePostGameAnalysisWithPlayer(componentType: string, gameId: number, playerIndex: number, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/${gameId}/player/${playerIndex}`, body);
  }

  /** `POST postgame/active/{componentType}/{gameId}/player/{teamSide}/{lane}` */
  async setActivePostGameAnalysisWithPlayerTeamAndLane(componentType: string, gameId: number, teamSide: Team, lane: Lane, body: unknown): Promise<void> {
    return this.client.post<void>(`postgame/active/${componentType}/${gameId}/player/${teamSide}/${lane}`, body);
  }

  /** `GET postgame/active-component` */
  async getActivePostGameAnalysis(): Promise<activeComponentChangedEventArgs> {
    return this.client.get<activeComponentChangedEventArgs>('postgame/active-component');
  }

  /** `DELETE postgame/active-component` */
  async clearActivePostGameAnalysis(): Promise<void> {
    return this.client.delete<void>('postgame/active-component');
  }
}

