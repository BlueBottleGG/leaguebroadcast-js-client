import { WebSocketManager } from "./WebSocketManager";
import { GameStateStore } from "./reactivity/GameStateStore";
import { ChampSelectStateStore } from "./reactivity/ChampSelectStateStore";
import { PostGameStateStore } from "./reactivity/PostGameStateStore";
import { structuralShare } from "./reactivity/structuralShare";
import type { Subscribable, EqualityFn } from "./reactivity/GameStateStore";
import type { GameStateSnapshot } from "./reactivity/GameStateStore";
import type { ChampSelectSnapshot } from "./reactivity/ChampSelectStateStore";
import type { PostGameSnapshot } from "./reactivity/PostGameStateStore";
import { ingameFrontendData } from "#types/ingame/ingameFrontendData";
import { GameState } from "#types/shared/GameState";
import type { transitionEvents } from "#types/ingame/event/transitionEvents";
import type { playerUpdateEvent } from "#types/ingame/event/playerUpdateEvent";
import type { teamUpdateResults } from "#types/ingame/event/teamUpdateResults";
import type { ingameObjectiveEvent } from "#types/ingame/event/ingameObjectiveEvent";
import type { announcerEvent } from "#types/ingame/announcer/announcerEvent";
import type { killFeedEvent } from "#types/ingame/event/killFeedEvent";
import { Team } from "#types/shared/style/Team";
import { champSelectStateData } from "#types/pregame/champSelectStateData";
import type { pickBanActionEventArgs } from "#types/pregame/pickBanActionEventArgs";
import { postGameStateData } from "#types/postgame/postGameStateData";
import type { postGameOverview } from "#types/postgame/postGameOverview";
import type { activeComponentChangedEventArgs } from "#types/message/ui/activeComponentChangedEventArgs";
import { RestApi } from "./api/RestApi";
import { smiteReactionResult } from "#types/ingame/smiteReaction/smiteReactionResult";
import {
  createIngameTimerUtils,
  type BoundIngameTimerUtils,
} from "./util/ingameTimerUtils";
import { startOverlayHealth, type OverlayHealthHandle } from "#overlay-health";

// Module-level clock — one interval drives gameTime for all timer consumers
let _clockInterval: ReturnType<typeof setInterval> | null = null;

export interface LeagueBroadcastClientConfig {
  host: string;
  port?: number;
  /** In-game WebSocket route. @default "/ws/in" */
  ingameWsRoute?: string;
  /** Pre-game (champion select) WebSocket route. @default "/ws/pre" */
  preGameWsRoute?: string;
  /**
   * Post-game (analysis) WebSocket route. @default "/ws/post"
   * Set to `false` to disable the post-game WebSocket connection entirely.
   */
  postGameWsRoute?: string | false;
  apiRoute?: string;
  cacheRoute?: string;
  useHttps?: boolean;
  autoConnect?: boolean;
  overlayHealth?: boolean | { enabled?: boolean; name?: string };
}

