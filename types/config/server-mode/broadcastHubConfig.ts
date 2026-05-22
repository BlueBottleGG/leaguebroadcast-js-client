/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ServerMode } from "./serverMode";

export class broadcastHubConfig {
    serverMode: ServerMode = ServerMode.Local;
    remoteHost?: string;
    hubPort: number = 0;
    hubAuthToken?: string;
    autoStart: boolean = false;
    roomTtlSeconds: number = 0;
}
