/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { containerStyleV2 } from "../../../shared/style/containerStyleV2";
import { gameInfoEntryStyleV2 } from "./gameInfoEntryStyleV2";
import { styleNodeMeta } from "../../../shared/style/styleNodeMeta";
import { TransitionType } from "../lFrameV2/TransitionType";

export class gameInfoRotationV2 {
    _node: styleNodeMeta = {} as styleNodeMeta;
    container: containerStyleV2 = {} as containerStyleV2;
    entry: gameInfoEntryStyleV2 = {} as gameInfoEntryStyleV2;
    content: string[] = [];
    secondsPerEntry: number = 0;
    transitionType: TransitionType = TransitionType.Cut;
    transitionDurationInSeconds: number = 0;
    customCss?: string;
    fileVersion: string = "1.0";
}