export interface IngameEventHandlers {
  onPlayerEvent?: (event: playerUpdateEvent) => void;
  onTeamEvent?: (event: teamUpdateResults) => void;
  onObjectiveEvent?: (event: ingameObjectiveEvent) => void;
  onFirstTowerEvent?: (teamId: Team) => void;
  onAnnouncementEvent?: (event: announcerEvent) => void;
  onKillFeedEvent?: (event: killFeedEvent) => void;
  onSmiteReactionEvent?: (event: smiteReactionResult) => void;
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

export interface PostGameEventHandlers {
  /** Fired when the backend broadcasts a postgame route change ("postgame-route-change" or "frontend-route-update"). */
  onRouteUpdate?: (uri: string) => void;
  /** Fired when postgame mocking is toggled on the backend. */
  onMockingUpdate?: (mocking: boolean) => void;
  /** Fired when the active postgame analysis component changes. */
  onActiveComponentChanged?: (args: activeComponentChangedEventArgs) => void;
  /** Fired when postgame becomes active via showPostGame(). */
  onPostGameShow?: (overview: postGameOverview) => void;
  /** Fired when postgame is hidden/reset. */
  onPostGameHide?: () => void;
}

/**
 * Main client for connecting to the League Broadcast backend.
 *
 * Internally manages **three** WebSocket connections:
 * - `/ws/in`   — real-time in-game data
 * - `/ws/pre`  — champion-select (pre-game) data
 * - `/ws/post` — post-game (analysis) data
 *
 * All connections are opened on {@link connect} (or automatically if
 * `autoConnect` is `true`) and share the same host / port. The post-game
 * connection can be disabled by setting `postGameWsRoute` to `false`.
 *
 * @example
 * ```ts
 * const client = new LeagueBroadcastClient({ host: "localhost" });
 *
 * // In-game state & events
 * client.onIngameStateUpdate(data => console.log("Game time:", data.gameTime));
 * client.watchIngame(s => s.gameData.scoreboard?.teams[0]?.kills, kills => { });
 * client.onIngameEvents({ onKillFeedEvent: e => console.log(e) });
 *
 * // Timer utilities — gameTime is read automatically
 * client.timers.isPlayerDead(player);
 * client.timers.getAbilityCooldownRemaining(ability);
 * client.timers.getItemCooldownFraction(item); // 0 = just activated, 1 = ready
 *
 * // Pre-game
 * client.onChampSelectUpdate(data => console.log("Phase:", data.timer.phaseName));
 * client.onChampSelectEvents({ onAction: a => console.log(a) });
 * client.selectChampSelect(s => s.champSelectData.timer);
 *
 * // Post-game
 * const overview = await client.showPostGame();
 * client.onPostGameUpdate(data => console.log("Winner:", data.overview?.winnerSide));
 * client.onPostGameEvents({ onActiveComponentChanged: a => console.log(a) });
 * client.selectPostGame(s => s.postGameData.overview);
 * ```
 */
export class LeagueBroadcastClient {
  // -- WebSocket connections --------------------------------------------------
  private ingameWs: WebSocketManager;
  private preGameWs: WebSocketManager;
  private postGameWs: WebSocketManager;

  private config: Required<LeagueBroadcastClientConfig>;

  // -- Frontend-health monitoring ---------------------------------------------
  private _overlayHealth: OverlayHealthHandle | null = null;

  // -- In-game state ----------------------------------------------------------
  private gameData: ingameFrontendData;
  private gameState: GameState = GameState.OutOfGame;
  private _isTestingEnvironment: boolean = false;

  // -- Pre-game state ---------------------------------------------------------
  private champSelectData: champSelectStateData;
  private champSelectWasActive: boolean = false;

  // -- Post-game state --------------------------------------------------------
  private postGameData: postGameStateData;

  // -- Reactive stores --------------------------------------------------------

  /** Reactive store for **in-game** state. */
  public readonly ingameStore: GameStateStore;

  /** Reactive store for **pre-game** (champion select) state. */
  public readonly preGameStore: ChampSelectStateStore;

  /** Reactive store for **post-game** (analysis) state. */
  public readonly postGameStore: PostGameStateStore;

