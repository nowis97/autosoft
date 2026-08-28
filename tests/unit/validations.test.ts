import { describe, it, expect } from "vitest";
import { chileanRutSchema, licensePlateSchema, vehicleInputSchema } from "@/lib/validations/schemas";

describe("Trust Boundary Zod Validation Schemas", () => {
  it("validates valid Chilean RUT and rejects invalid Módulo 11", () => {
    expect(chileanRutSchema.safeParse("11.111.111-1").success).toBe(true);
    expect(chileanRutSchema.safeParse("76.452.189-7").success).toBe(true);
    expect(chileanRutSchema.safeParse("12.345.678-5").success).toBe(true);
    expect(chileanRutSchema.safeParse("11.111.111-9").success).toBe(false);
  });

  it("validates valid Chilean license plates format", () => {
    expect(licensePlateSchema.safeParse("BB·CL·12").success).toBe(true);
    expect(licensePlateSchema.safeParse("BBCL12").success).toBe(true);
    expect(licensePlateSchema.safeParse("AB1234").success).toBe(true);
    expect(licensePlateSchema.safeParse("INVALID").success).toBe(false);
  });

  it("validates vehicle inputs strictly", () => {
    const valid = vehicleInputSchema.safeParse({
      brand: "Toyota",
      model: "RAV4",
      year: 2021,
      mileage: 45000,
      licensePlate: "BBCL12",
      priceCash: 16990000,
      acquisitionCost: 13500000,
    });
    expect(valid.success).toBe(true);

    const invalid = vehicleInputSchema.safeParse({
      brand: "Toyota",
      model: "RAV4",
      year: 1980, // too old
      mileage: -10, // negative
      licensePlate: "INVALID",
      priceCash: -500, // negative
    });
    expect(invalid.success).toBe(false);
  });
});
