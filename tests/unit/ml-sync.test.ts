import { describe, it, expect } from "vitest";
import {
  buildMercadoLibreItemPayload,
  isTokenExpired,
  calculateSyncStatus,
  type MLVehicleItemInput,
} from "@/lib/syndication/ml-sync-engine";

describe("Mercado Libre Chile Stock Sync Engine", () => {
  const sampleVehicle: MLVehicleItemInput = {
    id: "veh-test-1",
    title: "Toyota RAV4 2021 2.0 LE 4x2 CVT",
    brand: "Toyota",
    model: "RAV4",
    year: 2021,
    mileage: 42500,
    priceCLP: 16490000,
    description: "Excelente estado, mantenciones al dia.",
    images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588"],
    licensePlate: "BB-CL-12",
  };

  it("builds a valid Mercado Libre MLC automotive payload with standard attributes", () => {
    const payload = buildMercadoLibreItemPayload(sampleVehicle);

    expect(payload.title).toBe("Toyota RAV4 2021 2.0 LE 4x2 CVT");
    expect(payload.category_id).toBe("MLC1744"); // Autos, Camionetas y 4x4
    expect(payload.price).toBe(16490000);
    expect(payload.currency_id).toBe("CLP");
    expect(payload.buying_mode).toBe("classified");
    expect(payload.listing_type_id).toBe("gold_premium");
    expect(payload.pictures.length).toBe(1);
    expect(payload.pictures[0].source).toBe(sampleVehicle.images[0]);

    // Verify key attributes
    const brandAttr = payload.attributes.find((a) => a.id === "BRAND");
    const yearAttr = payload.attributes.find((a) => a.id === "VEHICLE_YEAR");
    const kmAttr = payload.attributes.find((a) => a.id === "KILOMETERS");

    expect(brandAttr?.value_name).toBe("Toyota");
    expect(yearAttr?.value_name).toBe("2021");
    expect(kmAttr?.value_name).toBe("42500 km");
  });

  it("correctly identifies when an OAuth2 access token is expired or about to expire", () => {
    const pastTimestamp = Date.now() - 3600 * 1000;
    const futureTimestamp = Date.now() + 3600 * 1000;
    const nearExpiryTimestamp = Date.now() + 120 * 1000;

    expect(isTokenExpired(pastTimestamp)).toBe(true);
    expect(isTokenExpired(nearExpiryTimestamp)).toBe(true);
    expect(isTokenExpired(futureTimestamp)).toBe(false);
  });

  it("calculates sync differences between local stock and remote published items", () => {
    const localVehicles: MLVehicleItemInput[] = [
      sampleVehicle,
      {
        id: "veh-test-2",
        title: "Mazda CX-5 2022",
        brand: "Mazda",
        model: "CX-5",
        year: 2022,
        mileage: 28000,
        priceCLP: 18990000,
        description: "Unico dueno.",
        images: [],
        licensePlate: "PG-RT-44",
      },
    ];

    const remoteItems = [
      { localVehicleId: "veh-test-1", mlItemId: "MLC987654321", price: 16490000, status: "active" },
    ];

    const diff = calculateSyncStatus(localVehicles, remoteItems);

    expect(diff.toCreate.length).toBe(1);
    expect(diff.toCreate[0].id).toBe("veh-test-2");
    expect(diff.inSync.length).toBe(1);
    expect(diff.inSync[0].id).toBe("veh-test-1");
    expect(diff.toUpdate.length).toBe(0);
  });
});
