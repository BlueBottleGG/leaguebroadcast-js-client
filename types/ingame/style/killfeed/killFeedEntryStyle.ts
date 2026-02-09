/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { borderStyle } from "../../../shared/style/borderStyle";
import { colorStyle } from "../../../shared/style/colorStyle";
import { killFeedAssistersStyle } from "./killFeedAssistersStyle";
import { killFeedIconStyle } from "./killFeedIconStyle";
import { killFeedKillIconStyle } from "./killFeedKillIconStyle";

export class killFeedEntryStyle {
    fixedWidth: boolean = false;
    background: string | colorStyle = "";
    useSideColorBackground: boolean = false;
    useCustomBackground: boolean = false;
    customBackground?: colorStyle[];
    backgroundBySide?: colorStyle[];
    killer: killFeedIconStyle = {} as killFeedIconStyle;
    icon: killFeedKillIconStyle = {} as killFeedKillIconStyle;
    victim: killFeedIconStyle = {} as killFeedIconStyle;
    assisters: killFeedAssistersStyle = {} as killFeedAssistersStyle;
    padding: string = "";
    margin: string = "";
    border: borderStyle = {} as borderStyle;
    height: string = "";
    width: string = "";
    align: string = "";
}
