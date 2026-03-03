/**
 * Composite REST API client that aggregates all generated API modules.
 *
 * Access individual API groups via the named properties:
 *
 * ```ts
 * const client = new LeagueBroadcastClient({ host: "localhost" });
 *
 * // Games
 * const game = await client.api.game.getCurrent();
 *
 * // Matches
 * const match = await client.api.match.getCurrent();
 * await client.api.match.setCurrentBestOf(BestOfType.BestOf3);
 *
 * // Seasons
 * const seasons = await client.api.season.getAll();
 *
 * // In-game overlay control
 * await client.api.ingame.enable();
 * const overlays = await client.api.ingame.getActiveOverlays();
 *
 * // Live game state (requires active game)
 * const time = await client.api.gameState.getGameTime();
 * const players = await client.api.gameState.getAllParticipants();
 *
 * // Pre-game / champion select
 * const frontendUrl = await client.api.preGame.getFrontendUrl();
 * ```
 */

import { ApiClient } from "./ApiClient";
import {
  IngameApi,
  GameApi,
  MatchApi,
  SeasonApi,
  PreGameApi,
  GameStateApi,
} from "./generated";

export class RestApi {
  private readonly client: ApiClient;

  /** In-game overlay and serialization endpoints. */
  public readonly ingame: IngameApi;

  /** Game CRUD, picks/bans, and winner endpoints. */
  public readonly game: GameApi;

  /** Match (series) management — current match, teams, fearless bans, etc. */
  public readonly match: MatchApi;

  /** Season management — CRUD, teams, icons, match listings. */
  public readonly season: SeasonApi;

  /** Champion select (pre-game) mocking, bans, frontend routing. */
  public readonly preGame: PreGameApi;

  /** Live game state — participants, dragons, ordering. Requires active game. */
  public readonly gameState: GameStateApi;

  constructor(baseUrl: string) {
    this.client = new ApiClient(baseUrl);

    this.ingame = new IngameApi(this.client);
    this.game = new GameApi(this.client);
    this.match = new MatchApi(this.client);
    this.season = new SeasonApi(this.client);
    this.preGame = new PreGameApi(this.client);
    this.gameState = new GameStateApi(this.client);
  }

  /**
   * Update the base URL for all API modules (e.g. after changing host/port).
   */
  updateBaseUrl(baseUrl: string): void {
    this.client.updateBaseUrl(baseUrl);
  }

  /**
   * Get direct access to the underlying HTTP client for custom requests.
   */
  getHttpClient(): ApiClient {
    return this.client;
  }
}
