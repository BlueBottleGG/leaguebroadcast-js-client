export { ApiClient, ApiError } from "./ApiClient";
export { RestApi } from "./RestApi";

// Re-export generated API classes
export {
  IngameApi,
  GameApi,
  MatchApi,
  SeasonApi,
  PreGameApi,
  GameStateApi,
} from "./generated";

// Re-export request DTO types
export type { OptionalGameData } from "./generated";
export type { AddMatchRequest, OptionalMatchData } from "./generated";
