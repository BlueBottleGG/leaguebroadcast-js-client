/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { pollChoice } from "./pollChoice";

export class twitchPollDto {
    id?: string;
    broadcaster_id?: string;
    title?: string;
    choices?: pollChoice[];
    bits_voting_enabled: boolean = false;
    bits_per_vote: number = 0;
    channel_points_voting_enabled: boolean = false;
    channel_points_per_vote: number = 0;
    status?: string;
    duration: number = 0;
    started_at: Date = new Date();
}
