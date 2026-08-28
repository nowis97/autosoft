import { describe, it, expect } from "vitest";
import { GET as getVehicles, POST as createVehicle } from "@/app/api/vehicles/route";
import { GET as getTenant, PUT as updateTenant } from "@/app/api/tenants/route";
import { GET as getDbStatus } from "@/app/api/db/sync/route";
import { NextRequest } from "next/server";

describe("Database API Routes & Persistence Layer", () => {
  it("returns database connectivity status via /api/db/sync", async () => {
    const res = await getDbStatus();
    const data = await res.json();
    expect(data).toHaveProperty("hasDatabaseUrl");
    expect(data).toHaveProperty("status");
  });

  it("lists vehicles from /api/vehicles", async () => {
    const req = new NextRequest("http://localhost:3000/api/vehicles");
    const res = await getVehicles(req);
    const data = await res.json();
    expect(data.vehicles).toBeInstanceOf(Array);
  });

  it("creates and persists a new vehicle via POST /api/vehicles", async () => {
    const payload = {
      tenantId: "tenant-oriente-1",
      brand: "Hyundai",
      model: "Tucson",
      version: "2.0 GL 4x2",
      year: 2022,
      mileage: 35000,
      transmission: "AUTOMATICA",
      fuelType: "BENCINA",
      bodyType: "SUV",
      color: "Gris",
      licensePlate: "PPTT88",
      priceCash: 17990000,
      priceFinanced: 16990000,
      acquisitionCost: 14500000,
      status: "AVAILABLE",
    };

    const req = new NextRequest("http://localhost:3000/api/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await createVehicle(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.vehicle.brand).toBe("Hyundai");
    expect(data.vehicle.licensePlate).toBe("PPTT88");
  });

  it("updates and persists tenant configuration via PUT /api/tenants", async () => {
    const payload = {
      name: "Automotora Andes Motors SpA",
      rut: "76.999.888-2",
      phone: "+56 9 9123 4567",
      city: "Santiago",
      slug: "andes-motors",
    };

    const req = new NextRequest("http://localhost:3000/api/tenants", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const res = await updateTenant(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.tenant.name).toBe("Automotora Andes Motors SpA");
  });
});
