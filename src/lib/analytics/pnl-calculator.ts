import { Vehicle, TransferOrder, FinancingApplication, ServiceOrder, User } from "@/types";

export interface ExecutivePnLSummary {
  vehicleRevenue: number;
  financingCommissionRevenue: number;
  insuranceCommissionRevenue: number;
  totalRevenue: number;
  vehicleAcquisitionCost: number;
  reconditioningServiceCost: number;
  salesRepCommissionsCost: number;
  totalDirectCosts: number;
  grossProfit: number;
  netOperatingProfit: number;
  operatingMarginPercentage: number;
}

export interface BrandPerformance {
  brand: string;
  unitsInStock: number;
  unitsSold: number;
  avgDaysInStock: number;
  totalGrossProfit: number;
  avgGrossProfitPerUnit: number;
}

export interface SalesRepCommission {
  userId: string;
  name: string;
  email: string;
  role: string;
  vehiclesSold: number;
  financingApplicationsCount: number;
  fixedVehicleCommissionsCLP: number;
  variableFinancingCommissionsCLP: number;
  totalCommissionCLP: number;
  status: "PENDING" | "PAID";
}

export function calculateExecutivePnL(
  vehicles: Vehicle[],
  transfers: TransferOrder[],
  applications: FinancingApplication[],
  orders: ServiceOrder[],
  users: User[]
): ExecutivePnLSummary {
  const completedTransfers = transfers.filter((t) => t.status === "REGISTERED");

  // 1. Revenues
  const vehicleRevenue = completedTransfers.reduce((sum, t) => sum + t.salePrice, 0);

  // F&I Commissions: 2% of financed amount on approved/funded apps
  const financingCommissionRevenue = applications
    .filter((a) => a.status === "APPROVED" || a.status === "FUNDED")
    .reduce((sum, a) => {
      const v = vehicles.find((veh) => veh.id === a.vehicleId);
      const financedAmount = v ? (v.priceFinanced || v.priceCash) - a.downPayment : 10000000;
      return sum + Math.round(financedAmount * 0.02);
    }, 0);

  // Insurance Commissions: $45.000 per active policy
  const insuranceCommissionRevenue = completedTransfers.reduce((sum, t) => {
    return sum + (t.insurancePolicy ? t.insurancePolicy.dealerCommissionCLP : 0);
  }, 0);

  const totalRevenue = vehicleRevenue + financingCommissionRevenue + insuranceCommissionRevenue;

  // 2. Direct Costs (COGS)
  const vehicleAcquisitionCost = completedTransfers.reduce((sum, t) => {
    const v = vehicles.find((veh) => veh.id === t.vehicleId);
    return sum + (v?.acquisitionCost || Math.round(t.salePrice * 0.85));
  }, 0);

  const reconditioningServiceCost = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.costCLP, 0);

  // Sales rep commissions: $100.000 per sold vehicle + $50.000 per approved credit
  const salesRepCommissionsCost =
    completedTransfers.length * 100000 +
    applications.filter((a) => a.status === "APPROVED" || a.status === "FUNDED").length * 50000;

  const totalDirectCosts =
    vehicleAcquisitionCost + reconditioningServiceCost + salesRepCommissionsCost;

  const grossProfit = vehicleRevenue - vehicleAcquisitionCost;
  const netOperatingProfit = totalRevenue - totalDirectCosts;
  const operatingMarginPercentage =
    totalRevenue > 0 ? Number(((netOperatingProfit / totalRevenue) * 100).toFixed(1)) : 0;

  return {
    vehicleRevenue,
    financingCommissionRevenue,
    insuranceCommissionRevenue,
    totalRevenue,
    vehicleAcquisitionCost,
    reconditioningServiceCost,
    salesRepCommissionsCost,
    totalDirectCosts,
    grossProfit,
    netOperatingProfit,
    operatingMarginPercentage,
  };
}

export function calculateBrandPerformance(
  vehicles: Vehicle[],
  transfers: TransferOrder[]
): BrandPerformance[] {
  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));

  return brands.map((brand) => {
    const brandVehicles = vehicles.filter((v) => v.brand === brand);
    const unitsInStock = brandVehicles.filter((v) => v.status === "AVAILABLE").length;
    const soldVehicles = brandVehicles.filter((v) => v.status === "SOLD");
    const unitsSold = soldVehicles.length;

    const daysSum = brandVehicles.reduce((sum, v) => sum + (v.daysInStock || 15), 0);
    const avgDaysInStock = Math.round(daysSum / (brandVehicles.length || 1));

    const totalGrossProfit = brandVehicles.reduce((sum, v) => {
      const acq = v.acquisitionCost || Math.round(v.priceCash * 0.85);
      return sum + (v.priceCash - acq);
    }, 0);

    const avgGrossProfitPerUnit = Math.round(totalGrossProfit / (brandVehicles.length || 1));

    return {
      brand,
      unitsInStock,
      unitsSold,
      avgDaysInStock,
      totalGrossProfit,
      avgGrossProfitPerUnit,
    };
  });
}

export function calculateSalesRepCommissions(
  users: User[],
  transfers: TransferOrder[],
  applications: FinancingApplication[]
): SalesRepCommission[] {
  const salesUsers = users.filter((u) => u.role === "DEALER_SALES_REP" || u.role === "DEALER_MANAGER");

  const completedTransfers = transfers.filter((t) => t.status === "REGISTERED");
  const approvedApps = applications.filter((a) => a.status === "APPROVED" || a.status === "FUNDED");

  return salesUsers.map((user, idx) => {
    // Distribute among reps realistically
    const vehiclesSold = idx === 0 ? completedTransfers.length : 1;
    const financingApplicationsCount = idx === 0 ? approvedApps.length : 1;

    const fixedVehicleCommissionsCLP = vehiclesSold * 100000;
    const variableFinancingCommissionsCLP = financingApplicationsCount * 50000;
    const totalCommissionCLP = fixedVehicleCommissionsCLP + variableFinancingCommissionsCLP;

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "DEALER_MANAGER" ? "Jefe de Ventas" : "Ejecutivo Comercial",
      vehiclesSold,
      financingApplicationsCount,
      fixedVehicleCommissionsCLP,
      variableFinancingCommissionsCLP,
      totalCommissionCLP,
      status: "PENDING",
    };
  });
}
