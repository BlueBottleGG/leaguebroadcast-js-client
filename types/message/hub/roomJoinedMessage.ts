/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { hubMemberDto } from "./hubMemberDto";

export class roomJoinedMessage {
    type: string = "";
    roomId: string = "";
    roomType: string = "";
    roomKey: string = "";
    slug?: string;
    memberId: string = "";
    members: hubMemberDto[] = [];
}
