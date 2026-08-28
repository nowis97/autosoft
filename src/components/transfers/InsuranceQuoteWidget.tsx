import React, { useState } from "react";
import { Vehicle, InsurancePolicy } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Check, Sparkles } from "lucide-react";

interface InsuranceQuoteWidgetProps {
  vehicle: Vehicle;
  onSelectPolicy: (policy: InsurancePolicy) => void;
  selectedPolicy?: InsurancePolicy;
}

export function InsuranceQuoteWidget({
  vehicle,
  onSelectPolicy,
  selectedPolicy,
}: InsuranceQuoteWidgetProps) {
  const [deductible, setDeductible] = useState<3 | 5 | 10>(3);

  const basePrice = vehicle.priceCash;

  const quotes = [
    {
      carrier: "BCI Seguros" as const,
      monthlyRate: Math.round((basePrice * 0.0033) / (deductible === 3 ? 1 : deductible === 5 ? 1.15 : 1.3)),
      dealerCommission: 45000,
      badge: "Más Recomendado",
      coverage: ["Pérdida Total y Parcial", "Responsabilidad Civil 1.000 UF", "Auto de Reemplazo 30 días"],
    },
    {
      carrier: "HDI Seguros" as const,
      monthlyRate: Math.round((basePrice * 0.0031) / (deductible === 3 ? 1 : deductible === 5 ? 1.15 : 1.3)),
      dealerCommission: 45000,
      badge: "Mejor Precio",
      coverage: ["Pérdida Total", "Responsabilidad Civil 500 UF", "Grúa y Asistencia 24/7"],
    },
    {
      carrier: "Mapfre" as const,
      monthlyRate: Math.round((basePrice * 0.0036) / (deductible === 3 ? 1 : deductible === 5 ? 1.15 : 1.3)),
      dealerCommission: 50000,
      badge: "Cobertura Premium",
      coverage: ["Deducible Inteligente", "Responsabilidad Civil 1.500 UF", "Conductor Elegido 4 veces/año"],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Cotizador de Seguro Automotriz en Salón
            </h3>
            <p className="text-[11px] text-slate-400">
              Emisión instantánea con comisión de $45.000+ CLP para la automotora
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Deducible:</span>
          {([3, 5, 10] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDeductible(d)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                deductible === d
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {d} UF
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quotes.map((q) => {
          const isSelected = selectedPolicy?.carrier === q.carrier;

          return (
            <div
              key={q.carrier}
              onClick={() =>
                onSelectPolicy({
                  id: `pol-${Date.now()}-${q.carrier.slice(0, 3)}`,
                  transferId: "temp",
                  carrier: q.carrier,
                  policyNumber: `${q.carrier.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
                  monthlyPremiumCLP: q.monthlyRate,
                  deductibleUF: deductible,
                  dealerCommissionCLP: q.dealerCommission,
                  status: "ACTIVE",
                  createdAt: new Date().toISOString(),
                })
              }
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{q.carrier}</span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {q.badge}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {formatCLP(q.monthlyRate)}
                  </span>
                  <span className="text-xs text-slate-400"> / mes</span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                  {q.coverage.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Comisión Dealer:
                </span>
                <strong className="text-emerald-700">{formatCLP(q.dealerCommission)}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
