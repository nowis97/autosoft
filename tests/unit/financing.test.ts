import { describe, it, expect } from "vitest";
import { calculateLoanQuote } from "@/lib/chilean-utils/financing";

describe("Automotive Loan Simulation (F&I)", () => {
  it("calculates loan monthly payments and down payment validations", () => {
    const simulation = calculateLoanQuote({
      vehiclePrice: 10000000,
      downPayment: 2000000,
      termMonths: 48,
      monthlyInterestRate: 0.0145,
    });

    expect(simulation.vehiclePrice).toBe(10000000);
    expect(simulation.downPayment).toBe(2000000);
    expect(simulation.downPaymentPercent).toBe(20);
    expect(simulation.loanAmount).toBe(8000000);
    expect(simulation.isValidDownPayment).toBe(true);
    expect(simulation.monthlyPayment).toBeGreaterThan(200000);
    expect(simulation.monthlyPayment).toBeLessThan(300000);
  });

  it("identifies insufficient down payment below 20%", () => {
    const simulation = calculateLoanQuote({
      vehiclePrice: 10000000,
      downPayment: 1000000,
      termMonths: 36,
    });

    expect(simulation.isValidDownPayment).toBe(false);
    expect(simulation.minDownPayment).toBe(2000000);
  });
});
