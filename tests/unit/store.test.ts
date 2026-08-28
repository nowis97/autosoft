import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("Autosoft Reactive Store", () => {
  it("loads initial vehicles and tenant data", () => {
    const tenant = store.getTenant();
    expect(tenant.name).toBe("Automotora Oriente");

    const vehicles = store.getVehicles();
    expect(vehicles.length).toBeGreaterThanOrEqual(6);
  });

  it("creates a vehicle and auto-unpublishes on sale", () => {
    const created = store.createVehicle({
      tenantId: "tenant-oriente-1",
      licensePlate: "PPRT99",
      brand: "Hyundai",
      model: "Tucson",
      version: "2.0 GL 4x2",
      year: 2022,
      mileage: 30000,
      transmission: "AUTOMATICA",
      fuelType: "BENCINA",
      bodyType: "SUV",
      color: "Blanco",
      priceCash: 17990000,
      status: "AVAILABLE",
      description: "Excelente estado.",
      features: ["Aire Acondicionado"],
      images: ["https://example.com/tucson.jpg"],
      publishedToWeb: true,
      publishedToMercadolibre: true,
      publishedToChileautos: true,
      publishedToYapo: true,
    });

    expect(created.id).toBeDefined();
    expect(created.publishedToWeb).toBe(true);

    const updated = store.updateVehicle(created.id, { status: "SOLD" });
    expect(updated?.publishedToWeb).toBe(false);
    expect(updated?.publishedToMercadolibre).toBe(false);
    expect(updated?.publishedToChileautos).toBe(false);

    store.deleteVehicle(created.id);
  });

  it("creates leads and computes conversion statistics", () => {
    const lead = store.createLead({
      tenantId: "tenant-oriente-1",
      name: "Prueba Test",
      phone: "+56911223344",
      channel: "WEB",
      status: "NEW",
      notes: "Lead de prueba",
    });

    expect(lead.id).toBeDefined();
    const stats = store.getStats();
    expect(stats.totalVehicles).toBeGreaterThan(0);
    expect(stats.totalInventoryValue).toBeGreaterThan(0);
  });
});
