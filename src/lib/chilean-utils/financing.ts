export interface LoanSimulationParams {
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  monthlyInterestRate?: number;
}

export interface LoanSimulationResult {
  vehiclePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  termMonths: number;
  monthlyPayment: number;
  totalCost: number;
  minDownPayment: number;
  isValidDownPayment: boolean;
}

export function formatCLP(amount: number = 0): string {
  return "$" + Math.round(amount).toLocaleString("es-CL");
}

export function calculateLoanQuote({
  vehiclePrice,
  downPayment,
  termMonths,
  monthlyInterestRate = 0.0145
}: LoanSimulationParams): LoanSimulationResult {
  const minDownPayment = Math.round(vehiclePrice * 0.2);
  const validDownPayment = Math.max(0, Math.min(downPayment, vehiclePrice));
  const loanAmount = Math.max(0, vehiclePrice - validDownPayment);

  let monthlyPayment = 0;
  if (loanAmount > 0 && termMonths > 0) {
    const r = monthlyInterestRate;
    const n = termMonths;
    const factor = Math.pow(1 + r, n);
    monthlyPayment = Math.round(loanAmount * ((r * factor) / (factor - 1)));
  }

  const totalCost = validDownPayment + (monthlyPayment * termMonths);
  const downPaymentPercent = vehiclePrice > 0 ? Math.round((validDownPayment / vehiclePrice) * 100) : 0;

  return {
    vehiclePrice,
    downPayment: validDownPayment,
    downPaymentPercent,
    loanAmount,
    termMonths,
    monthlyPayment,
    totalCost,
    minDownPayment,
    isValidDownPayment: validDownPayment >= minDownPayment
  };
}
