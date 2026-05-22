/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { predictionOutcome } from "./predictionOutcome";

export class twitchPredictionDto {
    id?: string;
    broadcaster_id?: string;
    title?: string;
    winning_outcome_id?: string;
    outcomes?: predictionOutcome[];
    prediction_window: number = 0;
    status?: string;
    created_at: Date = new Date();
}
