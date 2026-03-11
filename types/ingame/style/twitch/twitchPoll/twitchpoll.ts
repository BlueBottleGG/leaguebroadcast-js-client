/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { choiceBar } from "./choiceBar";
import { choiceTitel } from "./choiceTitel";
import { choiceVotes } from "./choiceVotes";
import { pollWrapper } from "./pollWrapper";
import { textStyle } from "../../../../shared/style/textStyle";
import { timerBadgePoll } from "./timerBadgePoll";
import { totalVotes } from "./totalVotes";

export class twitchPoll {
    pollWrapper: pollWrapper = {} as pollWrapper;
    headline: textStyle = {} as textStyle;
    timerBadge: timerBadgePoll = {} as timerBadgePoll;
    choiceTitel: choiceTitel = {} as choiceTitel;
    choiceVotes: choiceVotes = {} as choiceVotes;
    choiceBar: choiceBar = {} as choiceBar;
    totalVotes: totalVotes = {} as totalVotes;
    fileVersion: string = "1.0";
}
