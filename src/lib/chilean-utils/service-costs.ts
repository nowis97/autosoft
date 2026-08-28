import { Vehicle, ServiceOrder } from "@/types";

export interface VehicleFinancialSummary {
  acquisitionCost: number;
  totalServiceCosts: number;
  totalInvestedCost: number;
  salePrice: number;
  expectedGrossProfit: number;
  grossMarginPercentage: number;
  returnOnInvestmentPercentage: number;
}

export function calculateVehicleFinancials(
  vehicle: Vehicle,
  orders: ServiceOrder[]
): VehicleFinancialSummary {
  const acquisitionCost = vehicle.acquisitionCost || 0;
  const vehicleOrders = orders.filter((o) => o.vehicleId === vehicle.id);

  const totalServiceCosts = vehicleOrders.reduce((sum, o) => sum + o.costCLP, 0);
  const totalInvestedCost = acquisitionCost + totalServiceCosts;
  const salePrice = vehicle.priceCash;

  const expectedGrossProfit = salePrice - totalInvestedCost;
  const grossMarginPercentage =
    salePrice > 0 ? Number(((expectedGrossProfit / salePrice) * 100).toFixed(1)) : 0;

  const returnOnInvestmentPercentage =
    totalInvestedCost > 0
      ? Number(((expectedGrossProfit / totalInvestedCost) * 100).toFixed(1))
      : 0;

  return {
    acquisitionCost,
    totalServiceCosts,
    totalInvestedCost,
    salePrice,
    expectedGrossProfit,
    grossMarginPercentage,
    returnOnInvestmentPercentage,
  };
}
