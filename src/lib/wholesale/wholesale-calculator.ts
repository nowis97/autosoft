export interface WholesaleSettlement {
  wholesalePriceCLP: number;
  platformFeeRate: number; // 0.015 (1.5%)
  platformFeeCLP: number;
  totalBuyerPaysCLP: number;
  netSellerReceivesCLP: number;
}

export function calculateWholesaleSettlement(wholesalePriceCLP: number): WholesaleSettlement {
  const platformFeeRate = 0.015;
  const platformFeeCLP = Math.round(wholesalePriceCLP * platformFeeRate);
  const totalBuyerPaysCLP = wholesalePriceCLP + platformFeeCLP;
  const netSellerReceivesCLP = wholesalePriceCLP;

  return {
    wholesalePriceCLP,
    platformFeeRate,
    platformFeeCLP,
    totalBuyerPaysCLP,
    netSellerReceivesCLP,
  };
}
