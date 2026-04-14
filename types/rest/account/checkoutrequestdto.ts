/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { PaymentInterval } from "./paymentInterval";
import { Tier } from "../../shared/style/set/tier";

export class checkoutRequestDTO {
    tier: Tier = Tier.Free;
    interval: PaymentInterval = PaymentInterval.Monthly;
}
