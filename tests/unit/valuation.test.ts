import { describe, it, expect } from "vitest";
import { calculateVehicleValuation } from "@/lib/chilean-utils/valuation";
import { store } from "@/lib/store";

describe("Intelligent Valuation & Trade-In Pricing Engine", () => {
  it("computes 3 offer tiers with reasonable margins for Chilean market", () => {
    const result = calculateVehicleValuation({
      brand: "Hyundai",
      model: "Accent",
      year: 2019,
      mileage: 62000,
      condition: "GOOD",
    });

    expect(result.estimatedMarketPrice).toBeGreaterThan(6000000);
    expect(result.quickOffer).toBeLessThan(result.recommendedOffer);
    expect(result.recommendedOffer).toBeLessThan(result.maxOffer);
    expect(result.maxOffer).toBeLessThan(result.estimatedMarketPrice);
    expect(result.reconditioningEstimateCLP).toBe(350000);
    expect(result.dealerMarginPercentage).toBeGreaterThanOrEqual(10);
  });

  it("converts a trade-in valuation into an inventory vehicle atomically", () => {
    const val = store.createValuation({
      tenantId: "tenant-oriente-1",
      licensePlate: "TEST99",
      brand: "Nissan",
      model: "Kicks",
      version: "1.6 Advance",
      year: 2020,
      mileage: 45000,
      condition: "EXCELLENT",
      estimatedMarketPrice: 12500000,
      quickOffer: 10200000,
      recommendedOffer: 10800000,
      maxOffer: 11300000,
      reconditioningEstimateCLP: 200000,
      expectedGrossProfitCLP: 1500000,
      clientName: "Juan Pérez",
      clientPhone: "+56 9 1122 3344",
      status: "OFFERED",
    });

    const initialCount = store.getVehicles().length;
    const vehicle = store.convertValuationToVehicle(val.id, 10800000);

    expect(vehicle).toBeDefined();
    expect(vehicle?.licensePlate).toBe("TEST99");
    expect(vehicle?.acquisitionCost).toBe(10800000);
    expect(vehicle?.status).toBe("IN_MAINTENANCE");
    expect(store.getVehicles().length).toBe(initialCount + 1);

    const updatedVal = store.getValuations().find((v) => v.id === val.id);
    expect(updatedVal?.status).toBe("ACCEPTED");
    expect(updatedVal?.convertedToVehicleId).toBe(vehicle?.id);
  });
});
