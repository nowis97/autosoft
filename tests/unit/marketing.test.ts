import { describe, it, expect } from "vitest";
import { generateAdCopy } from "@/lib/marketing/ad-copy-generator";
import { store } from "@/lib/store";

describe("Marketing & Social Ads Creative Generator", () => {
  const tenant = store.getTenant();
  const vehicle = store.getVehicles()[0]; // Toyota RAV4

  it("generates compelling social media ad copy with WhatsApp link and financing quote", () => {
    const copy = generateAdCopy(vehicle, tenant, "DARK_LUXURY", {
      includeFinancing: true,
      includeTradeIn: true,
      highlightWarranty: true,
    });

    expect(copy).toContain("TOYOTA");
    expect(copy).toContain("RAV4");
    expect(copy).toContain("Cuota mensual estimada");
    expect(copy).toContain("Garantía 6 Meses");
    expect(copy).toContain("wa.me");
  });

  it("adapts headlines based on the chosen visual theme", () => {
    const flashCopy = generateAdCopy(vehicle, tenant, "FLASH_SALE");
    expect(flashCopy).toContain("BONO FINANCIAMIENTO");

    const luxuryCopy = generateAdCopy(vehicle, tenant, "DARK_LUXURY");
    expect(luxuryCopy).toContain("EXCLUSIVO");
  });
});
