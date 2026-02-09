/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { billingCycle } from "../billing_cycle/billingCycle";
import { Tier } from "../../shared/style/set/Tier";

export class planDetails {
    planName: string = "";
    cost: string = "";
    currency: string = "";
    nextBillingDate?: Date;
    status: string = "";
    tier?: Tier;
    billing_cycle?: billingCycle;
}
