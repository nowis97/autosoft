export interface TaxCalculationParams {
  salePrice: number;
  fiscalAppraisal?: number;
}

export interface TransferCostBreakdown {
  salePrice: number;
  fiscalAppraisal: number;
  taxableBase: number;
  transferTax15: number;
  notaryFee: number;
  civilRegistryFee: number;
  totalTransferCost: number;
}

/**
 * Calculates official Chilean vehicle transfer costs according to:
 * - D.L. 3475 (Ley de Timbres y Estampillas, Art. 13): 1.5% tax over the greater of sale price or SII fiscal appraisal.
 * - Notarial authorization fee (standard ~$28.000 CLP).
 * - Civil Registry vehicle registry fee (~$30.490 CLP).
 */
export function calculateTransferTaxes({
  salePrice,
  fiscalAppraisal,
}: TaxCalculationParams): TransferCostBreakdown {
  const estimatedFiscal = fiscalAppraisal && fiscalAppraisal > 0 ? fiscalAppraisal : Math.round(salePrice * 0.85);
  const taxableBase = Math.max(salePrice, estimatedFiscal);
  const transferTax15 = Math.round(taxableBase * 0.015);
  const notaryFee = 28000;
  const civilRegistryFee = 30490;
  const totalTransferCost = transferTax15 + notaryFee + civilRegistryFee;

  return {
    salePrice,
    fiscalAppraisal: estimatedFiscal,
    taxableBase,
    transferTax15,
    notaryFee,
    civilRegistryFee,
    totalTransferCost,
  };
}

