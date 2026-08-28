import { describe, it, expect } from "vitest";
import {
  calculateExecutivePnL,
  calculateBrandPerformance,
  calculateSalesRepCommissions,
} from "@/lib/analytics/pnl-calculator";
import { store } from "@/lib/store";

describe("Executive Analytics & P&L Calculator", () => {
  const vehicles = store.getVehicles();
  const transfers = store.getTransfers();
  const applications = store.getApplications();
  const orders = store.getServiceOrders();
  const users = store.getUsers();

  it("calculates consolidated P&L revenues, direct costs, and net operating profit", () => {
    const pnl = calculateExecutivePnL(vehicles, transfers, applications, orders, users);

    expect(pnl.vehicleRevenue).toBeGreaterThan(0);
    expect(pnl.financingCommissionRevenue).toBeGreaterThan(0);
    expect(pnl.totalRevenue).toBe(
      pnl.vehicleRevenue + pnl.financingCommissionRevenue + pnl.insuranceCommissionRevenue
    );
    expect(pnl.totalDirectCosts).toBe(
      pnl.vehicleAcquisitionCost + pnl.reconditioningServiceCost + pnl.salesRepCommissionsCost
    );
    expect(pnl.netOperatingProfit).toBe(pnl.totalRevenue - pnl.totalDirectCosts);
    expect(pnl.operatingMarginPercentage).toBeGreaterThan(0);
  });

  it("aggregates brand rotation DSI and average gross margins", () => {
    const brandPerf = calculateBrandPerformance(vehicles, transfers);
    expect(brandPerf.length).toBeGreaterThan(0);
    expect(brandPerf[0].brand).toBeDefined();
    expect(brandPerf[0].avgDaysInStock).toBeGreaterThan(0);
    expect(brandPerf[0].totalGrossProfit).toBeGreaterThan(0);
  });

  it("calculates sales rep commissions for fixed and variable compensation", () => {
    const comms = calculateSalesRepCommissions(users, transfers, applications);
    expect(comms.length).toBeGreaterThan(0);
    expect(comms[0].totalCommissionCLP).toBe(
      comms[0].fixedVehicleCommissionsCLP + comms[0].variableFinancingCommissionsCLP
    );
  });
});
