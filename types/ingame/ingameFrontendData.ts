/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { GameState } from "../shared/gameState";
import { ingameDamageCompositionData } from "./damageComposition/ingameDamageCompositionData";
import { ingameDamageFlowData } from "./damageFlow/ingameDamageFlowData";
import { ingameDamageGraphData } from "./damageGraph/ingameDamageGraphData";
import { ingameDamageRecapData } from "./damageRecap/ingameDamageRecapData";
import { ingameDamageSplitData } from "./damageSplit/ingameDamageSplitData";
import { ingameGoldEfficiencyData } from "./goldEfficiency/ingameGoldEfficiencyData";
import { ingameGoldGraphData } from "./graph/ingameGoldGraphData";
import { ingameKillParticipationData } from "./killParticipation/ingameKillParticipationData";
import { ingameObjectiveDpsData } from "./objectiveDps/ingameObjectiveDpsData";
import { ingameRuneData } from "./rune/ingameRuneData";
import { ingameScoreboardBottomData } from "./scoreboardBottom/ingameScoreboardBottomData";
import { ingameScoreboardData } from "./topScoreboard/ingameScoreboardData";
import { ingameSideInfoPage } from "./tab/ingameSideInfoPage";
import { ingameSkinDisplayData } from "./skinDisplay/ingameSkinDisplayData";
import { ingameTeamfightTimelineData } from "./teamfightTimeline/ingameTeamfightTimelineData";
import { tabTeam } from "./tab/tabTeam";
import { teamInhibitorData } from "./inhibitor/teamInhibitorData";
import { teamWithMembers } from "../shared/teamWithMembers";
import type { iObjectiveRespawnData } from "./objective/iObjectiveRespawnData";

export class ingameFrontendData {
    gameTime: number = 0;
    utcTime?: number;
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
    damageRecap?: ingameDamageRecapData;
    damageSplit?: ingameDamageSplitData;
    goldEfficiency?: ingameGoldEfficiencyData;
    teamfightTimeline?: ingameTeamfightTimelineData;
    objectiveDps?: ingameObjectiveDpsData;
    killParticipation?: ingameKillParticipationData;
    damageComposition?: ingameDamageCompositionData;
    damageFlow?: ingameDamageFlowData;
    skinDisplay?: ingameSkinDisplayData;
}
