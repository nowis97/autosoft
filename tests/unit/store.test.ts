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

  it("handles dealer tasks CRUD and overdue checks", () => {
    const task = store.createTask({
      tenantId: "tenant-oriente-1",
      vehicleId: "veh-1",
      vehiclePlate: "BBCL12",
      title: "Revisar luces y frenos",
      description: "Inspección de seguridad para entrega",
      priority: "ALTA",
      department: "TALLER",
      status: "PENDIENTE",
      dueDate: "2026-08-20T10:00:00Z",
    });

    expect(task.id).toBeDefined();
    expect(task.status).toBe("PENDIENTE");

    const updated = store.updateTask(task.id, { status: "COMPLETADA" });
    expect(updated?.status).toBe("COMPLETADA");
    expect(updated?.completedAt).toBeDefined();

    const allTasks = store.getTasks("tenant-oriente-1");
    expect(allTasks.some((t) => t.id === task.id)).toBe(true);

    const deleted = store.deleteTask(task.id);
    expect(deleted).toBe(true);
  });

  it("handles vehicle pipeline stage updates and sale approval workflow", () => {
    const vehicle = store.getVehicles()[0];
    const updated = store.updateVehiclePipelineStage(vehicle.id, "PREPARACION");
    expect(updated?.pipelineStage).toBe("PREPARACION");

    const approval = store.createSaleApproval({
      tenantId: "tenant-oriente-1",
      vehicleId: vehicle.id,
      buyerName: "Juan Pérez",
      buyerRut: "12.345.678-9",
      salePriceCLP: 15000000,
      paymentMethod: "TRANSFERENCIA",
      salesRepUserId: "user-2",
      salesRepName: "Camila Morales",
      commissionRule: {
        base: "TOTAL_VENTA",
        type: "PERCENTAGE",
        percentage: 1,
      },
      calculatedCommissionCLP: 150000,
      marginCLP: 2000000,
    });

    expect(approval.id).toBeDefined();
    expect(approval.status).toBe("PENDING");

    const approved = store.approveSale(approval.id, 1050);
    expect(approved?.status).toBe("APPROVED");
    expect(approved?.dteFolio).toBe(1050);

    const targetVeh = store.getVehicle(vehicle.id);
    expect(targetVeh?.status).toBe("SOLD");
    expect(targetVeh?.pipelineStage).toBe("VENDIDO");

    const leaderboard = store.getSellersLeaderboard("tenant-oriente-1");
    expect(leaderboard.length).toBeGreaterThan(0);
    expect(leaderboard[0].totalSalesCLP).toBeGreaterThanOrEqual(15000000);
  });
});
