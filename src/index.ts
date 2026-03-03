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

// Re-export commonly used types from the types package
export type { ingameFrontendData } from "#types/ingame/ingamefrontenddata";
export { GameState } from "#types/shared/gamestate";

// Ingame event types
export type { transitionEvents } from "#types/ingame/event/transitionevents";
export type { playerUpdateEvent } from "#types/ingame/event/playerUpdateEvent";
export type { teamUpdateResults } from "#types/ingame/event/teamUpdateResults";
export type { ingameObjectiveEvent } from "#types/ingame/event/ingameObjectiveEvent";
export type { announcerEvent } from "#types/ingame/announcer/announcerEvent";
export type { killFeedEvent } from "#types/ingame/event/killFeedEvent";

// Pre-game types
export type { champSelectStateData } from "#types/pregame/champselectstatedata";
export type { championSelectTeam } from "#types/pregame/championselectteam";
export type { pickBanActionEventArgs } from "#types/pregame/pickbanactioneventargs";
export type { pickBanTimer } from "#types/pregame/pickbantimer";
export { PickBanPhase } from "#types/pregame/pickbanphase";
export type { banSlot } from "#types/pregame/banslot";
export type { pickSlot } from "#types/pregame/pickslot";
export type { champSelectStateMetaData } from "#types/pregame/champselectstatemetadata";
export { ActionType } from "#types/pregame/actiontype";
export { ActionSubType } from "#types/pregame/actionsubtype";
export type { matchData } from "#types/pregame/matchdata";
export type { timelineEntry } from "#types/pregame/timelineentry";
export { TimeLineActionType } from "#types/pregame/timelineactiontype";

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

// Shared types used by REST API
export type { gameWithTeams } from "#types/shared/gamewithteams";
export type { matchWithGamesAndTeams } from "#types/shared/matchwithgamesandteams";
export type { seasonData } from "#types/shared/seasondata";
export type { teamData } from "#types/shared/teamdata";
export type { teamWithMembers } from "#types/shared/teamwithmembers";
export type { simpleChampionData } from "#types/shared/simplechampiondata";
export { BestOfType } from "#types/shared/bestoftype";
export { MatchRuleSet } from "#types/shared/matchruleset";
export type { tabPlayer } from "#types/ingame/tab/tabplayer";

// Utility functions
export {
  getSortedInventory,
  getTrinket,
  getRoleQuest,
} from "./util/ingameScoreboardBottomPlayerDataUtils";
