/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { billingCycle } from "../billing_cycle/billingCycle";
import { dunningInfo } from "./dunningInfo";
import { scheduledChangeInfo } from "./scheduledChangeInfo";

export class planDetails {
    planName: string = "";
    cost?: string;
    currency: string = "";
    nextBillingDate?: Date;
    status: string = "";
    plan?: string;
    tier?: string;
    features: string[] = [];
    referralCode?: string;
    referralFeaturesUntil?: Date;
    billing_cycle?: billingCycle;
    scheduledChange?: scheduledChangeInfo;
    dunning?: dunningInfo;
    awaitingPlanSelection: boolean = false;
}
