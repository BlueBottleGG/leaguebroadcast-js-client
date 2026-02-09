import { WebSocketManager } from "./WebSocketManager";
import { GameStateStore } from "./reactivity/GameStateStore";
import { structuralShare } from "./reactivity/structuralShare";
import type { Subscribable } from "./reactivity/GameStateStore";
import { ingameFrontendData } from "#types/ingame/ingamefrontenddata";
import { GameState } from "#types/shared/GameState";
import type { transitionEvents } from "#types/ingame/event/transitionevents";
import type { playerUpdateEvent } from "#types/ingame/event/playerUpdateEvent";
import type { teamUpdateResults } from "#types/ingame/event/teamUpdateResults";
import type { ingameObjectiveEvent } from "#types/ingame/event/ingameObjectiveEvent";
import type { announcerEvent } from "#types/ingame/announcer/announcerEvent";
import type { killFeedEvent } from "#types/ingame/event/killFeedEvent";
import { Team } from "#types/shared/style/Team";

export interface LeagueBroadcastClientConfig {
  host: string;
  port?: number;
  wsRoute?: string;
  apiRoute?: string;
  cacheRoute?: string;
  useHttps?: boolean;
  autoConnect?: boolean;
}

export interface GameDataEventHandlers {
  onPlayerEvent?: (event: playerUpdateEvent) => void;
  onTeamEvent?: (event: teamUpdateResults) => void;
  onObjectiveEvent?: (event: ingameObjectiveEvent) => void;
  onFirstTowerEvent?: (teamId: Team) => void;
  onAnnouncementEvent?: (event: announcerEvent) => void;
  onKillFeedEvent?: (event: killFeedEvent) => void;
}

/**
 * Main client for connecting to League Broadcast backend and receiving game data
 */
export class LeagueBroadcastClient {
  private ws: WebSocketManager;
  private config: Required<LeagueBroadcastClientConfig>;
  private gameData: ingameFrontendData;
  private gameState: GameState = GameState.OutOfGame;
  private isTestingEnvironment: boolean = false;

  /** Reactive store — subscribe to fine-grained state slices. */
  public readonly store: GameStateStore;

  // Event handlers
  private stateUpdateHandlers: Set<(state: ingameFrontendData) => void> =
    new Set();
  private gameStatusHandlers: Set<
    (status: GameState, isTestingEnv: boolean) => void
  > = new Set();
  private eventHandlers: GameDataEventHandlers = {};

