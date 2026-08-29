import { describe, it, expect, vi } from "vitest";
import { scrapeChileanVehiclePlate } from "@/lib/chilean-utils/plate-scraper";
import { GET as getScrapedPlate } from "@/app/api/scraper/plate/[plate]/route";
import { NextRequest } from "next/server";

// bpchile externo: fuerza fallback en unit-test (sin red)
vi.mock("@/lib/chilean-utils/patentes-chile-api", () => ({
  queryBpChile: vi.fn().mockRejectedValue(new Error("bpchile bloqueado en unit-test")),
}));


describe("Chilean Plate Public Scraper (PRT, MTT, SII & Padrón)", () => {
  it("scrapes vehicle data for standard Chilean license plates with revision tecnica and SII valuation", async () => {
    const result = await scrapeChileanVehiclePlate("BBCL12");
    expect(result.brand).toBe("Toyota");
    expect(result.model).toBe("RAV4");
    expect(result.year).toBe(2022);
    expect(result.prtStatus).toBe("AL_DIA");
    expect(result.siiTaxationCLP).toBeGreaterThan(5000000);
    expect(result.rawSource).toBeDefined();
  });

  it("handles newly registered license plates cleanly with series estimation", async () => {
    const result = await scrapeChileanVehiclePlate("SZ9988");
    expect(result.brand).toBeDefined();
    expect(result.priceCash).toBeGreaterThan(0);
    expect(result.prtStatus).toBe("AL_DIA");
  });

  it("serves scraped vehicle data via REST API /api/scraper/plate/[plate]", async () => {
    const req = new NextRequest("http://localhost:3000/api/scraper/plate/KPTY44");
    const res = await getScrapedPlate(req, { params: Promise.resolve({ plate: "KPTY44" }) });
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.vehicle.brand).toBe("Hyundai");
    expect(data.vehicle.model).toBe("Tucson");
  });
});
