import { describe, it, expect, beforeEach } from "vitest";
import { store } from "@/lib/store";

describe("Store Data Management & Dealership Onboarding", () => {
  beforeEach(() => {
    store.restoreMockData();
  });

  it("initializes with demo data", () => {
    expect(store.getVehicles().length).toBeGreaterThan(0);
    expect(store.getLeads().length).toBeGreaterThan(0);
    expect(store.getTenant().name).toBe("Automotora Oriente");
  });

  it("clears all mock data cleanly to start with a blank catalog", () => {
    store.clearMockData();
    expect(store.getVehicles().length).toBe(0);
    expect(store.getLeads().length).toBe(0);
    expect(store.getStats().totalVehicles).toBe(0);
  });

  it("allows setting up a custom Chilean dealership tenant", () => {
    store.updateTenant({
      name: "Automotora Los Andes SpA",
      rut: "77.981.204-5",
      phone: "+56 9 8812 3456",
      city: "Santiago",
      slug: "los-andes",
    });

    const tenant = store.getTenant();
    expect(tenant.name).toBe("Automotora Los Andes SpA");
    expect(tenant.rut).toBe("77.981.204-5");
    expect(tenant.slug).toBe("los-andes");
  });

  it("restores demo data when requested", () => {
    store.clearMockData();
    expect(store.getVehicles().length).toBe(0);

    store.restoreMockData();
    expect(store.getVehicles().length).toBeGreaterThan(0);
  });
});
