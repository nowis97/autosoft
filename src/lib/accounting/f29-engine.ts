import { InvoiceDTE, ServiceOrder } from "@/types";

export interface F29CalculationInput {
  period: string; // "YYYY-MM"
  invoices: InvoiceDTE[];
  serviceExpenses: ServiceOrder[];
  ppmRate?: number; // e.g. 0.015 (1.5%)
}

export interface F29MonthlySummary {
  period: string;
  totalInvoicesCount: number;
  totalServiceOrdersCount: number;
  // Ventas & Débitos
  code503ExemptSalesCLP: number; // Monto exento/no gravado (Costo adquisición Ley 21.420)
  code502NetTaxableSalesCLP: number; // Base neta gravada (Margen / 1.19)
  code502VatDebitCLP: number; // Débito Fiscal Facturas emitidas (19% sobre margen)
  totalBilledSalesCLP: number; // Facturación bruta total
  // Compras & Créditos
  code511GrossPurchasesCLP: number; // Total compras/gastos con IVA
  code511NetPurchasesCLP: number; // Base neta de compras de taller
  code511VatCreditCLP: number; // Crédito Fiscal IVA compras/talleres
  // Impuestos Determinados
  code538NetVatPayableCLP: number; // IVA determinado a pagar (Débito - Crédito)
  code77VatCreditCarryoverCLP: number; // Remanente de crédito fiscal para el mes siguiente
  // PPM (Pagos Provisionales Mensuales)
  ppmRatePercent: number; // e.g. 1.5%
  code151PpmTaxableBaseCLP: number; // Base imponible PPM
  code152PpmCLP: number; // PPM determinado
  // Total a Pagar
  code91TotalTaxPayableCLP: number; // Total a pagar al Fisco (IVA Neto + PPM)
}

export interface F29ExportResult {
  filename: string;
  csvContent: string;
  summary: F29MonthlySummary;
}

/**
 * Calculates official SII Formulario F29 line item codes according to Ley 21.420 (IVA sobre Margen de Usados)
 */
export function calculateMonthlyF29Summary({
  period,
  invoices,
  serviceExpenses,
  ppmRate = 0.015,
}: F29CalculationInput): F29MonthlySummary {
  // Filter invoices and service orders by period if timestamp contains it
  const periodInvoices = invoices.filter((i) => !i.issuedAt || i.issuedAt.startsWith(period));
  const periodServices = serviceExpenses.filter(
    (s) => !s.createdAt || s.createdAt.startsWith(period) || (s.completedAt && s.completedAt.startsWith(period))
  );

  const totalInvoicesCount = periodInvoices.length;
  const totalServiceOrdersCount = periodServices.length;

  const code503ExemptSalesCLP = periodInvoices.reduce((sum, i) => sum + i.exemptAmountCLP, 0);
  const code502NetTaxableSalesCLP = periodInvoices.reduce((sum, i) => sum + i.netTaxableAmountCLP, 0);
  const code502VatDebitCLP = periodInvoices.reduce((sum, i) => sum + i.vat19CLP, 0);
  const totalBilledSalesCLP = periodInvoices.reduce((sum, i) => sum + i.totalCLP, 0);

  const code511GrossPurchasesCLP = periodServices.reduce((sum, s) => sum + s.costCLP, 0);
  const code511NetPurchasesCLP = Math.round(code511GrossPurchasesCLP / 1.19);
  const code511VatCreditCLP = code511GrossPurchasesCLP - code511NetPurchasesCLP;

  const netVatDifference = code502VatDebitCLP - code511VatCreditCLP;
  const code538NetVatPayableCLP = netVatDifference > 0 ? netVatDifference : 0;
  const code77VatCreditCarryoverCLP = netVatDifference < 0 ? Math.abs(netVatDifference) : 0;

  const code151PpmTaxableBaseCLP = totalBilledSalesCLP;
  const code152PpmCLP = Math.round(code151PpmTaxableBaseCLP * ppmRate);

  const code91TotalTaxPayableCLP = code538NetVatPayableCLP + code152PpmCLP;

  return {
    period,
    totalInvoicesCount,
    totalServiceOrdersCount,
    code503ExemptSalesCLP,
    code502NetTaxableSalesCLP,
    code502VatDebitCLP,
    totalBilledSalesCLP,
    code511GrossPurchasesCLP,
    code511NetPurchasesCLP,
    code511VatCreditCLP,
    code538NetVatPayableCLP,
    code77VatCreditCarryoverCLP,
    ppmRatePercent: ppmRate * 100,
    code151PpmTaxableBaseCLP,
    code152PpmCLP,
    code91TotalTaxPayableCLP,
  };
}

/**
 * Generates an official accounting CSV export formatted for Chilean accountants and ERP systems
 */
export function generateF29AccountingExport(summary: F29MonthlySummary): F29ExportResult {
  const lines = [
    "Codigo_SII,Descripcion,Monto_CLP,Regimen_Legal",
    `503,Ventas Exentas o no gravadas,${summary.code503ExemptSalesCLP},Ley 21.420 Costo Adquisicion Usados`,
    `502,Debito Fiscal Facturas emitidas (Ley 21.420),${summary.code502VatDebitCLP},IVA 19% sobre Margen Bruto`,
    `511,Credito Fiscal Facturas recibidas (Talleres e Insumos),${summary.code511VatCreditCLP},Credito Fiscal D.L. 825`,
    `538,IVA Determinado a Pagar,${summary.code538NetVatPayableCLP},Debito Fiscal menos Credito Fiscal`,
    `77,Remanente Credito Fiscal Siguiente Mes,${summary.code77VatCreditCarryoverCLP},Arrastre Art. 28 D.L. 825`,
    `151,Base Imponible Pagos Provisionales PPM,${summary.code151PpmTaxableBaseCLP},Ventas Brutas Totales`,
    `152,PPM Determinado (${summary.ppmRatePercent}%),${summary.code152PpmCLP},Pago Provisional Mensual`,
    `91,Total a Pagar F29,${summary.code91TotalTaxPayableCLP},Monto Final a Declarar en SII`,
  ];

  return {
    filename: `F29_SII_${summary.period.replace("-", "_")}_Autosoft360.csv`,
    csvContent: lines.join("\n"),
    summary,
  };
}
