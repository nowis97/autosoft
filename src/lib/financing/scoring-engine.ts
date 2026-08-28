export type RCIStatus = "OPTIMAL" | "ACCEPTABLE" | "OVERBURDENED";
export type CreditRiskTier = "LOW" | "MEDIUM" | "HIGH";
export type PartnerApprovalStatus = "APPROVED" | "CONDITIONED" | "REJECTED";

export interface RCIResult {
  monthlyPayment: number;
  monthlyIncome: number;
  rciPercent: number;
  status: RCIStatus;
  description: string;
}

export interface CAEResult {
  loanAmount: number;
  monthlyPayment: number;
  termMonths: number;
  totalCreditCostCLP: number;
  caePercent: number;
}

export interface CreditRiskEvaluation {
  score: number;
  riskTier: CreditRiskTier;
  summary: string;
  recommendation: string;
}

export interface PartnerEvaluation {
  partnerId: "FORUM" | "SANTANDER" | "TANNER" | "AUTOFIN";
  partnerName: string;
  status: PartnerApprovalStatus;
  monthlyRatePercent: number;
  monthlyPaymentCLP: number;
  caePercent: number;
  totalCreditCostCLP: number;
  dealerCommissionCLP: number;
  commissionRate: string;
  conditions: string[];
}

export function calculateRCI(monthlyPayment: number, monthlyIncome: number): RCIResult {
  if (monthlyIncome <= 0) {
    return {
      monthlyPayment,
      monthlyIncome,
      rciPercent: 100,
      status: "OVERBURDENED",
      description: "Renta líquida debe ser mayor a 0",
    };
  }

  const rciPercent = Math.round((monthlyPayment / monthlyIncome) * 100);

  let status: RCIStatus = "OPTIMAL";
  let description = "Excelente capacidad de pago (Carga financiera menor o igual al 25%).";

  if (rciPercent > 40) {
    status = "OVERBURDENED";
    description = "Sobreendeudamiento: La cuota supera el 40% de los ingresos líquidos del postulante.";
  } else if (rciPercent > 25) {
    status = "ACCEPTABLE";
    description = "Carga financiera aceptable según políticas CMF (Entre 26% y 40% del ingreso).";
  }

  return {
    monthlyPayment,
    monthlyIncome,
    rciPercent,
    status,
    description,
  };
}

export function calculateCAE({
  loanAmount,
  monthlyPayment,
  termMonths,
  expensesCLP = 120000,
}: {
  loanAmount: number;
  monthlyPayment: number;
  termMonths: number;
  expensesCLP?: number;
}): CAEResult {
  const totalPayments = monthlyPayment * termMonths;
  const totalCreditCostCLP = totalPayments + expensesCLP;

  // Approximate internal rate of return (IRR) / Annual Effective Cost (CAE)
  const totalCharges = totalCreditCostCLP - loanAmount;
  const approxMonthlyRate = totalCharges / (loanAmount * termMonths * 0.58);
  const caeAnnual = (Math.pow(1 + Math.max(0.005, approxMonthlyRate), 12) - 1) * 100;
  const caePercent = parseFloat(caeAnnual.toFixed(1));

  return {
    loanAmount,
    monthlyPayment,
    termMonths,
    totalCreditCostCLP,
    caePercent: Math.max(12.5, Math.min(caePercent, 38.0)),
  };
}

export function evaluateCreditRiskScore({
  monthlyIncome,
  downPayment,
  vehiclePrice,
  employmentStatus,
  hasDicomDebt = false,
}: {
  monthlyIncome: number;
  downPayment: number;
  vehiclePrice: number;
  employmentStatus: "DEPENDENT" | "INDEPENDENT";
  hasDicomDebt?: boolean;
}): CreditRiskEvaluation {
  let score = 650;

  // Income factor
  if (monthlyIncome >= 2500000) score += 120;
  else if (monthlyIncome >= 1500000) score += 80;
  else if (monthlyIncome >= 900000) score += 40;
  else score -= 40;

  // Down payment ratio factor
  const downRatio = vehiclePrice > 0 ? downPayment / vehiclePrice : 0;
  if (downRatio >= 0.35) score += 100;
  else if (downRatio >= 0.20) score += 50;
  else score -= 30;

  // Employment
  if (employmentStatus === "DEPENDENT") score += 50;
  else score += 15;

  // Dicom
  if (hasDicomDebt) score -= 220;
  else score += 40;

  score = Math.max(300, Math.min(950, score));

  let riskTier: CreditRiskTier = "LOW";
  let summary = "Perfil crediticio óptimo con alta probabilidad de pre-aprobación en todas las entidades.";
  let recommendation = "Ofrecer tasa preferencial Santander Consumer o Forum.";

  if (score < 620) {
    riskTier = "HIGH";
    summary = "Riesgo alto debido a carga financiera o antecedentes comerciales desfavorables.";
    recommendation = "Requerir aumento de pie al 35% o presentar aval dependiente con renta demostrable.";
  } else if (score < 750) {
    riskTier = "MEDIUM";
    summary = "Perfil estándar apto para crédito automotriz tradicional.";
    recommendation = "Derivar a Tanner o Autofin para respuesta rápida.";
  }

  return {
    score,
    riskTier,
    summary,
    recommendation,
  };
}

