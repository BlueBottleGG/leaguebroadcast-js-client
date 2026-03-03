import { WebSocketManager } from "./WebSocketManager";
import { GameStateStore } from "./reactivity/GameStateStore";
import { ChampSelectStateStore } from "./reactivity/ChampSelectStateStore";
import { structuralShare } from "./reactivity/structuralShare";
import type { Subscribable, EqualityFn } from "./reactivity/GameStateStore";
import type { GameStateSnapshot } from "./reactivity/GameStateStore";
import type { ChampSelectSnapshot } from "./reactivity/ChampSelectStateStore";
import { ingameFrontendData } from "#types/ingame/ingamefrontenddata";
import { GameState } from "#types/shared/gamestate";
import type { transitionEvents } from "#types/ingame/event/transitionevents";
import type { playerUpdateEvent } from "#types/ingame/event/playerUpdateEvent";
import type { teamUpdateResults } from "#types/ingame/event/teamUpdateResults";
import type { ingameObjectiveEvent } from "#types/ingame/event/ingameObjectiveEvent";
import type { announcerEvent } from "#types/ingame/announcer/announcerEvent";
import type { killFeedEvent } from "#types/ingame/event/killFeedEvent";
import { Team } from "#types/shared/style/Team";
import { champSelectStateData } from "#types/pregame/champselectstatedata";
import type { pickBanActionEventArgs } from "#types/pregame/pickbanactioneventargs";
import { RestApi } from "./api/RestApi";

export interface LeagueBroadcastClientConfig {
  host: string;
  port?: number;
  /** In-game WebSocket route. @default "/ws/in" */
  ingameWsRoute?: string;
  /** Pre-game (champion select) WebSocket route. @default "/ws/pre" */
  preGameWsRoute?: string;
  apiRoute?: string;
  cacheRoute?: string;
  useHttps?: boolean;
  autoConnect?: boolean;
}

export interface IngameEventHandlers {
  onPlayerEvent?: (event: playerUpdateEvent) => void;
  onTeamEvent?: (event: teamUpdateResults) => void;
  onObjectiveEvent?: (event: ingameObjectiveEvent) => void;
  onFirstTowerEvent?: (teamId: Team) => void;
  onAnnouncementEvent?: (event: announcerEvent) => void;
  onKillFeedEvent?: (event: killFeedEvent) => void;
}

export interface ChampSelectEventHandlers {
  /** Fired for every pick/ban action (hover, lock, ban reveal, phase transition). */
  onAction?: (action: pickBanActionEventArgs) => void;
  /** Fired when champ select becomes active (first state update with `isActive === true`). */
  onChampSelectStart?: () => void;
  /** Fired when champ select ends (backend sends `isActive === false`). */
  onChampSelectEnd?: () => void;
  /** Fired when the frontend route changes (e.g. navigating between pre-game views). */
  onRouteUpdate?: (uri: string) => void;
}

/**
 * Main client for connecting to the League Broadcast backend.
 *
 * Internally manages **two** WebSocket connections:
 * - `/ws/in`  — real-time in-game data
 * - `/ws/pre` — champion-select (pre-game) data
 *
 * Both connections are opened on {@link connect} (or automatically if
 * `autoConnect` is `true`) and share the same host / port.
 *
 * @example
 * ```ts
 * const client = new LeagueBroadcastClient({ host: "localhost" });
 *
 * // In-game
 * client.onIngameStateUpdate(data => console.log("Game time:", data.gameTime));
 * client.watchIngame(s => s.gameData.scoreboard?.teams[0]?.kills, kills => { });
 *
 * // Pre-game
 * client.onChampSelectUpdate(data => console.log("Phase:", data.timer.phaseName));
 * client.onChampSelectEvents({ onAction: a => console.log(a) });
 * client.selectChampSelect(s => s.champSelectData.timer);
 * ```
 */
export class LeagueBroadcastClient {
  // -- WebSocket connections --------------------------------------------------
  private ingameWs: WebSocketManager;
  private preGameWs: WebSocketManager;

  private config: Required<LeagueBroadcastClientConfig>;

  // -- In-game state ----------------------------------------------------------
  private gameData: ingameFrontendData;
  private gameState: GameState = GameState.OutOfGame;
  private _isTestingEnvironment: boolean = false;

