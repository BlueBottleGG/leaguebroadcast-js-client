/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { championSelectTeam } from "./championSelectTeam";
import { champSelectStateMetaData } from "./champSelectStateMetaData";
import { pickBanTimer } from "./pickBanTimer";

export class champSelectStateData {
    isActive: boolean = false;
    isConnected: boolean = false;
    isTestingEnvironment: boolean = false;
    blueTeam: championSelectTeam = {} as championSelectTeam;
    redTeam: championSelectTeam = {} as championSelectTeam;
    metaData: champSelectStateMetaData = {} as champSelectStateMetaData;
    timer: pickBanTimer = {} as pickBanTimer;
}
