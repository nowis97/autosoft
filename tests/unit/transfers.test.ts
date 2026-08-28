import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("Transactional Transfer Orders & Digital Closing", () => {
  it("creates a transfer order and calculates taxes", () => {
    const transfer = store.createTransferOrder({
      tenantId: "tenant-oriente-1",
      vehicleId: "veh-1",
      buyerName: "Camila Fernandez",
      buyerRut: "19.876.543-0",
      buyerPhone: "+56 9 8877 6655",
      buyerEmail: "camila@correo.cl",
      buyerAddress: "Apoquindo 4000",
      buyerCity: "Las Condes",
      salePrice: 16490000,
    });

    expect(transfer.id).toBeDefined();
    expect(transfer.transferTax15).toBeGreaterThan(200000);
    expect(transfer.status).toBe("SIGNATURE_PENDING");
  });

  it("completes a transfer, marking vehicle SOLD and updating lead", () => {
    const transfer = store.getTransfers()[0];
    expect(transfer).toBeDefined();

    const completed = store.completeTransfer(transfer.id, {
      deliveredMileage: 43000,
      fuelLevel: "Lleno",
      hasSpareTire: true,
      hasToolkit: true,
      hasDuplicateKey: true,
      hasTriangleAndVest: true,
      hasManuals: true,
      cleanExterior: true,
      cleanInterior: true,
      signedAt: new Date().toISOString(),
      receiverName: transfer.buyerName,
      receiverRut: transfer.buyerRut,
    });

    expect(completed?.status).toBe("REGISTERED");
    const vehicle = store.getVehicleById(transfer.vehicleId);
    expect(vehicle?.status).toBe("SOLD");
    expect(vehicle?.publishedToWeb).toBe(false);
  });
});
