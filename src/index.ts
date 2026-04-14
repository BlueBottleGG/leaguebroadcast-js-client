// Main client exports
export { LeagueBroadcastClient } from "./LeagueBroadcastClient";
export type {
  LeagueBroadcastClientConfig,
  IngameEventHandlers,
  ChampSelectEventHandlers,
} from "./LeagueBroadcastClient";

// WebSocket manager
export { WebSocketManager } from "./WebSocketManager";

// Reactive stores
export { GameStateStore, shallowEqual } from "./reactivity/GameStateStore";
export type {
  GameStateSnapshot,
  Subscribable,
  EqualityFn,
} from "./reactivity/GameStateStore";

export { ChampSelectStateStore } from "./reactivity/ChampSelectStateStore";
export type { ChampSelectSnapshot } from "./reactivity/ChampSelectStateStore";

// All types – auto-generated barrel exports (run `npm run generate-barrels` to update)
export * from "#types/cloud";
export * from "#types/hotkey";
export * from "#types/ingame";
export * from "#types/message";
export * from "#types/postgame";
export * from "#types/pregame";
export * from "#types/rest";
export * from "#types/shared";
export * from "#types/twitch";

// REST API client
export { RestApi } from "./api/RestApi";
export { ApiClient, ApiError } from "./api/ApiClient";
export {
  IngameApi,
  GameApi,
  MatchApi,
  SeasonApi,
  PreGameApi,
  GameStateApi,
} from "./api/generated";

// Utility functions
export {
  getSortedInventory,
  getTrinket,
  getRoleQuest,
} from "./util/ingameScoreboardBottomPlayerDataUtils";

export {
  PHYS_COLOR,
  MAGIC_COLOR,
  TRUE_COLOR,
  dmgTypeColor,
  formatDamage,
  getDamageByType,
  damageBarSegments,
  aggregateSpellEntries,
  normalizeDamageEntries,
} from "./util/damageRecapUtils";
export type {
  DamageBarSegment,
  AggregatedSpellEntry,
  EntityType,
  NormalizedDamageEntry,
} from "./util/damageRecapUtils";
