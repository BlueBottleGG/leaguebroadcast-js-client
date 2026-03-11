/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { GameState } from "../shared/gamestate";
import { ingameDamageGraphData } from "./damageGraph/ingameDamageGraphData";
import { ingameGoldGraphData } from "./graph/ingameGoldGraphData";
import { ingameRuneData } from "./rune/ingameRuneData";
import { ingameScoreboardBottomData } from "./scoreboardBottom/ingameScoreboardBottomData";
import { ingameScoreboardData } from "./topScoreboard/ingameScoreboardData";
import { ingameSideInfoPage } from "./tab/ingameSideInfoPage";
import { tabTeam } from "./tab/tabTeam";
import { teamInhibitorData } from "./inhibitor/teamInhibitorData";
import { teamWithMembers } from "../shared/teamWithMembers";
import type { iObjectiveRespawnData } from "./objective/iObjectiveRespawnData";

export class ingameFrontendData {
  gameTime: number = 0;
  playbackSpeed: number = 0;
  isTestingEnvironment?: boolean;
  gameVersion: string = "";
  patch?: string;
  teams?: teamWithMembers[];
  gameStatus: GameState = GameState.OutOfGame;
  scoreboard?: ingameScoreboardData;
  tabs?: { [key: string]: tabTeam };
  scoreboardBottom?: ingameScoreboardBottomData;
  baronPitTimer?: iObjectiveRespawnData;
  dragonPitTimer?: iObjectiveRespawnData;
  inhibitors?: teamInhibitorData[];
  showTwitchPrediction: boolean = false;
  showTwitchPoll: boolean = false;
  showTwitchChatVote: boolean = false;
  sideInfoPage?: ingameSideInfoPage;
  goldGraph?: ingameGoldGraphData;
  runes?: ingameRuneData;
  damageGraph?: ingameDamageGraphData;
  teamfightDamageOverview?: ingameDamageGraphData;
}
