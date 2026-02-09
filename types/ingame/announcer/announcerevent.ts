/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { announcementParameter } from "./announcementParameter";
import { AnnouncementType } from "./AnnouncementType";

export class announcerEvent {
    source?: announcementParameter;
    target?: announcementParameter;
    type: AnnouncementType = AnnouncementType.Unknown;
}
