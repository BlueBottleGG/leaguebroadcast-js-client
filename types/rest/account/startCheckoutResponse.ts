/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export class startCheckoutResponse {
    checkoutStarted: boolean = false;
    requiresRedirect: boolean = false;
    preview: boolean = false;
    planChanged: boolean = false;
    checkoutUrl?: string;
    browserOpened: boolean = false;
    plan?: string;
    confirmationToken?: string;
    immediateChargeKnown: boolean = false;
    hasImmediateCharge: boolean = false;
    immediateChargeAmount?: string;
    immediateChargeCurrency?: string;
    nextChargeKnown: boolean = false;
    hasNextCharge: boolean = false;
    nextChargeAmount?: string;
    nextChargeCurrency?: string;
    nextBilledAt?: string;
    interval?: string;
    discountId?: string;
    discountType?: string;
    discountEndsAt?: string;
}
