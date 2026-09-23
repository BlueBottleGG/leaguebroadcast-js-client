/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { damageFlowEdge } from "./damageFlowEdge";
import { damageFlowNode } from "./damageFlowNode";
import { DamageFlowView } from "./DamageFlowView";

export class ingameDamageFlowData {
    view: DamageFlowView = DamageFlowView.StrongestConnections;
    attackingTeam: number = 0;
    highlightPlayerName?: string;
    showDamageTypes: boolean = true;
    nodes: damageFlowNode[] = [];
    edges: damageFlowEdge[] = [];
    startTime?: number;
    endTime: number = 0;
}
