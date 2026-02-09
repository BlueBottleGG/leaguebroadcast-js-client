// Main client exports
export { LeagueBroadcastClient } from "./LeagueBroadcastClient";
export type {
  LeagueBroadcastClientConfig,
  GameDataEventHandlers,
} from "./LeagueBroadcastClient";

// WebSocket manager
export { WebSocketManager } from "./WebSocketManager";

// Reactive store
export { GameStateStore, shallowEqual } from "./reactivity/GameStateStore";
export type {
  GameStateSnapshot,
  Subscribable,
  EqualityFn,
} from "./reactivity/GameStateStore";

// Re-export commonly used types from the types package
export type { ingameFrontendData } from "#types/ingame/ingamefrontenddata";
export { GameState } from "#types/shared/GameState";

// Event types
export type { transitionEvents } from "#types/ingame/event/transitionevents";
export type { playerUpdateEvent } from "#types/ingame/event/playerUpdateEvent";
export type { teamUpdateResults } from "#types/ingame/event/teamUpdateResults";
export type { ingameObjectiveEvent } from "#types/ingame/event/ingameObjectiveEvent";
export type { announcerEvent } from "#types/ingame/announcer/announcerEvent";
export type { killFeedEvent } from "#types/ingame/event/killFeedEvent";