  /**
   * Timer utilities pre-bound to this client's current game time.
   * No need to pass `gameTime` manually — it is read from the latest
   * in-game state on every call.
   *
   * @example
   * ```ts
   * const dead = client.timers.isPlayerDead(player);
   * const remaining = client.timers.getAbilityCooldownRemaining(ability);
   * ```
   */
  public readonly timers: BoundIngameTimerUtils;

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
  private ingameEventHandlers: {
    onPlayerEvent: Set<(event: playerUpdateEvent) => void>;
    onTeamEvent: Set<(event: teamUpdateResults) => void>;
    onObjectiveEvent: Set<(event: ingameObjectiveEvent) => void>;
    onFirstTowerEvent: Set<(teamId: Team) => void>;
    onAnnouncementEvent: Set<(event: announcerEvent) => void>;
    onKillFeedEvent: Set<(event: killFeedEvent) => void>;
    onSmiteReactionEvent: Set<(event: smiteReactionResult) => void>;
  } = {
    onPlayerEvent: new Set(),
    onTeamEvent: new Set(),
    onObjectiveEvent: new Set(),
    onFirstTowerEvent: new Set(),
    onAnnouncementEvent: new Set(),
    onKillFeedEvent: new Set(),
    onSmiteReactionEvent: new Set(),
  };

  // -- Pre-game event handlers ------------------------------------------------
  private champSelectUpdateHandlers: Set<
    (state: champSelectStateData) => void
  > = new Set();
  private champSelectEventHandlers: {
    onAction: Set<(action: pickBanActionEventArgs) => void>;
    onChampSelectStart: Set<() => void>;
    onChampSelectEnd: Set<() => void>;
    onRouteUpdate: Set<(uri: string) => void>;
  } = {
    onAction: new Set(),
    onChampSelectStart: new Set(),
    onChampSelectEnd: new Set(),
    onRouteUpdate: new Set(),
  };

  // -- Post-game event handlers -----------------------------------------------
  private postGameUpdateHandlers: Set<(state: postGameStateData) => void> =
    new Set();
  private postGameEventHandlers: {
    onRouteUpdate: Set<(uri: string) => void>;
    onMockingUpdate: Set<(mocking: boolean) => void>;
    onActiveComponentChanged: Set<
      (args: activeComponentChangedEventArgs) => void
    >;
    onPostGameShow: Set<(overview: postGameOverview) => void>;
    onPostGameHide: Set<() => void>;
  } = {
    onRouteUpdate: new Set(),
    onMockingUpdate: new Set(),
    onActiveComponentChanged: new Set(),
    onPostGameShow: new Set(),
    onPostGameHide: new Set(),
  };

