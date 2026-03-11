/**
 * Auto-generated REST API client for Match (series) management endpoints.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-03-11
 */

import type { ApiClient } from "../ApiClient";
import type { matchData } from "#types/pregame/matchdata";
import type { addMatchRequestArgs } from "#types/rest/match/addmatchrequestargs";
import type { optionalMatchData } from "#types/rest/match/optionalmatchdata";
import type { BestOfType } from "#types/shared/bestoftype";
import type { gameWithTeams } from "#types/shared/gamewithteams";
import type { MatchRuleSet } from "#types/shared/matchruleset";
import type { matchWithGamesAndTeams } from "#types/shared/matchwithgamesandteams";
import type { simpleChampionData } from "#types/shared/simplechampiondata";
import type { teamWithMembers } from "#types/shared/teamwithmembers";

export class MatchApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET match/season/{seasonId}/simple` */
  async getSimpleMatches(seasonId: number): Promise<matchData[]> {
    return this.client.get<matchData[]>(`match/season/${seasonId}/simple`);
  }

  /** `GET match/season/{seasonId}` */
  async getMatches(seasonId: number): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>(`match/season/${seasonId}`);
  }

  /** `GET match/simple` */
  async getAllSimpleMatches(): Promise<matchData[]> {
    return this.client.get<matchData[]>('match/simple');
  }

  /** `GET match` */
  async getAllMatches(): Promise<matchWithGamesAndTeams[]> {
    return this.client.get<matchWithGamesAndTeams[]>('match');
  }

  /** `GET match/current` */
  async getCurrentMatch(): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>('match/current');
  }

  /** `POST match/current` */
  async completeCurrentMatch(): Promise<void> {
    return this.client.post<void>('match/current');
  }

  /** `GET match/current/id` */
  async getCurrentMatchId(): Promise<number> {
    return this.client.get<number>('match/current/id');
  }

  /** `GET match/previous/id` */
  async getPreviousMatchId(): Promise<number> {
    return this.client.get<number>('match/previous/id');
  }

  /** `POST match/current/{seriesid}` */
  async setCurrentMatch(seriesid: number): Promise<void> {
    return this.client.post<void>(`match/current/${seriesid}`);
  }

  /** `GET match/current/bestof` */
  async getCurrentMatchBestOf(): Promise<BestOfType> {
    return this.client.get<BestOfType>('match/current/bestof');
  }

  /** `PUT match/current/bestof` */
  async setCurrentMatchBestOf(type: BestOfType): Promise<void> {
    return this.client.put<void>('match/current/bestof', type);
  }

  /** `GET match/current/teams` */
  async getCurrentMatchTeams(): Promise<teamWithMembers[]> {
    return this.client.get<teamWithMembers[]>('match/current/teams');
  }

  /** `PUT match/current/teams` */
  async setCurrentMatchTeams(teamIds: number[]): Promise<void> {
    return this.client.put<void>('match/current/teams', teamIds);
  }

  /** `GET match/current/game` */
  async getCurrentGame(): Promise<gameWithTeams> {
    return this.client.get<gameWithTeams>('match/current/game');
  }

  /** `GET match/current/ruleset` */
  async getCurrentMatchRuleset(): Promise<MatchRuleSet> {
    return this.client.get<MatchRuleSet>('match/current/ruleset');
  }

  /** `PUT match/current/ruleset/{ruleset}` */
  async setCurrentMatchRuleset(ruleset: MatchRuleSet): Promise<void> {
    return this.client.put<void>(`match/current/ruleset/${ruleset}`);
  }

  /** `GET match/current/fearless/bans` */
  async getBans(): Promise<Record<number, Record<number, simpleChampionData[]>>> {
    return this.client.get<Record<number, Record<number, simpleChampionData[]>>>('match/current/fearless/bans');
  }

  /** `GET match/current/onstage` */
  async getCurrentMatchOnStage(): Promise<boolean> {
    return this.client.get<boolean>('match/current/onstage');
  }

  /** `GET match/{matchid}` */
  async getMatch(matchid: number): Promise<matchWithGamesAndTeams> {
    return this.client.get<matchWithGamesAndTeams>(`match/${matchid}`);
  }

  /** `DELETE match/{matchid}` */
  async deleteMatch(matchid: number): Promise<boolean> {
    return this.client.delete<boolean>(`match/${matchid}`);
  }

  /** `GET match/{matchid}/teams` */
  async getMatchTeams(matchid: number): Promise<teamWithMembers[]> {
    return this.client.get<teamWithMembers[]>(`match/${matchid}/teams`);
  }

  /** `PUT match/{matchid}/teams` */
  async setMatchTeams(matchid: number, teamIds: number[]): Promise<void> {
    return this.client.put<void>(`match/${matchid}/teams`, teamIds);
  }

  /** `GET match/{matchid}/games` */
  async getMatchGames(matchid: number): Promise<gameWithTeams[]> {
    return this.client.get<gameWithTeams[]>(`match/${matchid}/games`);
  }

  /** `GET match/{matchid}/winner` */
  async getMatchWinner(matchid: number): Promise<teamWithMembers> {
    return this.client.get<teamWithMembers>(`match/${matchid}/winner`);
  }

  /** `PUT match/{matchid}/winner/{teamid}` */
  async setMatchWinner(matchid: number, teamid: number): Promise<void> {
    return this.client.put<void>(`match/${matchid}/winner/${teamid}`);
  }

  /** `DELETE match/{matchid}/winner` */
  async removeMatchWinner(matchid: number): Promise<void> {
    return this.client.delete<void>(`match/${matchid}/winner`);
  }

  /** `GET match/{matchid}/bestof` */
  async getMatchBestOf(matchid: number): Promise<BestOfType> {
    return this.client.get<BestOfType>(`match/${matchid}/bestof`);
  }

  /** `PUT match/{matchid}/bestof/{type}` */
  async setMatchBestOf(matchid: number, type: BestOfType): Promise<void> {
    return this.client.put<void>(`match/${matchid}/bestof/${type}`);
  }

  /** `GET match/{matchid}/ruleset` */
  async getMatchRuleset(matchid: number): Promise<MatchRuleSet> {
    return this.client.get<MatchRuleSet>(`match/${matchid}/ruleset`);
  }

  /** `PUT match/{matchid}/ruleset/{ruleset}` */
  async setMatchRuleset(matchid: number, ruleset: MatchRuleSet): Promise<void> {
    return this.client.put<void>(`match/${matchid}/ruleset/${ruleset}`);
  }

  /** `GET match/{matchid}/name` */
  async getMatchName(matchid: number): Promise<string> {
    return this.client.get<string>(`match/${matchid}/name`);
  }

  /** `PATCH match/{matchid}/name/{matchName}` */
  async setMatchName(matchid: number, matchName: string): Promise<void> {
    return this.client.patch<void>(`match/${matchid}/name/${matchName}`);
  }

  /** `PATCH match/{matchid}` */
  async updateMatch(matchid: number, matchUpdate: optionalMatchData): Promise<void> {
    return this.client.patch<void>(`match/${matchid}`, matchUpdate);
  }

  /** `GET match/{matchid}/fearless/bans` */
  async getMatchBans(matchid: number): Promise<Record<number, Record<number, simpleChampionData[]>>> {
    return this.client.get<Record<number, Record<number, simpleChampionData[]>>>(`match/${matchid}/fearless/bans`);
  }

  /** `GET match/{seriesid}/onstage` */
  async getMatchOnStage(seriesid: number): Promise<boolean> {
    return this.client.get<boolean>(`match/${seriesid}/onstage`);
  }

  /** `PUT match` */
  async addMatch(match: addMatchRequestArgs): Promise<number> {
    return this.client.put<number>('match', match);
  }

  /** `GET match/{matchId}/stage/team/{stageSide}` */
  async getTeamOnStageSide(matchId: number, stageSide: number): Promise<teamWithMembers> {
    return this.client.get<teamWithMembers>(`match/${matchId}/stage/team/${stageSide}`);
  }

  /** `GET match/current/stage/team/{stageSide}` */
  async getTeamOnStageSideCurrent(stageSide: number): Promise<teamWithMembers> {
    return this.client.get<teamWithMembers>(`match/current/stage/team/${stageSide}`);
  }
}

