/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { goldGraphEventData } from "./goldGraphEventData";
import { goldGraphTeamfightData } from "./goldGraphTeamfightData";

export class singleGameGoldGraphData {
    goldAtTime: { [key: number]: { [key: number]: number } } = {};
    winner?: number;
    teams: { [key: number]: string } = {};
    events: goldGraphEventData[] = [];
    teamfights: goldGraphTeamfightData[] = [];
}
