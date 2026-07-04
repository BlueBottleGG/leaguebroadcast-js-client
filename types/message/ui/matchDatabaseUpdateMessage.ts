/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DatabaseUpdateType } from "../../shared/databaseUpdateType";
import { matchWithGamesAndTeams } from "../../shared/matchWithGamesAndTeams";

export class matchDatabaseUpdateMessage {
    type: string = "";
    match: matchWithGamesAndTeams = {} as matchWithGamesAndTeams;
    updateType: DatabaseUpdateType = DatabaseUpdateType.Add;
}