  // -- Pre-game state ---------------------------------------------------------
  private champSelectData: champSelectStateData;
  private champSelectWasActive: boolean = false;

  // -- Reactive stores --------------------------------------------------------

  /** Reactive store for **in-game** state. */
  public readonly ingameStore: GameStateStore;

  /** Reactive store for **pre-game** (champion select) state. */
  public readonly preGameStore: ChampSelectStateStore;

  // -- REST API ---------------------------------------------------------------

  /**
   * Typed REST API client for all backend HTTP endpoints.
   *
   * Provides access to game, match, season, in-game, pre-game, and
   * game-state API groups:
   *
   * ```ts
   * const game  = await client.api.game.getCurrent();
   * const match = await client.api.match.getCurrent();
   * await client.api.ingame.enable();
   * ```
   */
  public readonly api: RestApi;

  // -- In-game event handlers -------------------------------------------------
  private stateUpdateHandlers: Set<(state: ingameFrontendData) => void> =
    new Set();
  private gameStatusHandlers: Set<
    (status: GameState, isTestingEnv: boolean) => void
  > = new Set();
  private ingameEventHandlers: IngameEventHandlers = {};

  // -- Pre-game event handlers ------------------------------------------------
  private champSelectUpdateHandlers: Set<
    (state: champSelectStateData) => void
  > = new Set();
  private champSelectEventHandlers: ChampSelectEventHandlers = {};

  constructor(config: LeagueBroadcastClientConfig) {
    this.config = {
      host: config.host,
      port: config.port ?? 58869,
      ingameWsRoute: config.ingameWsRoute ?? "/ws/in",
      preGameWsRoute: config.preGameWsRoute ?? "/ws/pre",
      apiRoute: config.apiRoute ?? "/api",
      cacheRoute: config.cacheRoute ?? "/cache",
      useHttps: config.useHttps ?? false,
      autoConnect: config.autoConnect ?? true,
    };

    // REST API
    const httpProtocol = this.config.useHttps ? "https" : "http";
    const apiBaseUrl = `${httpProtocol}://${this.config.host}:${this.config.port}${this.config.apiRoute}`;
    this.api = new RestApi(apiBaseUrl);

    // Ingame
    this.ingameWs = new WebSocketManager();
    this.gameData = new ingameFrontendData();
    this.ingameStore = new GameStateStore(this.gameData, this.gameState);
    this.setupIngameMessageHandler();

    // Pre-game
    this.preGameWs = new WebSocketManager();
    this.champSelectData = new champSelectStateData();
    this.preGameStore = new ChampSelectStateStore(this.champSelectData);
    this.setupPreGameMessageHandler();

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  // ===========================================================================
  // Connection management
  // ===========================================================================

  /**
   * Connect to both in-game and pre-game WebSocket endpoints.
   *
   * Both connections are attempted in parallel. If either fails the returned
   * promise rejects, but the other connection may still succeed.
   */
  async connect(): Promise<void> {
    const protocol = this.config.useHttps ? "wss" : "ws";
    const base = `${protocol}://${this.config.host}:${this.config.port}`;

    const ingameUrl = `${base}${this.config.ingameWsRoute}`;
    const preGameUrl = `${base}${this.config.preGameWsRoute}`;

    const results = await Promise.allSettled([
      this.ingameWs.connect(ingameUrl),
      this.preGameWs.connect(preGameUrl),
    ]);

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      const reasons = (failures as PromiseRejectedResult[]).map(
        (r) => r.reason,
      );
      console.error(
        "[LeagueBroadcastClient] One or more connections failed:",
        reasons,
      );
      throw reasons[0];
    }
  }

  /**
   * Disconnect from both WebSocket endpoints.
   */
  disconnect(): void {
    this.ingameWs.disconnect();
    this.preGameWs.disconnect();
  }

  /**
   * Whether the in-game WebSocket is connected.
   */
  isIngameConnected(): boolean {
    return this.ingameWs.isConnected();
  }

  /**
   * Whether the pre-game WebSocket is connected.
   */
  isPreGameConnected(): boolean {
    return this.preGameWs.isConnected();
  }

  // ===========================================================================
  // In-game data access
  // ===========================================================================

