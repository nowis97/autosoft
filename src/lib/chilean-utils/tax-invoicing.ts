export interface MarginVATTaxBreakdown {
  salePrice: number;
  acquisitionCost: number;
  grossCommercialMargin: number;
  exemptAmountCLP: number;
  netTaxableAmountCLP: number;
  vat19CLP: number;
  totalInvoiceCLP: number;
}

export function calculateUsedCarInvoiceTaxes(
  salePrice: number,
  acquisitionCost: number
): MarginVATTaxBreakdown {
  const grossCommercialMargin = Math.max(0, salePrice - acquisitionCost);
  const exemptAmountCLP = Math.min(salePrice, acquisitionCost);

  // Margin includes 19% VAT -> Base = Margin / 1.19
  const netTaxableAmountCLP = Math.round(grossCommercialMargin / 1.19);
  const vat19CLP = grossCommercialMargin - netTaxableAmountCLP;
  const totalInvoiceCLP = exemptAmountCLP + netTaxableAmountCLP + vat19CLP;

  return {
    salePrice,
    acquisitionCost,
    grossCommercialMargin,
    exemptAmountCLP,
    netTaxableAmountCLP,
    vat19CLP,
    totalInvoiceCLP,
  };
}

export function calculateCommissionInvoiceTaxes(commissionAmount: number) {
  const netAmountCLP = Math.round(commissionAmount / 1.19);
  const vat19CLP = commissionAmount - netAmountCLP;

  return {
    grossCommissionCLP: commissionAmount,
    netAmountCLP,
    vat19CLP,
    totalInvoiceCLP: commissionAmount,
  };
}
