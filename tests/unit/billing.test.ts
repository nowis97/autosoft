import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("SaaS Pricing, Quotas & Subscription Management", () => {
  it("initializes with active Pro tier and valid Chilean quotas", () => {
    const sub = store.getSubscription();
    expect(sub.tier).toBe("PRO");
    expect(sub.priceUF).toBe(5.0);
    expect(sub.maxVehicles).toBe(45);
    expect(sub.maxUsers).toBe(5);
    expect(sub.status).toBe("ACTIVE");
    expect(sub.paymentMethod.bankName).toBe("Banco de Chile");
  });

  it("upgrades subscription to Enterprise tier with unlimited vehicles", () => {
    const upgraded = store.updateSubscriptionPlan("ENTERPRISE", "ANNUAL");
    expect(upgraded.tier).toBe("ENTERPRISE");
    expect(upgraded.priceUF).toBe(10.0);
    expect(upgraded.maxVehicles).toBe(9999);
    expect(upgraded.billingCycle).toBe("ANNUAL");
  });

  it("updates Chilean payment method with bank details", () => {
    const updated = store.updatePaymentMethod({
      type: "PAC_DEBIT",
      bankName: "Banco Santander",
      last4: "9912",
    });
    expect(updated.paymentMethod.type).toBe("PAC_DEBIT");
    expect(updated.paymentMethod.bankName).toBe("Banco Santander");
    expect(updated.paymentMethod.last4).toBe("9912");
  });
});
