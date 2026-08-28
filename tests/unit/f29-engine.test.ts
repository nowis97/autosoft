import { describe, it, expect } from "vitest";
import {
  calculateMonthlyF29Summary,
  generateF29AccountingExport,
  type F29CalculationInput,
} from "@/lib/accounting/f29-engine";
import { InvoiceDTE, ServiceOrder } from "@/types";

describe("SII Formulario F29 Tax Engine & Ley 21.420 IVA sobre Margen", () => {
  const sampleInvoices: InvoiceDTE[] = [
    {
      id: "dte-1",
      tenantId: "tenant-oriente-1",
      folio: 1042,
      dteType: "33",
      vehicleId: "veh-6",
      receiverName: "Gonzalo Valenzuela",
      receiverRut: "11.111.111-1",
      receiverAddress: "Av. Vitacura 5400",
      receiverCity: "Vitacura, Santiago",
      receiverEmail: "gonzalo.valenzuela@correo.cl",
      description: "Venta Vehículo Usado Jeep Grand Cherokee - Ley 21.420",
      exemptAmountCLP: 17000000,
      netTaxableAmountCLP: 5033613,
      vat19CLP: 956387,
      totalCLP: 22990000,
      siiStatus: "ACCEPTED",
      siiTrackId: "SII-TRK-8812903",
      issuedAt: "2026-08-25T16:30:00Z",
    },
  ];

  const sampleServiceExpenses: ServiceOrder[] = [
    {
      id: "srv-1",
      tenantId: "tenant-oriente-1",
      vehicleId: "veh-1",
      category: "MECANICA",
      description: "Mantención 40.000 km",
      providerName: "Taller Mecánico Oriente",
      costCLP: 185000, // Con IVA
      invoiceNumber: "FAC-88129",
      status: "COMPLETED",
      completedAt: "2026-08-12T16:00:00Z",
      createdAt: "2026-08-11T10:00:00Z",
    },
  ];

  const input: F29CalculationInput = {
    period: "2026-08",
    invoices: sampleInvoices,
    serviceExpenses: sampleServiceExpenses,
    ppmRate: 0.015, // 1.5% PPM
  };

  it("calculates exact SII Formulario F29 line codes (502, 503, 511, 538, 151, 91)", () => {
    const f29 = calculateMonthlyF29Summary(input);

    expect(f29.period).toBe("2026-08");
    // Código 503: Ventas exentas (Costo de adquisición de usados según Ley 21.420)
    expect(f29.code503ExemptSalesCLP).toBe(17000000);
    // Código 502: Débito Fiscal IVA Facturas
    expect(f29.code502VatDebitCLP).toBe(956387);
    // Código 511: Crédito Fiscal IVA Compras/Servicios de taller
    expect(f29.code511VatCreditCLP).toBeGreaterThan(0);
    // Código 538: IVA Determinado (Débito - Crédito)
    expect(f29.code538NetVatPayableCLP).toBe(f29.code502VatDebitCLP - f29.code511VatCreditCLP);
    // Código 151: Base imponible PPM y Código 152: PPM Determinado
    expect(f29.code152PpmCLP).toBe(Math.round(22990000 * 0.015));
    // Código 91: Total a Pagar al Fisco (IVA Neto + PPM)
    expect(f29.code91TotalTaxPayableCLP).toBe(f29.code538NetVatPayableCLP + f29.code152PpmCLP);
  });

  it("generates an accounting export ready for upload or download in CSV format", () => {
    const f29 = calculateMonthlyF29Summary(input);
    const exportData = generateF29AccountingExport(f29);

    expect(exportData.csvContent).toContain("Codigo_SII,Descripcion,Monto_CLP");
    expect(exportData.csvContent).toContain("502,Debito Fiscal Facturas emitidas (Ley 21.420)");
    expect(exportData.csvContent).toContain("503,Ventas Exentas o no gravadas");
    expect(exportData.csvContent).toContain("91,Total a Pagar F29");
  });
});
