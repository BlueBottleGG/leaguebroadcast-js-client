/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { telestratorHotkeyBinding } from "./telestratorHotkeyBinding";
import { telestratorPresetHotkeyBinding } from "./telestratorPresetHotkeyBinding";
import { telestratorPressureCurvePoint } from "./telestratorPressureCurvePoint";

export class telestratorConfig {
    colors: string[] = [];
    thicknessPresets: string[] = [];
    vanishPresets: string[] = [];
    hotkeysEnabled: boolean = false;
    hotkeys: telestratorHotkeyBinding[] = [];
    presetHotkeys: telestratorPresetHotkeyBinding[] = [];
    defaultVanishTime: number = 0;
    defaultTimeMode: string = "";
    autoActivateDrawingOnToolSelection: boolean = false;
    penPressureEnabled: boolean = false;
    penPressureMinScale: number = 0;
    penPressureCurve: telestratorPressureCurvePoint[] = [];
    touchPanEnabled: boolean = false;
    touchPanWhileDrawingOff: boolean = false;
    penEraserEnabled: boolean = false;
    penCursorHideEnabled: boolean = false;
    anchorClickSelectEnabled: boolean = false;
    anchorDoubleClickCameraLockEnabled: boolean = false;
}
