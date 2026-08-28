import { describe, it, expect } from "vitest";
import { calculateTransferTaxes } from "@/lib/chilean-utils/tax-calculator";

describe("Chilean Vehicle Transfer Tax Calculator (D.L. 3475)", () => {
  it("calculates 1.5% tax based on sale price when higher than fiscal appraisal", () => {
    const result = calculateTransferTaxes({
      salePrice: 10000000,
      fiscalAppraisal: 8000000,
    });

    expect(result.taxableBase).toBe(10000000);
    expect(result.transferTax15).toBe(150000); // 1.5% of 10M
    expect(result.notaryFee).toBe(28000);
    expect(result.civilRegistryFee).toBe(30490);
    expect(result.totalTransferCost).toBe(150000 + 28000 + 30490);
  });

  it("calculates 1.5% tax based on fiscal appraisal when higher than sale price", () => {
    const result = calculateTransferTaxes({
      salePrice: 5000000,
      fiscalAppraisal: 7000000,
    });

    expect(result.taxableBase).toBe(7000000);
    expect(result.transferTax15).toBe(105000); // 1.5% of 7M
    expect(result.totalTransferCost).toBe(105000 + 28000 + 30490);
  });
});
