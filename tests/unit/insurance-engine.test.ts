import { describe, it, expect } from "vitest";
import {
  calculateInsuranceQuotes,
  calculateDealerInsuranceCommission,
  type InsuranceQuoteRequest,
} from "@/lib/insurance/insurance-engine";

describe("Multi-Carrier Auto Insurance Quote Engine", () => {
  const sampleRequest: InsuranceQuoteRequest = {
    vehicleValueCLP: 16490000,
    vehicleYear: 2021,
    vehicleBrand: "Toyota",
    vehicleModel: "RAV4",
    driverAge: 38,
    driverHasAccidents: false,
  };

  it("generates comparative quotes for Chilean carriers (BCI, HDI, Mapfre, Reale) with UF deductibles", () => {
    const quotes = calculateInsuranceQuotes(sampleRequest);

    expect(quotes.length).toBe(4);

    const bci = quotes.find((q) => q.carrierId === "bci");
    const hdi = quotes.find((q) => q.carrierId === "hdi");
    const mapfre = quotes.find((q) => q.carrierId === "mapfre");
    const reale = quotes.find((q) => q.carrierId === "reale");

    expect(bci).toBeDefined();
    expect(hdi).toBeDefined();
    expect(mapfre).toBeDefined();
    expect(reale).toBeDefined();

    // Verify deductible options (3 UF, 5 UF, 10 UF)
    expect(bci?.plans.some((p) => p.deductibleUF === 3)).toBe(true);
    expect(bci?.plans.some((p) => p.deductibleUF === 5)).toBe(true);
    expect(bci?.plans.some((p) => p.deductibleUF === 10)).toBe(true);

    // Verify monthly premiums are positive integer CLP
    expect(bci?.plans[0].monthlyPremiumCLP).toBeGreaterThan(20000);
    expect(bci?.plans[0].monthlyPremiumCLP).toBeLessThan(150000);
  });

  it("calculates dealer commission on insurance policy sales (10% to 15% annual premium)", () => {
    const annualPremiumCLP = 600000; // $50.000 / month
    const commission12 = calculateDealerInsuranceCommission(annualPremiumCLP, 12);
    expect(commission12).toBe(72000); // 12% of 600k

    const commission15 = calculateDealerInsuranceCommission(annualPremiumCLP, 15);
    expect(commission15).toBe(90000); // 15% of 600k
  });

  it("applies risk surcharges for younger drivers or accident history", () => {
    const standardQuotes = calculateInsuranceQuotes(sampleRequest);
    const riskyQuotes = calculateInsuranceQuotes({
      ...sampleRequest,
      driverAge: 21,
      driverHasAccidents: true,
    });

    const standardBCI = standardQuotes.find((q) => q.carrierId === "bci")?.plans[0].monthlyPremiumCLP || 0;
    const riskyBCI = riskyQuotes.find((q) => q.carrierId === "bci")?.plans[0].monthlyPremiumCLP || 0;

    expect(riskyBCI).toBeGreaterThan(standardBCI);
  });
});
