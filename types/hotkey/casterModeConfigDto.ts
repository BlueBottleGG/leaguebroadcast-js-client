/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { casterActionDefinitionDto } from "./casterActionDefinitionDto";
import { casterPageDto } from "./casterPageDto";
import { singleChampionDetailHotkeyConfigDto } from "./singleChampionDetailHotkeyConfigDto";
import { singleIngameHotkeyConfigDto } from "./singleIngameHotkeyConfigDto";
import { singlePostgameHotkeyConfigDto } from "./singlePostgameHotkeyConfigDto";

export class casterModeConfigDto {
    ingame?: singleIngameHotkeyConfigDto[];
    postgame?: singlePostgameHotkeyConfigDto[];
    championDetail?: singleChampionDetailHotkeyConfigDto[];
    pages?: casterPageDto[];
    postgamePages?: casterPageDto[];
    catalog?: casterActionDefinitionDto[];
}
