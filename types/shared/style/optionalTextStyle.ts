/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { colorStyle } from "./colorStyle";
import { TextOrientation } from "./text/textOrientation";
import { textOutline } from "./textOutline";
import { WritingMode } from "./text/writingMode";

export class optionalTextStyle {
    show: boolean = false;
    fontFamily: string = "";
    fontWeight: string = "";
    fontSize: string = "";
    textAlignment: string = "";
    textColor: string | colorStyle = "";
    textBorder?: textOutline;
    overrideCommonFontFamily: boolean = false;
    textOrientation: TextOrientation = TextOrientation.None;
    writingMode: WritingMode = WritingMode.None;
}
