import React from "react";
import { Vehicle, ServiceOrder } from "@/types";
import { calculateVehicleFinancials } from "@/lib/chilean-utils/service-costs";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

interface VehicleCostLedgerCardProps {
  vehicle: Vehicle;
  orders: ServiceOrder[];
  onOpenNewOrderModal: () => void;
  onReadyForSale: () => void;
}

export function VehicleCostLedgerCard({
  vehicle,
  orders,
  onOpenNewOrderModal,
  onReadyForSale,
}: VehicleCostLedgerCardProps) {
  const fin = calculateVehicleFinancials(vehicle, orders);
  const pendingOrders = orders.filter((o) => o.vehicleId === vehicle.id && o.status !== "COMPLETED");

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Libro de Costos & Margen Real
          </div>
          <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>{vehicle.brand} {vehicle.model} ({vehicle.year})</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Estado Actual: <strong className="text-blue-400">{vehicle.status === "IN_MAINTENANCE" ? "En Preparación / Taller" : "Disponible en Salón"}</strong>
          </div>
        </div>

        <LicensePlateBadge plate={vehicle.licensePlate} size="md" />
      </div>

      {/* Cost Ledger Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">1. Costo Compra (Adquisición)</span>
          <span className="text-lg font-black text-white mt-1 block">{formatCLP(fin.acquisitionCost)}</span>
        </div>

        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
          <span className="text-slate-400 block">2. Gastos de Taller / Detailing</span>
          <span className="text-lg font-black text-amber-400 mt-1 block">+ {formatCLP(fin.totalServiceCosts)}</span>
        </div>

        <div className="bg-blue-950/80 p-3.5 rounded-xl border border-blue-600">
          <span className="text-blue-300 block font-bold">Costo Total Invertido (1 + 2)</span>
          <span className="text-lg font-black text-blue-300 mt-1 block">{formatCLP(fin.totalInvestedCost)}</span>
        </div>
      </div>

      {/* Margins and ROI */}
      <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Precio de Venta Contado (PVP)</span>
          <span className="text-2xl font-black text-white">{formatCLP(fin.salePrice)}</span>
        </div>

        <div className="flex gap-4 text-right">
          <div>
            <span className="text-[11px] text-slate-400 block">Margen Bruto Real</span>
            <span className="text-xl font-black text-emerald-400">{formatCLP(fin.expectedGrossProfit)}</span>
            <span className="text-[10px] text-emerald-300 font-semibold block">({fin.grossMarginPercentage}% del PVP)</span>
          </div>

          <div className="border-l border-slate-700 pl-4">
            <span className="text-[11px] text-slate-400 block">Retorno s/ Inversión (ROI)</span>
            <span className="text-xl font-black text-purple-400">{fin.returnOnInvestmentPercentage}%</span>
            <span className="text-[10px] text-purple-300 font-semibold block">Rentabilidad pura</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          {pendingOrders.length > 0 ? (
            <span className="text-amber-400 font-semibold">⚠️ {pendingOrders.length} orden(es) de trabajo en progreso para este auto.</span>
          ) : (
            <span className="text-emerald-400 font-semibold">✅ 100% de trabajos completados. Auto listo para exhibir.</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenNewOrderModal}
            className="text-xs font-bold text-slate-800"
          >
            + Agregar Gasto de Taller
          </Button>

          {vehicle.status === "IN_MAINTENANCE" && (
            <Button
              size="sm"
              onClick={onReadyForSale}
              className="text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprobar para Salón (Disponible)</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
