/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CustomOverlayMode } from "./CustomOverlayMode";
import { SetPhaseType } from "../style/set/SetPhaseType";

export class customOverlay {
    id: string = "";
    name: string = "";
    description: string = "";
    mode: CustomOverlayMode = CustomOverlayMode.Static;
    sourcePath: string = "";
    devScript: string = "";
    slug: string = "";
    phase?: SetPhaseType;
    version: string = "";
    cloudId?: string;
    isManagedPackage: boolean = false;
    previewWidth: number = 0;
    previewHeight: number = 0;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
