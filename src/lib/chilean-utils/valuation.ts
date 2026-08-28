export type ValuationCondition = "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_REPAIR";

export interface ValuationInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: ValuationCondition;
  customMarketPrice?: number;
}

export interface ValuationResult {
  estimatedMarketPrice: number;
  mileageAdjustmentFactor: number;
  conditionAdjustmentCLP: number;
  reconditioningEstimateCLP: number;
  quickOffer: number;
  recommendedOffer: number;
  maxOffer: number;
  dealerMarginPercentage: number;
  expectedGrossProfitCLP: number;
}

// Benchmark base prices in Chilean market (CLP) for typical used car models (2021 reference)
const BASE_MARKET_PRICES: Record<string, number> = {
  "toyota-rav4": 17500000,
  "toyota-yaris": 9500000,
  "toyota-corolla": 12500000,
  "mazda-cx-5": 19000000,
  "mazda-3": 13000000,
  "ford-ranger": 22000000,
  "chevrolet-sail": 8200000,
  "chevrolet-tracker": 13500000,
  "suzuki-swift": 11500000,
  "suzuki-vitara": 13800000,
  "hyundai-accent": 9800000,
  "hyundai-tucson": 18500000,
  "kia-rio": 9200000,
  "kia-sportage": 17800000,
  "nissan-kicks": 12800000,
  "nissan-qashqai": 15500000,
  "jeep-grand cherokee": 21000000,
};

export function calculateVehicleValuation(input: ValuationInput): ValuationResult {
  const currentYear = 2026;
  const carAge = Math.max(1, currentYear - input.year);
  const expectedMileage = carAge * 15000; // Chilean average is ~15,000 km/year

  // 1. Base Price estimation
  const key = `${input.brand.toLowerCase()}-${input.model.toLowerCase()}`;
  let basePrice = input.customMarketPrice || BASE_MARKET_PRICES[key] || 12000000;

  // Adjust for year difference (depreciation ~7% per year relative to 2021 base)
  const yearDiff = input.year - 2021;
  basePrice = Math.round(basePrice * Math.pow(1.06, yearDiff));

  // 2. Mileage Adjustment
  const mileageDiff = input.mileage - expectedMileage;
  // -1.5% for every 10,000 km above average, +1.5% for every 10,000 km below average
  const mileageAdjustmentRatio = - (mileageDiff / 10000) * 0.015;
  const clampedMileageFactor = Math.max(-0.20, Math.min(0.15, mileageAdjustmentRatio));
  const priceAfterMileage = Math.round(basePrice * (1 + clampedMileageFactor));

  // 3. Condition Adjustment & Reconditioning Cost
  let reconditioningEstimateCLP = 350000; // Standard detailing + basic service
  let conditionDiscount = 0;

  if (input.condition === "EXCELLENT") {
    reconditioningEstimateCLP = 200000; // Light detailing only
    conditionDiscount = 0;
  } else if (input.condition === "GOOD") {
    reconditioningEstimateCLP = 350000;
    conditionDiscount = Math.round(priceAfterMileage * 0.03);
  } else if (input.condition === "FAIR") {
    reconditioningEstimateCLP = 600000; // Tires, brakes, paint touchups
    conditionDiscount = Math.round(priceAfterMileage * 0.07);
  } else if (input.condition === "NEEDS_REPAIR") {
    reconditioningEstimateCLP = 1200000; // Mechanical / bodywork repair
    conditionDiscount = Math.round(priceAfterMileage * 0.14);
  }

  const estimatedMarketPrice = Math.round(priceAfterMileage - conditionDiscount);

  // 4. Calculate Trade-In Offer Tiers
  // Recommended Offer: Targets ~12% gross dealer margin after reconditioning costs
  const dealerTargetMargin = 0.12;
  const rawRecommended = estimatedMarketPrice * (1 - dealerTargetMargin) - reconditioningEstimateCLP;
  const recommendedOffer = Math.round(Math.max(1000000, rawRecommended) / 10000) * 10000;

  // Quick Offer (Fast inventory turn < 15 days, 16% margin)
  const rawQuick = estimatedMarketPrice * 0.84 - reconditioningEstimateCLP;
  const quickOffer = Math.round(Math.max(800000, rawQuick) / 10000) * 10000;

  // Max Offer (Negotiation ceiling, ~8% margin)
  const rawMax = estimatedMarketPrice * 0.92 - reconditioningEstimateCLP;
  const maxOffer = Math.round(Math.max(1200000, rawMax) / 10000) * 10000;

  const expectedGrossProfitCLP = estimatedMarketPrice - recommendedOffer - reconditioningEstimateCLP;
  const dealerMarginPercentage = Math.round((expectedGrossProfitCLP / estimatedMarketPrice) * 100);

  return {
    estimatedMarketPrice,
    mileageAdjustmentFactor: Number((clampedMileageFactor * 100).toFixed(1)),
    conditionAdjustmentCLP: conditionDiscount,
    reconditioningEstimateCLP,
    quickOffer,
    recommendedOffer,
    maxOffer,
    dealerMarginPercentage,
    expectedGrossProfitCLP,
  };
}
