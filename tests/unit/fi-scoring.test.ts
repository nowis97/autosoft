import { describe, it, expect } from "vitest";
import {
  calculateRCI,
  calculateCAE,
  evaluateCreditRiskScore,
  evaluateMultiPartnerFinancing,
} from "@/lib/financing/scoring-engine";

describe("F&I Real-Time Credit Scoring & Pre-Approval Engine", () => {
  it("calculates RCI (Razón Carga sobre Ingreso) correctly", () => {
    // 250.000 / 1.000.000 = 25% (OPTIMAL)
    const rci1 = calculateRCI(250000, 1000000);
    expect(rci1.rciPercent).toBe(25);
    expect(rci1.status).toBe("OPTIMAL");

    // 350.000 / 1.000.000 = 35% (ACCEPTABLE)
    const rci2 = calculateRCI(350000, 1000000);
    expect(rci2.rciPercent).toBe(35);
    expect(rci2.status).toBe("ACCEPTABLE");

    // 500.000 / 1.000.000 = 50% (OVERBURDENED)
    const rci3 = calculateRCI(500000, 1000000);
    expect(rci3.rciPercent).toBe(50);
    expect(rci3.status).toBe("OVERBURDENED");
  });

  it("calculates CAE (Carga Anual Equivalente) and Costo Total del Crédito (CTC)", () => {
    const caeResult = calculateCAE({
      loanAmount: 10000000,
      monthlyPayment: 348000,
      termMonths: 36,
      expensesCLP: 150000,
    });

    expect(caeResult.totalCreditCostCLP).toBeGreaterThan(10000000);
    expect(caeResult.caePercent).toBeGreaterThan(15);
    expect(caeResult.caePercent).toBeLessThan(35);
  });

  it("evaluates applicant risk score based on income, down payment ratio and employment", () => {
    const goodProfile = evaluateCreditRiskScore({
      monthlyIncome: 2500000,
      downPayment: 6000000,
      vehiclePrice: 15000000,
      employmentStatus: "DEPENDENT",
      hasDicomDebt: false,
    });

    expect(goodProfile.score).toBeGreaterThanOrEqual(750);
    expect(goodProfile.riskTier).toBe("LOW");

    const riskyProfile = evaluateCreditRiskScore({
      monthlyIncome: 650000,
      downPayment: 1500000,
      vehiclePrice: 12000000,
      employmentStatus: "INDEPENDENT",
      hasDicomDebt: true,
    });

    expect(riskyProfile.score).toBeLessThan(600);
    expect(riskyProfile.riskTier).toBe("HIGH");
  });

  it("evaluates multi-partner pre-approval matrix with Forum, Santander, Tanner and Autofin", () => {
    const evaluations = evaluateMultiPartnerFinancing({
      applicantName: "Gonzalo Valenzuela",
      applicantRut: "11.111.111-1",
      monthlyIncome: 2800000,
      employmentStatus: "DEPENDENT",
      vehiclePrice: 20000000,
      downPayment: 6000000,
      termMonths: 48,
    });

    expect(evaluations.length).toBe(4);
    const forum = evaluations.find((e) => e.partnerId === "FORUM");
    const santander = evaluations.find((e) => e.partnerId === "SANTANDER");
    const tanner = evaluations.find((e) => e.partnerId === "TANNER");
    const autofin = evaluations.find((e) => e.partnerId === "AUTOFIN");

    expect(forum?.status).toBe("APPROVED");
    expect(santander?.status).toBe("APPROVED");
    expect(tanner?.status).toBe("APPROVED");
    expect(autofin?.status).toBe("APPROVED");
    expect(forum?.monthlyPaymentCLP).toBeGreaterThan(0);
  });
});