  constructor(config: LeagueBroadcastClientConfig) {
    this.config = {
      host: config.host,
      port: config.port ?? 58869,
      wsRoute: config.wsRoute ?? "/ws/in",
      apiRoute: config.apiRoute ?? "/api",
      cacheRoute: config.cacheRoute ?? "/cache",
      useHttps: config.useHttps ?? false,
      autoConnect: config.autoConnect ?? true,
    };

    this.ws = new WebSocketManager();
    this.gameData = new ingameFrontendData();
    this.store = new GameStateStore(this.gameData, this.gameState);
    this.setupMessageHandler();

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  /**
   * Connect to the League Broadcast backend
   */
  async connect(): Promise<void> {
    const protocol = this.config.useHttps ? "wss" : "ws";
    const url = `${protocol}://${this.config.host}:${this.config.port}${this.config.wsRoute}`;

    try {
      await this.ws.connect(url);
    } catch (error) {
      console.error("[LeagueBroadcastClient] Connection failed:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the League Broadcast backend
   */
  disconnect(): void {
    this.ws.disconnect();
  }

  /**
   * Check if connected to the backend
   */
  isConnected(): boolean {
    return this.ws.isConnected();
  }

  /**
   * Get the current game data
   */
  getGameData(): ingameFrontendData {
    return this.gameData;
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState {
    return this.gameState;
  }

  /**
   * Check if in testing environment
   */
  isInTestingEnvironment(): boolean {
    return this.isTestingEnvironment;
  }

  /**
   * Register a handler for state updates
   */
  onStateUpdate(handler: (state: ingameFrontendData) => void): () => void {
    this.stateUpdateHandlers.add(handler);
    return () => this.stateUpdateHandlers.delete(handler);
  }

  /**
   * Register a handler for game status changes
   */
  onGameStatusChange(
    handler: (status: GameState, isTestingEnv: boolean) => void,
  ): () => void {
    this.gameStatusHandlers.add(handler);
    return () => this.gameStatusHandlers.delete(handler);
  }

  /**
   * Register handlers for game events
   */
  onGameEvents(handlers: GameDataEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Register a handler for connection events
   */
  onConnect(handler: () => void): () => void {
    return this.ws.onConnect(handler);
  }

  /**
   * Register a handler for disconnection events
   */
  onDisconnect(handler: () => void): () => void {
    return this.ws.onDisconnect(handler);
  }

  /**
   * Register a handler for error events
   */
  onError(handler: (error: Event) => void): () => void {
    return this.ws.onError(handler);
  }

  // ---------------------------------------------------------------------------
  // Reactive API — convenience wrappers around this.store
  // ---------------------------------------------------------------------------

  /**
   * Create a subscribable slice of game state.
   * The slice only notifies listeners when the selected value actually changes.
   *
   * Works directly with React 18+ `useSyncExternalStore`:
   * ```tsx
   * const kills = client.select(s => s.gameData.scoreboard?.teams[0]?.kills);
   * function Kills() {
   *   const value = useSyncExternalStore(kills.subscribe, kills.getSnapshot);
   *   return <span>{value}</span>;
   * }
   * ```
   */
  select<S>(
    selector: (
      snapshot: import("./reactivity/GameStateStore").GameStateSnapshot,
    ) => S,
    equalityFn?: import("./reactivity/GameStateStore").EqualityFn<S>,
  ): Subscribable<S> {
    return this.store.select(selector, equalityFn);
  }

  /**
   * Watch a derived value and invoke `callback` whenever it changes.
   * Returns an unsubscribe function.
   *
   * ```ts
   * client.watch(
   *   s => s.gameData.scoreboard?.teams[0]?.kills,
   *   (kills, prev) => console.log(`Kills: ${prev} → ${kills}`),
   * );
   * ```
   */
  watch<S>(
    selector: (
      snapshot: import("./reactivity/GameStateStore").GameStateSnapshot,
    ) => S,
    callback: (value: S, prev: S) => void,
    equalityFn?: import("./reactivity/GameStateStore").EqualityFn<S>,
  ): () => void {
    return this.store.watch(selector, callback, equalityFn);
  }

  /**
   * Get the base HTTP URL for API requests
   */
  getApiUrl(): string {
    const protocol = this.config.useHttps ? "https" : "http";
    return `${protocol}://${this.config.host}:${this.config.port}${this.config.apiRoute}`;
  }

  /**
   * Get the base URL for cache requests
   */
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

  /**
   * Setup message handler for WebSocket messages
   */
  private setupMessageHandler(): void {
    this.ws.onMessage((messageData: any) => {
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

  /**
   * Handle state update from backend
   */
  private handleStateUpdate(state: any, events?: transitionEvents): void {
    // Replace game data entirely — the backend sends the full state each time.
    // Null fields mean "not available / don't show", so we must not carry over
    // stale values from the previous state via Object.assign / merge.
    //
    // Structural sharing keeps nested references stable when values are
    // unchanged, so selectors only re-fire when their content changes.
    const nextData = Object.assign(new ingameFrontendData(), state);
    this.gameData = structuralShare(this.gameData, nextData);

    // Check if game ended
    if (!state.gameTime || state.gameTime === 0) {
      this.handleGameStatusUpdate(GameState.OutOfGame, false);
    }

    // Update reactive store with the new object (fresh reference so selectors
    // that compare by identity will correctly detect changes)
    this.store._setGameData(this.gameData);

    // Notify state update handlers
    this.stateUpdateHandlers.forEach((handler) => handler(this.gameData));

    // Handle game events
    this.handleGameEvents(events);
  }

  /**
   * Handle game status update
   */
  private handleGameStatusUpdate(
    gameStatus: GameState,
    isTestingEnvironment: boolean = false,
  ): void {
    this.isTestingEnvironment = isTestingEnvironment;

    if (
      gameStatus === GameState.OutOfGame &&
      this.gameState !== GameState.OutOfGame
    ) {
      this.endGame();
      return;
    }

    this.gameState = gameStatus;
    this.store._setGameState(gameStatus);
    this.gameStatusHandlers.forEach((handler) =>
      handler(gameStatus, isTestingEnvironment),
    );
  }

  /**
   * Handle game events
   */
  private handleGameEvents(events?: transitionEvents): void {
    if (!events) {
      return;
    }

    if (events.player && this.eventHandlers.onPlayerEvent) {
      events.player.forEach((event) =>
        this.eventHandlers.onPlayerEvent!(event),
      );
    }

    if (events.team && this.eventHandlers.onTeamEvent) {
      events.team.forEach((event) => this.eventHandlers.onTeamEvent!(event));
    }

    if (events.objective && this.eventHandlers.onObjectiveEvent) {
      events.objective.forEach((event) =>
        this.eventHandlers.onObjectiveEvent!(event),
      );
    }

    if (
      events.firstTower !== undefined &&
      this.eventHandlers.onFirstTowerEvent
    ) {
      this.eventHandlers.onFirstTowerEvent(events.firstTower);
    }

    if (events.announcements && this.eventHandlers.onAnnouncementEvent) {
      events.announcements.forEach((event) =>
        this.eventHandlers.onAnnouncementEvent!(event),
      );
    }

    if (events.killFeed && this.eventHandlers.onKillFeedEvent) {
      events.killFeed.forEach((event) =>
        this.eventHandlers.onKillFeedEvent!(event),
      );
    }
  }

  /**
   * End the game and reset state
   */
  private endGame(): void {
    console.log("[LeagueBroadcastClient] Game ended, resetting data");

    // Reset game data
    this.gameData = new ingameFrontendData();
    this.gameState = GameState.OutOfGame;
    this.isTestingEnvironment = false;

    // Reset reactive store
    this.store._reset(this.gameData, GameState.OutOfGame);

    // Notify handlers
    this.gameStatusHandlers.forEach((handler) =>
      handler(GameState.OutOfGame, false),
    );
    this.stateUpdateHandlers.forEach((handler) => handler(this.gameData));
  }
}
