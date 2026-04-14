/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { TeamMemberRole } from "./teamMemberRole";

export class teamMember {
    memberId: number = 0;
    teamId: number = 0;
    alias: string = "";
    puuid: string = "";
    isActive: boolean = false;
    tag: string = "";
    iconUri?: string;
    role: TeamMemberRole = TeamMemberRole.Unknown;
    familyName: string = "";
    givenName: string = "";
}
