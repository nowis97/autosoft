import React from "react";
import { formatCLP, calculateLoanQuote } from "@/lib/chilean-utils";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  priceCash: number;
  priceFinanced?: number;
  showMonthlyQuote?: boolean;
  className?: string;
}

export function PriceTag({
  priceCash,
  priceFinanced,
  showMonthlyQuote = true,
  className,
}: PriceTagProps) {
  const quote = calculateLoanQuote({
    vehiclePrice: priceFinanced || priceCash,
    downPayment: Math.round((priceFinanced || priceCash) * 0.2),
    termMonths: 48,
  });

  return (
    <div className={cn("flex flex-col space-y-0.5", className)}>
      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {formatCLP(priceCash)}
        </span>
        {priceFinanced && priceFinanced < priceCash && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Bono F&I: {formatCLP(priceCash - priceFinanced)}
          </span>
        )}
      </div>

      {showMonthlyQuote && quote.monthlyPayment > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>Desde</span>
          <span className="font-bold text-blue-700 tabular-nums">
            {formatCLP(quote.monthlyPayment)} / mes
          </span>
          <span className="text-[10px] text-slate-400">(Pie 20% · 48 cuotas)</span>
        </div>
      )}
    </div>
  );
}