  /** Get the current in-game data. */
  getIngameData(): ingameFrontendData {
    return this.gameData;
  }

  /** Get the current game state. */
  getIngameState(): GameState {
    return this.gameState;
  }

  /** Whether the backend is in a testing / replay environment. */
  isInTestingEnvironment(): boolean {
    return this._isTestingEnvironment;
  }

  // ===========================================================================
  // Pre-game data access
  // ===========================================================================

  /** Get the current champion-select state. */
  getChampSelectData(): champSelectStateData {
    return this.champSelectData;
  }

  /** Whether champion select is currently active. */
  isChampSelectActive(): boolean {
    return this.champSelectData.isActive;
  }

  // ===========================================================================
  // In-game event handlers
  // ===========================================================================

  /** Register a handler for in-game state updates. */
  onIngameStateUpdate(handler: (state: ingameFrontendData) => void): () => void {
    this.stateUpdateHandlers.add(handler);
    return () => this.stateUpdateHandlers.delete(handler);
  }

  /** Register a handler for in-game status changes (running, paused, out of game). */
  onIngameStatusChange(
    handler: (status: GameState, isTestingEnv: boolean) => void,
  ): () => void {
    this.gameStatusHandlers.add(handler);
    return () => this.gameStatusHandlers.delete(handler);
  }

  /** Register handlers for in-game events (kills, objectives, etc.). */
  onIngameEvents(handlers: IngameEventHandlers): void {
    this.ingameEventHandlers = { ...this.ingameEventHandlers, ...handlers };
  }

  // ===========================================================================
  // Pre-game event handlers
  // ===========================================================================

  /** Register a handler for champ-select state updates. */
  onChampSelectUpdate(
    handler: (state: champSelectStateData) => void,
  ): () => void {
    this.champSelectUpdateHandlers.add(handler);
    return () => this.champSelectUpdateHandlers.delete(handler);
  }

  /** Register handlers for champ-select lifecycle and action events. */
  onChampSelectEvents(handlers: ChampSelectEventHandlers): void {
    this.champSelectEventHandlers = {
      ...this.champSelectEventHandlers,
      ...handlers,
    };
  }

  // ===========================================================================
  // Connection event handlers
  // ===========================================================================

  /** Register a handler for in-game connection. */
  onIngameConnect(handler: () => void): () => void {
    return this.ingameWs.onConnect(handler);
  }

  /** Register a handler for in-game disconnection. */
  onIngameDisconnect(handler: () => void): () => void {
    return this.ingameWs.onDisconnect(handler);
  }

  /** Register a handler for in-game connection errors. */
  onIngameError(handler: (error: Event) => void): () => void {
    return this.ingameWs.onError(handler);
  }

  /** Register a handler for pre-game connection. */
  onPreGameConnect(handler: () => void): () => void {
    return this.preGameWs.onConnect(handler);
  }

  /** Register a handler for pre-game disconnection. */
  onPreGameDisconnect(handler: () => void): () => void {
    return this.preGameWs.onDisconnect(handler);
  }

  /** Register a handler for pre-game connection errors. */
  onPreGameError(handler: (error: Event) => void): () => void {
    return this.preGameWs.onError(handler);
  }

  // ===========================================================================
  // Reactive API — in-game (convenience wrappers around this.store)
  // ===========================================================================

  /**
   * Create a subscribable slice of **in-game** state.
   * The slice only notifies listeners when the selected value actually changes.
   *
   * Works directly with React 18+ `useSyncExternalStore`:
   * ```tsx
   * const kills = client.selectIngame(s => s.gameData.scoreboard?.teams[0]?.kills);
   * function Kills() {
   *   const value = useSyncExternalStore(kills.subscribe, kills.getSnapshot);
   *   return <span>{value}</span>;
   * }
   * ```
   */
  selectIngame<S>(
    selector: (snapshot: GameStateSnapshot) => S,
    equalityFn?: EqualityFn<S>,
  ): Subscribable<S> {
    return this.ingameStore.select(selector, equalityFn);
  }

