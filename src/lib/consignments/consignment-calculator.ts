export interface ConsignmentSettlementParams {
  salePrice: number;
  commissionType: "PERCENTAGE" | "FIXED";
  commissionValue: number; // e.g. 4 for 4% or 500000 for $500.000
  deductibleExpensesCLP?: number; // detailing, inspection fees
}

export interface ConsignmentSettlementResult {
  salePrice: number;
  dealerCommissionCLP: number;
  effectiveCommissionPercentage: number;
  deductibleExpensesCLP: number;
  netPayoutToOwnerCLP: number;
}

export function calculateConsignmentSettlement(
  params: ConsignmentSettlementParams
): ConsignmentSettlementResult {
  const { salePrice, commissionType, commissionValue, deductibleExpensesCLP = 0 } = params;

  let dealerCommissionCLP = 0;
  if (commissionType === "PERCENTAGE") {
    dealerCommissionCLP = Math.round(salePrice * (commissionValue / 100));
  } else {
    dealerCommissionCLP = commissionValue;
  }

  const effectiveCommissionPercentage =
    salePrice > 0 ? Number(((dealerCommissionCLP / salePrice) * 100).toFixed(1)) : 0;

  const netPayoutToOwnerCLP = salePrice - dealerCommissionCLP - deductibleExpensesCLP;

  return {
    salePrice,
    dealerCommissionCLP,
    effectiveCommissionPercentage,
    deductibleExpensesCLP,
    netPayoutToOwnerCLP: Math.max(0, netPayoutToOwnerCLP),
  };
}
