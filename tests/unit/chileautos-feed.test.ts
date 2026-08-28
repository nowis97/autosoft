import { describe, it, expect } from "vitest";
import {
  generateChileautosXMLFeed,
  validateChileautosVehicle,
  type ChileautosVehicleItem,
} from "@/lib/syndication/chileautos-feed";

describe("Chileautos / Carsales XML Feed Generator", () => {
  const validVehicle: ChileautosVehicleItem = {
    id: "veh-ch-1",
    licensePlate: "BBCL12",
    brand: "Toyota",
    model: "RAV4",
    version: "2.0 LE 4x2 CVT",
    year: 2021,
    mileage: 42500,
    priceCLP: 16490000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Rojo Metalico",
    status: "AVAILABLE",
    description: "Excelente estado & mantenciones al dia.",
    images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588"],
    dealerRut: "76.452.189-K",
    dealerName: "Automotora Oriente",
  };

  it("validates that required fields for Chileautos XML feed are present and formatted", () => {
    const valid = validateChileautosVehicle(validVehicle);
    expect(valid.isValid).toBe(true);
    expect(valid.errors.length).toBe(0);

    const invalid = validateChileautosVehicle({
      ...validVehicle,
      priceCLP: 0,
      year: 1980,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("generates valid Carsales Network XML with CDATA escaping and proper tags", () => {
    const vehicles: ChileautosVehicleItem[] = [
      validVehicle,
      {
        ...validVehicle,
        id: "veh-ch-2",
        licensePlate: "PGRT44",
        brand: "Mazda",
        model: "CX-5",
        status: "SOLD", // Should be excluded if only available stock requested
      },
    ];

    const xml = generateChileautosXMLFeed(vehicles, { onlyAvailable: true });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<carsales_feed version="2.0">');
    expect(xml).toContain('<dealer rut="76.452.189-K" name="Automotora Oriente">');
    expect(xml).toContain('<vehicle id="veh-ch-1">');
    expect(xml).toContain('<![CDATA[Excelente estado & mantenciones al dia.]]>');
    expect(xml).toContain('<price currency="CLP">16490000</price>');
    expect(xml).toContain('<plate>BBCL12</plate>');
    expect(xml).not.toContain('<vehicle id="veh-ch-2">'); // SOLD vehicle excluded
  });
});
