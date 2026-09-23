/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { casterActionDefinitionDto } from "./casterActionDefinitionDto";
import { casterPageDto } from "./casterPageDto";
import { singleChampionDetailHotkeyConfigDto } from "./singleChampionDetailHotkeyConfigDto";
import { singleIngameHotkeyConfigDto } from "./singleIngameHotkeyConfigDto";
import { singleMulticamTakeHotkeyConfigDto } from "./singleMulticamTakeHotkeyConfigDto";
import { singlePostgameHotkeyConfigDto } from "./singlePostgameHotkeyConfigDto";

export class casterModeConfigDto {
    ingame?: singleIngameHotkeyConfigDto[];
    ingameComplete?: boolean;
    postgame?: singlePostgameHotkeyConfigDto[];
    championDetail?: singleChampionDetailHotkeyConfigDto[];
    multicamTakeHotkeys?: singleMulticamTakeHotkeyConfigDto[];
    pages?: casterPageDto[];
    postgamePages?: casterPageDto[];
    catalog?: casterActionDefinitionDto[];
}
