/**
 * Autosoft 360 - Multi-Carrier Auto Insurance Quote & Commission Engine
 * Integrated with major Chilean insurers: BCI Seguros, HDI Seguros, Mapfre, Reale.
 */

export interface InsuranceQuoteRequest {
  vehicleValueCLP: number;
  vehicleYear: number;
  vehicleBrand: string;
  vehicleModel: string;
  driverAge: number;
  driverHasAccidents?: boolean;
}

export interface InsurancePlanOption {
  deductibleUF: 3 | 5 | 10;
  monthlyPremiumCLP: number;
  annualPremiumCLP: number;
  coverageFeatures: string[];
}

export interface CarrierInsuranceQuote {
  carrierId: "bci" | "hdi" | "mapfre" | "reale";
  carrierName: string;
  logoUrl: string;
  recommended: boolean;
  plans: InsurancePlanOption[];
  dealerCommissionCLP: number;
}

const UF_VALUE_CLP = 38500; // Reference UF rate

/**
 * Calculates insurance quotes across 4 Chilean carriers based on risk profile
 */
export function calculateInsuranceQuotes(request: InsuranceQuoteRequest): CarrierInsuranceQuote[] {
  const { vehicleValueCLP, driverAge, driverHasAccidents = false } = request;

  // Base rate: ~2.8% to 3.5% of vehicle value per year
  let riskFactor = 1.0;
  if (driverAge < 25) riskFactor += 0.35;
  if (driverAge > 70) riskFactor += 0.15;
  if (driverHasAccidents) riskFactor += 0.40;

  const baseAnnualRate = 0.032 * riskFactor;
  const baseAnnualCost = vehicleValueCLP * baseAnnualRate;

  const carriers: Array<{
    carrierId: "bci" | "hdi" | "mapfre" | "reale";
    carrierName: string;
    factor: number;
    recommended: boolean;
    features: string[];
  }> = [
    {
      carrierId: "bci",
      carrierName: "BCI Seguros",
      factor: 1.0,
      recommended: true,
      features: ["Auto de reemplazo hasta 30 días", "Taller de marca garantizado", "Responsabilidad Civil 1.000 UF"],
    },
    {
      carrierId: "hdi",
      carrierName: "HDI Seguros",
      factor: 0.96,
      recommended: false,
      features: ["Asistencia en ruta 24/7", "Grúa ilimitada", "Responsabilidad Civil 1.000 UF"],
    },
    {
      carrierId: "mapfre",
      carrierName: "Mapfre Chile",
      factor: 1.04,
      recommended: false,
      features: ["Cobertura Mercosur", "Revisión técnica a domicilio", "Responsabilidad Civil 1.500 UF"],
    },
    {
      carrierId: "reale",
      carrierName: "Reale Chile Seguros",
      factor: 0.92,
      recommended: false,
      features: ["Precios preferenciales usados", "Asistencia legal completa", "Responsabilidad Civil 1.000 UF"],
    },
  ];

  return carriers.map((carrier) => {
    const carrierAnnual = baseAnnualCost * carrier.factor;

    // Deductibles: 3 UF (higher premium), 5 UF (standard), 10 UF (lower premium)
    const plans: InsurancePlanOption[] = [
      {
        deductibleUF: 3,
        annualPremiumCLP: Math.round(carrierAnnual * 1.15),
        monthlyPremiumCLP: Math.round((carrierAnnual * 1.15) / 12),
        coverageFeatures: [...carrier.features, "Deducible bajo (3 UF)"],
      },
      {
        deductibleUF: 5,
        annualPremiumCLP: Math.round(carrierAnnual),
        monthlyPremiumCLP: Math.round(carrierAnnual / 12),
        coverageFeatures: [...carrier.features, "Deducible estándar (5 UF)"],
      },
      {
        deductibleUF: 10,
        annualPremiumCLP: Math.round(carrierAnnual * 0.82),
        monthlyPremiumCLP: Math.round((carrierAnnual * 0.82) / 12),
        coverageFeatures: [...carrier.features, "Deducible económico (10 UF)"],
      },
    ];

    // Standard dealer commission: 12% of annual premium (on 5 UF plan)
    const dealerCommissionCLP = calculateDealerInsuranceCommission(plans[1].annualPremiumCLP, 12);

    return {
      carrierId: carrier.carrierId,
      carrierName: carrier.carrierName,
      logoUrl: `/carriers/${carrier.carrierId}.png`,
      recommended: carrier.recommended,
      plans,
      dealerCommissionCLP,
    };
  });
}

/**
 * Calculates dealer commission based on gross annual premium and commission rate percentage
 */
export function calculateDealerInsuranceCommission(
  annualPremiumCLP: number,
  commissionPercent: number = 12
): number {
  return Math.round(annualPremiumCLP * (commissionPercent / 100));
}
