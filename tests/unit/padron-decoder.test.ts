import { describe, it, expect } from "vitest";
import { lookupVehicleByPlate } from "@/lib/chilean-utils/padron-decoder";

describe("Chilean License Plate Padrón Decoder (CAV & Registro Civil)", () => {
  it("decodes known exact Chilean license plates with rich specifications", () => {
    const rav4 = lookupVehicleByPlate("BBCL12");
    expect(rav4.brand).toBe("Toyota");
    expect(rav4.model).toBe("RAV4");
    expect(rav4.year).toBe(2022);
    expect(rav4.priceCash).toBe(16990000);
    expect(rav4.transmission).toBe("AUTOMATICA");
    expect(rav4.fuelType).toBe("BENCINA");
    expect(rav4.source).toBe("CAV_EXACT_MATCH");

    const tucson = lookupVehicleByPlate("KPTY44");
    expect(tucson.brand).toBe("Hyundai");
    expect(tucson.model).toBe("Tucson");
    expect(tucson.year).toBe(2023);

    const dmax = lookupVehicleByPlate("CWDK90");
    expect(dmax.brand).toBe("Chevrolet");
    expect(dmax.model).toBe("D-Max");
    expect(dmax.bodyType).toBe("CAMIONETA");
    expect(dmax.fuelType).toBe("DIESEL");

    const swift = lookupVehicleByPlate("LJRR55");
    expect(swift.brand).toBe("Suzuki");
    expect(swift.model).toBe("Swift");
    expect(swift.bodyType).toBe("HATCHBACK");
  });

  it("decodes arbitrary Chilean license plates deterministically with market valuation", () => {
    const decoded = lookupVehicleByPlate("SZ1234");
    expect(decoded.brand).toBeDefined();
    expect(decoded.model).toBeDefined();
    expect(decoded.year).toBeGreaterThanOrEqual(2020);
    expect(decoded.priceCash).toBeGreaterThan(0);
    expect(decoded.priceFinanced).toBeLessThan(decoded.priceCash);
    expect(decoded.description).toContain(decoded.brand);
    expect(decoded.source).toBe("REGISTRO_CIVIL_SERIES");
  });

  it("handles unformatted plates with dots and lowercase gracefully", () => {
    const decoded = lookupVehicleByPlate("bb.cl-12");
    expect(decoded.brand).toBe("Toyota");
    expect(decoded.licensePlate).toBe("BBCL12");
  });
});