export function evaluateMultiPartnerFinancing({
  applicantName,
  applicantRut,
  monthlyIncome,
  employmentStatus,
  vehiclePrice,
  downPayment,
  termMonths,
}: {
  applicantName: string;
  applicantRut: string;
  monthlyIncome: number;
  employmentStatus: "DEPENDENT" | "INDEPENDENT";
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
}): PartnerEvaluation[] {
  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  const downRatio = vehiclePrice > 0 ? downPayment / vehiclePrice : 0;

  const partnerConfigs = [
    {
      partnerId: "SANTANDER" as const,
      partnerName: "Santander Consumer",
      rate: 0.0135,
      commissionRate: "1.8%",
      dealerFeeFactor: 0.018,
      minDown: 0.20,
    },
    {
      partnerId: "FORUM" as const,
      partnerName: "Forum Servicios Financieros",
      rate: 0.0139,
      commissionRate: "2.0%",
      dealerFeeFactor: 0.020,
      minDown: 0.20,
    },
    {
      partnerId: "TANNER" as const,
      partnerName: "Tanner Servicios Financieros",
      rate: 0.0152,
      commissionRate: "2.2%",
      dealerFeeFactor: 0.022,
      minDown: 0.15,
    },
    {
      partnerId: "AUTOFIN" as const,
      partnerName: "Autofin",
      rate: 0.0158,
      commissionRate: "2.5%",
      dealerFeeFactor: 0.025,
      minDown: 0.20,
    },
  ];

  return partnerConfigs.map((cfg) => {
    const r = cfg.rate;
    const n = termMonths;
    const factor = Math.pow(1 + r, n);
    const monthlyPayment = loanAmount > 0 ? Math.round(loanAmount * ((r * factor) / (factor - 1))) : 0;
    const rci = calculateRCI(monthlyPayment, monthlyIncome);
    const cae = calculateCAE({ loanAmount, monthlyPayment, termMonths });
    const dealerCommissionCLP = Math.round(loanAmount * cfg.dealerFeeFactor);

    let status: PartnerApprovalStatus = "APPROVED";
    const conditions: string[] = [];

    if (downRatio < cfg.minDown) {
      status = "CONDITIONED";
      conditions.push(`Requiere pie mínimo de ${(cfg.minDown * 100)}%`);
    }

    if (rci.rciPercent > 40) {
      status = "REJECTED";
      conditions.push("RCI superior al 40% (Sobreendeudamiento)");
    } else if (rci.rciPercent > 32) {
      if (status === "APPROVED") status = "CONDITIONED";
      conditions.push("Aprobación condicionada a acreditar antigüedad laboral > 12 meses");
    }

    if (employmentStatus === "INDEPENDENT" && cfg.partnerId === "SANTANDER") {
      if (status === "APPROVED") status = "CONDITIONED";
      conditions.push("Requiere últimas 6 declaraciones de IVA (Formulario 29)");
    }

    return {
      partnerId: cfg.partnerId,
      partnerName: cfg.partnerName,
      status,
      monthlyRatePercent: parseFloat((cfg.rate * 100).toFixed(2)),
      monthlyPaymentCLP: monthlyPayment,
      caePercent: cae.caePercent,
      totalCreditCostCLP: cae.totalCreditCostCLP,
      dealerCommissionCLP,
      commissionRate: cfg.commissionRate,
      conditions: conditions.length > 0 ? conditions : ["Aprobación estándar inmediata con liquidaciones de sueldo."],
    };
  });
}
