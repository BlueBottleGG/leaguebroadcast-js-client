/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CustomOverlayMode } from "./customOverlayMode";
import { SetPhaseType } from "../style/set/setPhaseType";

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
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
