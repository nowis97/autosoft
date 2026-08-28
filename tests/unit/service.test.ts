import { describe, it, expect } from "vitest";
import { calculateVehicleFinancials } from "@/lib/chilean-utils/service-costs";
import { store } from "@/lib/store";

describe("Vehicle Reconditioning & Real Margin Ledger", () => {
  const vehicle = store.getVehicles()[0]; // Toyota RAV4 (acquisitionCost: 13,800,000, priceCash: 16,490,000)

  it("calculates real invested cost including service work orders", () => {
    const orders = store.getServiceOrders();
    const fin = calculateVehicleFinancials(vehicle, orders);

    expect(fin.acquisitionCost).toBe(13800000);
    expect(fin.totalServiceCosts).toBeGreaterThan(0);
    expect(fin.totalInvestedCost).toBe(fin.acquisitionCost + fin.totalServiceCosts);
    expect(fin.expectedGrossProfit).toBe(fin.salePrice - fin.totalInvestedCost);
    expect(fin.grossMarginPercentage).toBeGreaterThan(0);
    expect(fin.returnOnInvestmentPercentage).toBeGreaterThan(0);
  });

  it("adds a new service order and updates vehicle reconditioning status", () => {
    const newOrder = store.createServiceOrder({
      tenantId: "tenant-oriente-1",
      vehicleId: vehicle.id,
      category: "NEUMATICOS_FRENOS",
      description: "Cambio de 4 neumáticos nuevos",
      providerName: "Neumateca Oficial",
      costCLP: 380000,
      invoiceNumber: "FAC-9921",
      status: "IN_PROGRESS",
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.costCLP).toBe(380000);

    const updatedVehicle = store.getVehicleById(vehicle.id);
    expect(updatedVehicle?.reconditioningStatus).toBe("EN_TALLER");
  });

  it("marks vehicle as ready for sale transitioning to AVAILABLE", () => {
    const ready = store.readyVehicleForSale(vehicle.id);
    expect(ready?.status).toBe("AVAILABLE");
    expect(ready?.reconditioningStatus).toBe("LISTO_PARA_EXHIBIR");
    expect(ready?.publishedToWeb).toBe(true);
  });
});
