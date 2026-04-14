/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { globalPosition } from "../../../shared/style/globalPosition";
import { layoutStyle } from "../../../shared/style/layoutStyle";
import { objectiveDpsBarStyle } from "./objectiveDpsBarStyle";
import { objectiveDpsHeaderStyle } from "./objectiveDpsHeaderStyle";
import { objectiveDpsSmiteStrip } from "./objectiveDpsSmiteStrip";
import { objectiveDpsTeamNumbersStyle } from "./objectiveDpsTeamNumbersStyle";

export class objectiveDamagePerTeamStyle {
    position: globalPosition = {} as globalPosition;
    layout: layoutStyle = {} as layoutStyle;
    background: string | colorStyle = "";
    border: borderStyle = {} as borderStyle;
    header: objectiveDpsHeaderStyle = {} as objectiveDpsHeaderStyle;
    teamNumbers: objectiveDpsTeamNumbersStyle = {} as objectiveDpsTeamNumbersStyle;
    progressBar: objectiveDpsBarStyle = {} as objectiveDpsBarStyle;
    smiteStrip: objectiveDpsSmiteStrip = {} as objectiveDpsSmiteStrip;
    blueTeamColor: string | colorStyle = "";
    redTeamColor: string | colorStyle = "";
    fileVersion: string = "1.0";
}
