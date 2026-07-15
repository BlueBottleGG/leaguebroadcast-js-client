/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { casterActionSettingDto } from "./casterActionSettingDto";
import { Feature } from "../shared/style/set/Feature";

export class casterActionDefinitionDto {
    actionId: string = "";
    minFeature?: Feature;
    name: string = "";
    overlayName: string = "";
    hasSettings: boolean = false;
    allowSinglePlayers: boolean = false;
    allowTimePeriod: boolean = false;
    allowTeams: boolean = false;
    singlePlayerPick: boolean = false;
    customSettings?: casterActionSettingDto[];
}
