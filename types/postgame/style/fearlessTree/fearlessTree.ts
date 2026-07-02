/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyle } from "../../../shared/style/colorStyle";
import { fearlessTreeBanRowStyle } from "./fearlessTreeBanRowStyle";
import { fearlessTreeConnectorStyle } from "./fearlessTreeConnectorStyle";
import { fearlessTreeGameNodeStyle } from "./fearlessTreeGameNodeStyle";
import { fearlessTreeHeaderStyle } from "./fearlessTreeHeaderStyle";
import { layoutStyle } from "../../../shared/style/layoutStyle";

export class fearlessTree {
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    header: fearlessTreeHeaderStyle = {} as fearlessTreeHeaderStyle;
    gameNode: fearlessTreeGameNodeStyle = {} as fearlessTreeGameNodeStyle;
    connector: fearlessTreeConnectorStyle = {} as fearlessTreeConnectorStyle;
    banRow: fearlessTreeBanRowStyle = {} as fearlessTreeBanRowStyle;
    fileVersion: string = "1.0";
}