  /**
   * Watch a derived **in-game** value and invoke `callback` whenever it changes.
   * Returns an unsubscribe function.
   *
   * ```ts
   * client.watchIngame(
   *   s => s.gameData.scoreboard?.teams[0]?.kills,
   *   (kills, prev) => console.log(`Kills: ${prev} → ${kills}`),
   * );
   * ```
   */
  watchIngame<S>(
    selector: (snapshot: GameStateSnapshot) => S,
    callback: (value: S, prev: S) => void,
    equalityFn?: EqualityFn<S>,
  ): () => void {
    return this.ingameStore.watch(selector, callback, equalityFn);
  }

  // ===========================================================================
  // Reactive API — pre-game (convenience wrappers around this.preGameStore)
  // ===========================================================================

  /**
   * Create a subscribable slice of **pre-game** (champion select) state.
   *
   * ```tsx
   * const timer = client.selectChampSelect(s => s.champSelectData.timer);
   * function DraftTimer() {
   *   const value = useSyncExternalStore(timer.subscribe, timer.getSnapshot);
   *   return <span>{value?.timeRemaining}</span>;
   * }
   * ```
   */
  selectChampSelect<S>(
    selector: (snapshot: ChampSelectSnapshot) => S,
    equalityFn?: EqualityFn<S>,
  ): Subscribable<S> {
    return this.preGameStore.select(selector, equalityFn);
  }

  /**
   * Watch a derived **pre-game** value and invoke `callback` whenever it
   * changes. Returns an unsubscribe function.
   *
   * ```ts
   * client.watchChampSelect(
   *   s => s.champSelectData.timer.timeRemaining,
   *   (remaining, prev) => console.log(`Time: ${prev} → ${remaining}`),
   * );
   * ```
   */
  watchChampSelect<S>(
    selector: (snapshot: ChampSelectSnapshot) => S,
    callback: (value: S, prev: S) => void,
    equalityFn?: EqualityFn<S>,
  ): () => void {
    return this.preGameStore.watch(selector, callback, equalityFn);
  }

  // ===========================================================================
  // URLs
  // ===========================================================================

  /** Get the base HTTP URL for API requests. */
  getApiUrl(): string {
    const protocol = this.config.useHttps ? "https" : "http";
    return `${protocol}://${this.config.host}:${this.config.port}${this.config.apiRoute}`;
  }

