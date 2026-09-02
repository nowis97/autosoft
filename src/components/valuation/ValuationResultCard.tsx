import React from "react";
import { ValuationResult } from "@/lib/chilean-utils/valuation";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, ShieldAlert, FileText, CheckCircle2, ArrowRight } from "lucide-react";

interface ValuationResultCardProps {
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  result: ValuationResult;
  onOpenProposal: () => void;
  onConvertToInventory: (offer: number) => void;
}

export function ValuationResultCard({
  licensePlate,
  brand,
  model,
  version,
  year,
  mileage,
  result,
  onOpenProposal,
  onConvertToInventory,
}: ValuationResultCardProps) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Resultado de Tasación Predictiva
          </div>
          <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>{brand} {model} {version} ({year})</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Kilometraje: <strong>{mileage.toLocaleString("es-CL")} km</strong> • Ajuste KM: <strong>{result.mileageAdjustmentFactor > 0 ? "+" : ""}{result.mileageAdjustmentFactor}%</strong>
          </div>
        </div>

        <LicensePlateBadge plate={licensePlate} size="md" />
      </div>

      {/* Market Retail Price */}
      <div className="bg-slate-800/80 rounded-xl p-4 flex items-center justify-between border border-slate-700">
        <div>
          <span className="text-xs text-slate-400 block font-semibold">Valor Estimado de Venta a Público (PVP)</span>
          <span className="text-2xl font-black text-blue-400">{formatCLP(result.estimatedMarketPrice)}</span>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div>Provisión Taller / Detailing: <strong className="text-amber-400">{formatCLP(result.reconditioningEstimateCLP)}</strong></div>
          <div>Margen Dealer Proyectado: <strong className="text-emerald-400">{result.dealerMarginPercentage}% ({formatCLP(result.expectedGrossProfitCLP)})</strong></div>
        </div>
      </div>

      {/* Three Offer Tiers */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Rangos de Oferta de Compra para el Dealer
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Quick Offer */}
          <div className="bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Oferta Rápida</span>
                <span className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">&lt; 15 días</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {formatCLP(result.quickOffer)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Margen alto (16%). Rotación veloz asegurada.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConvertToInventory(result.quickOffer)}
              className="w-full text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 mt-3 rounded-xl"
            >
              Comprar en Rápida
            </Button>
          </div>

          {/* Recommended Offer */}
          <div className="bg-blue-950/60 border-2 border-blue-500 rounded-2xl p-4 space-y-2 flex flex-col justify-between relative shadow-lg">
            <div className="absolute -top-2.5 right-3 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Recomendada
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-blue-300 font-bold">
                <span>Oferta Recomendada</span>
                <span className="bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded text-[10px]">&lt; 30 días</span>
              </div>
              <div className="text-xl font-black text-blue-300 mt-1">
                {formatCLP(result.recommendedOffer)}
              </div>
              <p className="text-[11px] text-blue-200/80 mt-1">
                Equilibrio óptimo entre competitividad y 12% margen.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onConvertToInventory(result.recommendedOffer)}
              className="w-full text-xs font-black bg-blue-600 hover:bg-blue-500 text-white mt-3 rounded-xl shadow-sm"
            >
              Aceptar Retoma ({formatCLP(result.recommendedOffer)})
            </Button>
          </div>

          {/* Max Offer */}
          <div className="bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Oferta Techo Máximo</span>
                <span className="bg-amber-900/40 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">Cierre Difícil</span>
              </div>
              <div className="text-lg font-black text-amber-300 mt-1">
                {formatCLP(result.maxOffer)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Límite comercial sin caer en pérdidas operativas.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConvertToInventory(result.maxOffer)}
              className="w-full text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 mt-3 rounded-xl"
            >
              Comprar en Techo
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          💡 La retoma se ingresa automáticamente a tu <strong>Inventario DMS</strong> con su costo de compra asignado.
        </div>

        <Button
          onClick={onOpenProposal}
          variant="outline"
          size="sm"
          className="text-xs font-bold text-slate-800 gap-1.5 shrink-0"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Generar Propuesta para el Cliente</span>
        </Button>
      </div>
    </div>
  );
}
