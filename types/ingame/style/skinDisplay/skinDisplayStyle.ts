/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyle } from "../../../shared/style/colorStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { skinDisplayInfoStyle } from "./skinDisplayInfoStyle";
import { skinDisplayPoweredByStyle } from "./skinDisplayPoweredByStyle";
import { skinDisplayRoleIconStyle } from "./skinDisplayRoleIconStyle";

export class skinDisplayStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    overlay: string | colorStyle = "";
    info: skinDisplayInfoStyle = {} as skinDisplayInfoStyle;
    roleIcon: skinDisplayRoleIconStyle = {} as skinDisplayRoleIconStyle;
    poweredBy: skinDisplayPoweredByStyle = {} as skinDisplayPoweredByStyle;
    width: string = "";
    rotationIntervalMs: number = 0;
    fileVersion: string = "1.0";
}