  /** Get the base URL for cache requests (optionally resolve a path). */
  getCacheUrl(path?: string): string {
    const protocol = this.config.useHttps ? "https" : "http";
    const baseUrl = `${protocol}://${this.config.host}:${this.config.port}${this.config.cacheRoute}`;

    if (!path) {
      return baseUrl;
    }

    // Clean up the path
    let cleanPath = path;
    if (cleanPath.startsWith("http")) {
      return cleanPath;
    }
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.slice(1);
    }
    if (cleanPath.startsWith("cache")) {
      cleanPath = cleanPath.slice(5);
    }
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.slice(1);
    }

    return `${baseUrl}/${cleanPath}`;
  }

  // ===========================================================================
  // Private — in-game message handling
  // ===========================================================================

  private setupIngameMessageHandler(): void {
    this.ingameWs.onMessage((messageData: any) => {
      switch (messageData.type) {
        case "ingame-state-update":
          this.handleStateUpdate(messageData.state, messageData.events);
          break;
        case "gameStatus":
          this.handleGameStatusUpdate(
            messageData.gameState,
            messageData.isTestingEnvironment,
          );
          break;
      }
    });
  }

  private handleStateUpdate(state: any, events?: transitionEvents): void {
    const nextData: ingameFrontendData = {
      gameTime: 0,
      playbackSpeed: 0,
      gameVersion: "",
      gameStatus: GameState.OutOfGame,
      ...state,
    };
    this.gameData = structuralShare(this.gameData, nextData);

    if (!state.gameTime || state.gameTime === 0) {
      this.handleGameStatusUpdate(GameState.OutOfGame, false);
    }

    this.ingameStore._setGameData(this.gameData);
    this.stateUpdateHandlers.forEach((handler) => handler(this.gameData));
    this.handleGameEvents(events);
  }

  private handleGameStatusUpdate(
    gameStatus: GameState,
    isTestingEnvironment: boolean = false,
  ): void {
    this._isTestingEnvironment = isTestingEnvironment;

    if (
      gameStatus === GameState.OutOfGame &&
      this.gameState !== GameState.OutOfGame
    ) {
      this.endGame();
      return;
    }

    this.gameState = gameStatus;
    this.ingameStore._setGameState(gameStatus);
    this.gameStatusHandlers.forEach((handler) =>
      handler(gameStatus, isTestingEnvironment),
    );
  }

  private handleGameEvents(events?: transitionEvents): void {
    if (!events) return;

    if (events.player && this.ingameEventHandlers.onPlayerEvent) {
      events.player.forEach((event) =>
        this.ingameEventHandlers.onPlayerEvent!(event),
      );
    }

    if (events.team && this.ingameEventHandlers.onTeamEvent) {
      events.team.forEach((event) =>
        this.ingameEventHandlers.onTeamEvent!(event),
      );
    }

    if (events.objective && this.ingameEventHandlers.onObjectiveEvent) {
      events.objective.forEach((event) =>
        this.ingameEventHandlers.onObjectiveEvent!(event),
      );
    }

    if (
      events.firstTower !== undefined &&
      this.ingameEventHandlers.onFirstTowerEvent
    ) {
      this.ingameEventHandlers.onFirstTowerEvent(events.firstTower);
    }

    if (events.announcements && this.ingameEventHandlers.onAnnouncementEvent) {
      events.announcements.forEach((event) =>
        this.ingameEventHandlers.onAnnouncementEvent!(event),
      );
    }

    if (events.killFeed && this.ingameEventHandlers.onKillFeedEvent) {
      events.killFeed.forEach((event) =>
        this.ingameEventHandlers.onKillFeedEvent!(event),
      );
    }
  }

  private endGame(): void {
    console.log("[LeagueBroadcastClient] Game ended, resetting data");

    this.gameData = new ingameFrontendData();
    this.gameState = GameState.OutOfGame;
    this._isTestingEnvironment = false;

    this.ingameStore._reset(this.gameData, GameState.OutOfGame);

    this.gameStatusHandlers.forEach((handler) =>
      handler(GameState.OutOfGame, false),
    );
    this.stateUpdateHandlers.forEach((handler) => handler(this.gameData));
  }

  // ===========================================================================
  // Private — pre-game message handling
  // ===========================================================================

  private setupPreGameMessageHandler(): void {
    this.preGameWs.onMessage((messageData: any) => {
      switch (messageData.type) {
        case "champion-select-state-update":
          this.handleChampSelectStateUpdate(messageData.state);
          break;
        case "champion-select-action":
          this.handleChampSelectAction(messageData.action);
          break;
        case "frontend-route-update":
          this.handleRouteUpdate(messageData.uri);
          break;
      }
    });
  }

  private handleChampSelectStateUpdate(state: any): void {
    const nextData: champSelectStateData = {
      isActive: false,
      isConnected: false,
      isTestingEnvironment: false,
      blueTeam: {} as any,
      redTeam: {} as any,
      metaData: {} as any,
      timer: {} as any,
      ...state,
    };

    this.champSelectData = structuralShare(this.champSelectData, nextData);

    // Detect champ select start / end transitions
    if (nextData.isActive && !this.champSelectWasActive) {
      this.champSelectWasActive = true;
      this.champSelectEventHandlers.onChampSelectStart?.();
    } else if (!nextData.isActive && this.champSelectWasActive) {
      this.champSelectWasActive = false;
      this.endChampSelect();
      return; // endChampSelect handles notifications
    }

    this.preGameStore._setChampSelectData(this.champSelectData);
    this.champSelectUpdateHandlers.forEach((handler) =>
      handler(this.champSelectData),
    );
  }

  private handleChampSelectAction(action: any): void {
    this.champSelectEventHandlers.onAction?.(action as pickBanActionEventArgs);
  }

  private handleRouteUpdate(uri: string): void {
    this.champSelectEventHandlers.onRouteUpdate?.(uri);
  }

  private endChampSelect(): void {
    console.log("[LeagueBroadcastClient] Champ select ended, resetting data");

    this.champSelectData = new champSelectStateData();
    this.preGameStore._reset(this.champSelectData);

    this.champSelectEventHandlers.onChampSelectEnd?.();
    this.champSelectUpdateHandlers.forEach((handler) =>
      handler(this.champSelectData),
    );
  }
}
