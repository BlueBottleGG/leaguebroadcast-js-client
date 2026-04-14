/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DatabaseUpdateType } from "../../shared/databaseUpdateType";
import { seasonData } from "../../shared/seasonData";

export class seasonDatabaseUpdateMessage {
    type: string = "";
    season: seasonData = {} as seasonData;
    updateType: DatabaseUpdateType = DatabaseUpdateType.Add;
}
