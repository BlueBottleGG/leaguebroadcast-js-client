/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { appStatusAssetCacheSnapshot } from "./appStatusAssetCacheSnapshot";
import { appStatusLifecycleSnapshot } from "./appStatusLifecycleSnapshot";
import { appStatusPhaseSnapshot } from "./appStatusPhaseSnapshot";

export class appStatusMessage {
    type: string = "";
    pregame: appStatusPhaseSnapshot = {} as appStatusPhaseSnapshot;
    ingame: appStatusPhaseSnapshot = {} as appStatusPhaseSnapshot;
    postgame: appStatusPhaseSnapshot = {} as appStatusPhaseSnapshot;
    assetCache: appStatusAssetCacheSnapshot = {} as appStatusAssetCacheSnapshot;
    lifecycle: appStatusLifecycleSnapshot = {} as appStatusLifecycleSnapshot;
}
