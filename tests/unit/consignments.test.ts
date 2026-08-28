import { describe, it, expect } from "vitest";
import { calculateConsignmentSettlement } from "@/lib/consignments/consignment-calculator";
import { store } from "@/lib/store";

describe("Consignments & Brokerage Calculator", () => {
  it("calculates percentage brokerage commission and net payout to owner", () => {
    const settlement = calculateConsignmentSettlement({
      salePrice: 20000000,
      commissionType: "PERCENTAGE",
      commissionValue: 4, // 4%
      deductibleExpensesCLP: 150000, // detailing
    });

    expect(settlement.dealerCommissionCLP).toBe(800000);
    expect(settlement.effectiveCommissionPercentage).toBe(4.0);
    expect(settlement.netPayoutToOwnerCLP).toBe(20000000 - 800000 - 150000);
  });

  it("calculates fixed fee brokerage commission", () => {
    const settlement = calculateConsignmentSettlement({
      salePrice: 15000000,
      commissionType: "FIXED",
      commissionValue: 600000,
    });

    expect(settlement.dealerCommissionCLP).toBe(600000);
    expect(settlement.netPayoutToOwnerCLP).toBe(14400000);
  });

  it("settles a consignment updating status and net payout in store", () => {
    const list = store.getConsignments();
    const cons = list[0];

    const settled = store.settleConsignment(cons.id, cons.agreedSalePriceCLP, 0);
    expect(settled?.status).toBe("SETTLED");
    expect(settled?.netPayoutCLP).toBeGreaterThan(0);
  });
});
