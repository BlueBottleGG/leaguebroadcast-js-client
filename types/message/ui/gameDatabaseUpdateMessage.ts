/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DatabaseUpdateType } from "../../shared/DatabaseUpdateType";
import { gameWithTeams } from "../../shared/gameWithTeams";

export class gameDatabaseUpdateMessage {
    type: string = "";
    game: gameWithTeams = {} as gameWithTeams;
    updateType: DatabaseUpdateType = DatabaseUpdateType.Add;
}
