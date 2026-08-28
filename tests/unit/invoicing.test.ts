import { describe, it, expect } from "vitest";
import {
  calculateUsedCarInvoiceTaxes,
  calculateCommissionInvoiceTaxes,
} from "@/lib/chilean-utils/tax-invoicing";
import { store } from "@/lib/store";

describe("Chilean Automotive Electronic Invoicing & Margin VAT (Ley 21.420)", () => {
  it("calculates exempt cost, net taxable margin, and 19% VAT exactly", () => {
    const salePrice = 16490000;
    const acquisitionCost = 13800000;

    const taxes = calculateUsedCarInvoiceTaxes(salePrice, acquisitionCost);

    expect(taxes.exemptAmountCLP).toBe(13800000);
    expect(taxes.grossCommercialMargin).toBe(2690000);
    expect(taxes.netTaxableAmountCLP).toBe(Math.round(2690000 / 1.19));
    expect(taxes.vat19CLP).toBe(2690000 - taxes.netTaxableAmountCLP);
    expect(taxes.totalInvoiceCLP).toBe(salePrice);
  });

  it("calculates brokerage commission invoice taxes", () => {
    const commTaxes = calculateCommissionInvoiceTaxes(595000);
    expect(commTaxes.grossCommissionCLP).toBe(595000);
    expect(commTaxes.netAmountCLP).toBe(500000);
    expect(commTaxes.vat19CLP).toBe(95000);
  });

  it("creates and registers a new DTE invoice in store", () => {
    const newInv = store.createInvoice({
      tenantId: "tenant-oriente-1",
      dteType: "33",
      receiverName: "Inversiones Santa María SpA",
      receiverRut: "77.192.880-1",
      receiverAddress: "Apoquindo 4000",
      receiverCity: "Las Condes",
      receiverEmail: "contacto@santamaria.cl",
      description: "Venta Usado Toyota RAV4 2021",
      exemptAmountCLP: 13800000,
      netTaxableAmountCLP: 2260504,
      vat19CLP: 429496,
      totalCLP: 16490000,
    });

    expect(newInv.folio).toBeGreaterThanOrEqual(1000);
    expect(newInv.siiStatus).toBe("ACCEPTED");
    expect(newInv.siiTrackId).toBeDefined();
  });
});
