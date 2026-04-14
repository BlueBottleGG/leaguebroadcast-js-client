/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { DatabaseUpdateType } from "../../shared/databaseUpdateType";
import { teamWithMembers } from "../../shared/teamWithMembers";

export class teamDatabaseUpdateMessage {
    type: string = "";
    team: teamWithMembers = {} as teamWithMembers;
    updateType: DatabaseUpdateType = DatabaseUpdateType.Add;
}