  constructor(config: LeagueBroadcastClientConfig) {
    this.config = {
      host: config.host,
      port: config.port ?? 58869,
      ingameWsRoute: config.ingameWsRoute ?? "/ws/in",
      preGameWsRoute: config.preGameWsRoute ?? "/ws/pre",
      postGameWsRoute: config.postGameWsRoute ?? "/ws/post",
      apiRoute: config.apiRoute ?? "/api",
      cacheRoute: config.cacheRoute ?? "/cache",
      useHttps: config.useHttps ?? false,
      autoConnect: config.autoConnect ?? true,
      overlayHealth: config.overlayHealth ?? true,
    };

    // REST API
    const httpProtocol = this.config.useHttps ? "https" : "http";
    const apiBaseUrl = `${httpProtocol}://${this.config.host}:${this.config.port}${this.config.apiRoute}`;
    this.api = new RestApi(apiBaseUrl);

    // Timer utilities bound to current game time, normalized by elapsed time since snapshot creation
    this.timers = createIngameTimerUtils(() => this.gameData.gameTime);

    // Ingame
    this.ingameWs = new WebSocketManager();
    this.gameData = new ingameFrontendData();
    this.ingameStore = new GameStateStore(this.gameData, this.gameState);
    this.setupIngameMessageHandler();
    this.ingameWs.onDisconnect(() => this.endGame());

    // Pre-game
    this.preGameWs = new WebSocketManager();
    this.champSelectData = new champSelectStateData();
    this.preGameStore = new ChampSelectStateStore(this.champSelectData);
    this.setupPreGameMessageHandler();
    this.preGameWs.onDisconnect(() => this.endChampSelect());

    // Post-game
    this.postGameWs = new WebSocketManager();
    this.postGameData = new postGameStateData();
    this.postGameStore = new PostGameStateStore(this.postGameData);
    this.setupPostGameMessageHandler();

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  // ===========================================================================
  // Internal clock management
  // ===========================================================================

  private _startClock() {
    if (_clockInterval !== null) return;
    _clockInterval = setInterval(() => {
      if (
        this.gameState === GameState.Running ||
        this.gameState === GameState.Mocking
      ) {
        this.gameData.gameTime += this.gameData.playbackSpeed ?? 1;
        // Notify handlers of the updated gameTime
        this.stateUpdateHandlers.forEach((handler) => handler(this.gameData));
        this.ingameStore._setGameData(this.gameData);
      }
    }, 1000);
  }

  private _stopClock() {
    if (_clockInterval !== null) {
      clearInterval(_clockInterval);
      _clockInterval = null;
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
    this.startOverlayHealthIfEnabled();

    const protocol = this.config.useHttps ? "wss" : "ws";
    const base = `${protocol}://${this.config.host}:${this.config.port}`;

    const ingameUrl = `${base}${this.config.ingameWsRoute}`;
    const preGameUrl = `${base}${this.config.preGameWsRoute}`;

    const connections = [
      this.ingameWs.connect(ingameUrl),
      this.preGameWs.connect(preGameUrl),
    ];

    // Post-game connection is optional — skipped when disabled via config.
    if (this.config.postGameWsRoute !== false) {
      const postGameUrl = `${base}${this.config.postGameWsRoute}`;
      connections.push(this.postGameWs.connect(postGameUrl));
    }

    const results = await Promise.allSettled(connections);

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
    this.postGameWs.disconnect();
    this._overlayHealth?.stop();
    this._overlayHealth = null;
  }

  /**
   * Starts passive frontend-health monitoring once, unless disabled via the
   * `overlayHealth` config. Guarded so it never throws into the client.
   */
  private startOverlayHealthIfEnabled(): void {
    if (this._overlayHealth) return;

    const setting = this.config.overlayHealth;
    if (setting === false) return;
    const opts = typeof setting === "object" ? setting : {};
    if (opts.enabled === false) return;

    try {
      this._overlayHealth = startOverlayHealth({
        source: { kind: "sdk", name: opts.name },
        host: this.config.host,
        port: this.config.port,
        useHttps: this.config.useHttps,
      });
    } catch {
      // Frontend-health monitoring must never break the client.
    }
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

  /**
   * Whether the post-game WebSocket is connected.
   */
  isPostGameConnected(): boolean {
    return this.postGameWs.isConnected();
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
  // Post-game data access
  // ===========================================================================

  /** Get the current post-game state. */
  getPostGameData(): postGameStateData {
    return this.postGameData;
  }

  /** Whether post-game is currently active. */
  isPostGameActive(): boolean {
    return this.postGameData.isActive;
  }

  // ===========================================================================
  // In-game event handlers
  // ===========================================================================

  /** Register a handler for in-game state updates. */
  onIngameStateUpdate(
    handler: (state: ingameFrontendData) => void,
  ): () => void {
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

  /** Register handlers for in-game events (kills, objectives, etc.). Returns an unsubscribe function. */
  onIngameEvents(handlers: IngameEventHandlers): () => void {
    const entries = Object.entries(handlers) as [
      keyof IngameEventHandlers,
      NonNullable<IngameEventHandlers[keyof IngameEventHandlers]>,
    ][];
    for (const [key, handler] of entries) {
      if (handler) {
        (this.ingameEventHandlers[key] as Set<typeof handler>).add(handler);
      }
    }
    return () => {
      for (const [key, handler] of entries) {
        if (handler) {
          (this.ingameEventHandlers[key] as Set<typeof handler>).delete(
            handler,
          );
        }
      }
    };
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

  /** Register handlers for champ-select lifecycle and action events. Returns an unsubscribe function. */
  onChampSelectEvents(handlers: ChampSelectEventHandlers): () => void {
    const entries = Object.entries(handlers) as [
      keyof ChampSelectEventHandlers,
      NonNullable<ChampSelectEventHandlers[keyof ChampSelectEventHandlers]>,
    ][];
    for (const [key, handler] of entries) {
      if (handler) {
        (this.champSelectEventHandlers[key] as Set<typeof handler>).add(
          handler,
        );
      }
    }
    return () => {
      for (const [key, handler] of entries) {
        if (handler) {
          (this.champSelectEventHandlers[key] as Set<typeof handler>).delete(
            handler,
          );
        }
      }
    };
  }

  // ===========================================================================
  // Post-game event handlers
  // ===========================================================================

  /** Register a handler for post-game state updates. */
  onPostGameUpdate(handler: (state: postGameStateData) => void): () => void {
    this.postGameUpdateHandlers.add(handler);
    return () => this.postGameUpdateHandlers.delete(handler);
  }

  /** Register handlers for post-game lifecycle and analysis events. Returns an unsubscribe function. */
  onPostGameEvents(handlers: PostGameEventHandlers): () => void {
    const entries = Object.entries(handlers) as [
      keyof PostGameEventHandlers,
      NonNullable<PostGameEventHandlers[keyof PostGameEventHandlers]>,
    ][];
    for (const [key, handler] of entries) {
      if (handler) {
        (this.postGameEventHandlers[key] as Set<typeof handler>).add(handler);
      }
    }
    return () => {
      for (const [key, handler] of entries) {
        if (handler) {
          (this.postGameEventHandlers[key] as Set<typeof handler>).delete(
            handler,
          );
        }
      }
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

  /** Register a handler for post-game connection. */
  onPostGameConnect(handler: () => void): () => void {
    return this.postGameWs.onConnect(handler);
  }

  /** Register a handler for post-game disconnection. */
  onPostGameDisconnect(handler: () => void): () => void {
    return this.postGameWs.onDisconnect(handler);
  }

  /** Register a handler for post-game connection errors. */
  onPostGameError(handler: (error: Event) => void): () => void {
    return this.postGameWs.onError(handler);
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
  // Reactive API — post-game (convenience wrappers around this.postGameStore)
  // ===========================================================================

  /**
   * Create a subscribable slice of **post-game** (analysis) state.
   *
   * ```tsx
   * const overview = client.selectPostGame(s => s.postGameData.overview);
   * function Winner() {
   *   const value = useSyncExternalStore(overview.subscribe, overview.getSnapshot);
   *   return <span>{value?.winnerSide}</span>;
   * }
   * ```
   */
  selectPostGame<S>(
    selector: (snapshot: PostGameSnapshot) => S,
    equalityFn?: EqualityFn<S>,
  ): Subscribable<S> {
    return this.postGameStore.select(selector, equalityFn);
  }

  /**
   * Watch a derived **post-game** value and invoke `callback` whenever it
   * changes. Returns an unsubscribe function.
   *
   * ```ts
   * client.watchPostGame(
   *   s => s.postGameData.overview?.winnerSide,
   *   (winner, prev) => console.log(`Winner: ${prev} → ${winner}`),
   * );
   * ```
   */
  watchPostGame<S>(
    selector: (snapshot: PostGameSnapshot) => S,
    callback: (value: S, prev: S) => void,
    equalityFn?: EqualityFn<S>,
  ): () => void {
    return this.postGameStore.watch(selector, callback, equalityFn);
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
  getCacheUrl(path?: string, preventCacheBust: boolean = false): string {
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

    if (preventCacheBust) {
      const cacheBust = `cb=${Date.now()}`;
      cleanPath = cleanPath.includes("?")
        ? `${cleanPath}&${cacheBust}`
        : `${cleanPath}?${cacheBust}`;
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

    // Adjust gameTime for the time elapsed since the snapshot was captured
    // (network + processing latency). utcTime is the lb-side
    // UTC millisecond timestamp at snapshot time; Date.now() is the client's
    // current UTC milliseconds. The difference is the age of the snapshot.
    const snapshotAge =
      state.utcTime != null
        ? Math.max(0, (Date.now() - state.utcTime) / 1000)
        : 0;
    const correctedGameTime =
      (state.gameTime ?? 0) + snapshotAge * (state.playbackSpeed ?? 1);
    // Sync gameTime: snap on large drift (e.g. pause/resume), otherwise let
    // the internal clock tick smoothly between backend updates.
    if (Math.abs(correctedGameTime - (this.gameData.gameTime ?? 0)) > 2) {
      nextData.gameTime = correctedGameTime;
    } else {
      nextData.gameTime = this.gameData.gameTime ?? 0;
    }

    this.gameData = structuralShare(this.gameData, nextData);

    if (!state.gameTime || state.gameTime === 0) {
      this.handleGameStatusUpdate(GameState.OutOfGame, false);
    }

    // Start or stop the single client-level clock
    const shouldRun =
      state.gameStatus === GameState.Running ||
      state.gameStatus === GameState.Mocking;
    if (shouldRun) {
      this._startClock();
    } else {
      this._stopClock();
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

    // Manage the clock based on game status
    const shouldRun =
      gameStatus === GameState.Running || gameStatus === GameState.Mocking;
    if (shouldRun) {
      this._startClock();
    } else {
      this._stopClock();
    }

    this.ingameStore._setGameState(gameStatus);
    this.gameStatusHandlers.forEach((handler) =>
      handler(gameStatus, isTestingEnvironment),
    );
  }

  private handleGameEvents(events?: transitionEvents): void {
    if (!events) return;

    if (events.player) {
      events.player.forEach((event) =>
        this.ingameEventHandlers.onPlayerEvent.forEach((h) => h(event)),
      );
    }

    if (events.team) {
      events.team.forEach((event) =>
        this.ingameEventHandlers.onTeamEvent.forEach((h) => h(event)),
      );
    }

    if (events.objective) {
      events.objective.forEach((event) =>
        this.ingameEventHandlers.onObjectiveEvent.forEach((h) => h(event)),
      );
    }

    if (events.firstTower !== undefined) {
      this.ingameEventHandlers.onFirstTowerEvent.forEach((h) =>
        h(events.firstTower!),
      );
    }

    if (events.announcements) {
      events.announcements.forEach((event) =>
        this.ingameEventHandlers.onAnnouncementEvent.forEach((h) => h(event)),
      );
    }

    if (events.killFeed) {
      events.killFeed.forEach((event) =>
        this.ingameEventHandlers.onKillFeedEvent.forEach((h) => h(event)),
      );
    }

    if (events.smiteReaction !== undefined) {
      this.ingameEventHandlers.onSmiteReactionEvent.forEach((h) =>
        h(events.smiteReaction!),
      );
    }
  }

  private endGame(): void {
    console.log("[LeagueBroadcastClient] Game ended, resetting data");

    this._stopClock();

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
      this.champSelectEventHandlers.onChampSelectStart.forEach((h) => h());
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
    this.champSelectEventHandlers.onAction.forEach((h) =>
      h(action as pickBanActionEventArgs),
    );
  }

  private handleRouteUpdate(uri: string): void {
    this.champSelectEventHandlers.onRouteUpdate.forEach((h) => h(uri));
  }

  private endChampSelect(): void {
    console.log("[LeagueBroadcastClient] Champ select ended, resetting data");

    this.champSelectData = new champSelectStateData();
    this.preGameStore._reset(this.champSelectData);

    this.champSelectEventHandlers.onChampSelectEnd.forEach((h) => h());
    this.champSelectUpdateHandlers.forEach((handler) =>
      handler(this.champSelectData),
    );
  }

  // ===========================================================================
  // Private — post-game message handling
  // ===========================================================================

  private setupPostGameMessageHandler(): void {
    this.postGameWs.onMessage((messageData: any) => {
      switch (messageData.type) {
        case "postgame-route-change":
        case "frontend-route-update":
          this.handlePostGameRouteUpdate(messageData.uri);
          break;
        case "postgame-mocking-update":
          this.handlePostGameMockingUpdate(
            messageData.mockingState ?? messageData.mocking,
          );
          break;
        case "active-component-changed":
          this.handleActiveComponentChanged(messageData);
          break;
      }
    });
  }

  private handlePostGameRouteUpdate(uri: unknown): void {
    if (typeof uri !== "string" || uri.length === 0) return;
    this.postGameEventHandlers.onRouteUpdate.forEach((h) => h(uri));
  }

  private handlePostGameMockingUpdate(mocking: unknown): void {
    const isMocking = Boolean(mocking);

    const nextData: postGameStateData = {
      ...this.postGameData,
      isMocking,
    };
    this.postGameData = structuralShare(this.postGameData, nextData);

    this.postGameStore._setPostGameData(this.postGameData);
    this.postGameUpdateHandlers.forEach((handler) =>
      handler(this.postGameData),
    );
    this.postGameEventHandlers.onMockingUpdate.forEach((h) => h(isMocking));
  }

  private handleActiveComponentChanged(messageData: any): void {
    // The payload may arrive either as the args object itself or wrapped in
    // an `args` field — accept both, stripping the message `type` when present.
    const { type: _type, ...rest } = messageData ?? {};
    const args: activeComponentChangedEventArgs =
      messageData?.args ?? (rest as activeComponentChangedEventArgs);

    const nextData: postGameStateData = {
      ...this.postGameData,
      activeComponent: args,
    };
    this.postGameData = structuralShare(this.postGameData, nextData);

    this.postGameStore._setPostGameData(this.postGameData);
    this.postGameUpdateHandlers.forEach((handler) =>
      handler(this.postGameData),
    );
    this.postGameEventHandlers.onActiveComponentChanged.forEach((h) => h(args));
  }

  // ===========================================================================
  // Post-game data methods
  // ===========================================================================

  /** Fetch the postgame overview (current game, a specific game, or the mock overview when mocking) and activate the postgame state. */
  async showPostGame(gameId?: number): Promise<postGameOverview> {
    const overview = this.postGameData.isMocking
      ? await this.api.postGame.getMockGameOverview()
      : gameId !== undefined
        ? await this.api.postGame.getGameOverview(gameId)
        : await this.api.postGame.getCurrentGameOverview();

    const nextData: postGameStateData = {
      ...this.postGameData,
      isActive: true,
      gameId,
      overview,
    };
    this.postGameData = structuralShare(this.postGameData, nextData);

    this.postGameStore._setPostGameData(this.postGameData);
    this.postGameUpdateHandlers.forEach((handler) =>
      handler(this.postGameData),
    );
    this.postGameEventHandlers.onPostGameShow.forEach((h) => h(overview));

    return overview;
  }

  /** Re-fetch the postgame overview using the stored game id / mocking state. No-op when postgame is not active. */
  async refreshPostGame(): Promise<void> {
    if (!this.postGameData.isActive) return;
    await this.showPostGame(this.postGameData.gameId);
  }

  /** Hide / reset the postgame state (preserves `isMocking` and `isConnected`). */
  hidePostGame(): void {
    console.log("[LeagueBroadcastClient] Post-game hidden, resetting data");

    const reset = new postGameStateData();
    reset.isMocking = this.postGameData.isMocking;
    reset.isConnected = this.postGameData.isConnected;
    this.postGameData = reset;

    this.postGameStore._reset(this.postGameData);

    this.postGameEventHandlers.onPostGameHide.forEach((h) => h());
    this.postGameUpdateHandlers.forEach((handler) =>
      handler(this.postGameData),
    );
  }
}
