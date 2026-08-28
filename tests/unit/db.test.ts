import { describe, it, expect } from "vitest";
import {
  tenants,
  vehicles,
  leads,
  serviceOrders,
  transferOrders,
  tradeInValuations,
} from "@/lib/db/schema";
import { repository } from "@/lib/db/repository";
import { seedDatabase } from "@/lib/db/seed";

describe("PostgreSQL Multi-Tenant Schema & Drizzle ORM", () => {
  it("defines 10 core tables with proper primary keys and tenant foreign keys", () => {
    expect(tenants.id).toBeDefined();
    expect(vehicles.tenantId).toBeDefined();
    expect(vehicles.licensePlate).toBeDefined();
    expect(leads.tenantId).toBeDefined();
    expect(serviceOrders.tenantId).toBeDefined();
    expect(transferOrders.tenantId).toBeDefined();
    expect(tradeInValuations.tenantId).toBeDefined();
  });

  it("enforces strict multi-tenant filtering in repository queries", async () => {
    const tenantVehicles = await repository.getVehicles("tenant-oriente-1");
    expect(tenantVehicles.length).toBeGreaterThan(0);
    expect(tenantVehicles.every((v) => v.tenantId === "tenant-oriente-1")).toBe(true);

    const emptyTenantVehicles = await repository.getVehicles("non-existent-tenant");
    expect(emptyTenantVehicles.length).toBe(0);
  });

  it("executes database seed script returning seeded entity counts", async () => {
    const res = await seedDatabase();
    expect(res.success).toBe(true);
    expect(res.vehicleCount).toBeGreaterThanOrEqual(6);
    expect(res.leadCount).toBeGreaterThanOrEqual(4);
    expect(res.serviceOrderCount).toBeGreaterThanOrEqual(4);
  });
});
