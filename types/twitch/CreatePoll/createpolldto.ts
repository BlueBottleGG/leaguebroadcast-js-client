/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { createChoice } from "./createChoice";

export class createPollDto {
    title?: string;
    choices?: createChoice[];
    duration: number = 0;
    channel_points_voting_enabled?: boolean;
    channel_points_per_vote?: number;
}
