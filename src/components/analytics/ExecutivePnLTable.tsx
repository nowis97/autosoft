import React from "react";
import { ExecutivePnLSummary } from "@/lib/analytics/pnl-calculator";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck, BadgePercent } from "lucide-react";

interface ExecutivePnLTableProps {
  pnl: ExecutivePnLSummary;
}

export function ExecutivePnLTable({ pnl }: ExecutivePnLTableProps) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Consolidado Mensual de Resultados
          </div>
          <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
            <span>Estado de Resultados (P&L Ejecutivo)</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Consolida venta de vehículos, comisiones F&I, corretaje de seguros y costos operativos
          </div>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-600 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] text-emerald-300 font-bold block uppercase">Margen Operativo Real</span>
          <span className="text-2xl font-black text-emerald-400">{pnl.operatingMarginPercentage}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Left: Revenues */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-3">
          <div className="font-extrabold text-slate-200 text-sm flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="flex items-center gap-2 text-blue-400">
              <ArrowUpRight className="w-4 h-4" /> 1. Ingresos Operativos Totales
            </span>
            <span className="text-white font-black">{formatCLP(pnl.totalRevenue)}</span>
          </div>

          <div className="space-y-2 pt-1 font-medium">
            <div className="flex items-center justify-between text-slate-300">
              <span>• Venta Facturada de Vehículos</span>
              <span className="font-bold text-white">{formatCLP(pnl.vehicleRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-300">
                <BadgePercent className="w-3.5 h-3.5" /> Comisiones Financiamiento F&I (Forum/Tanner)
              </span>
              <span className="font-bold text-emerald-400">+{formatCLP(pnl.financingCommissionRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Comisiones Seguros (BCI/HDI/Mapfre)
              </span>
              <span className="font-bold text-emerald-400">+{formatCLP(pnl.insuranceCommissionRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Right: Direct Costs */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-3">
          <div className="font-extrabold text-slate-200 text-sm flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="flex items-center gap-2 text-rose-400">
              <ArrowDownRight className="w-4 h-4" /> 2. Costos Operativos Directos (COGS)
            </span>
            <span className="text-rose-400 font-black">- {formatCLP(pnl.totalDirectCosts)}</span>
          </div>

          <div className="space-y-2 pt-1 font-medium">
            <div className="flex items-center justify-between text-slate-300">
              <span>• Costo de Adquisición de Autos Vendidos</span>
              <span className="font-bold text-slate-200">{formatCLP(pnl.vehicleAcquisitionCost)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>• Gastos de Puesta a Punto / Taller</span>
              <span className="font-bold text-amber-400">{formatCLP(pnl.reconditioningServiceCost)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>• Comisiones a Ejecutivos Comerciales</span>
              <span className="font-bold text-rose-300">{formatCLP(pnl.salesRepCommissionsCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Profit Bar */}
      <div className="bg-blue-950/80 rounded-xl p-5 border border-blue-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-300 font-bold block uppercase tracking-wider">
            Utilidad Neta Real Consolidada (1 - 2)
          </span>
          <span className="text-3xl font-black text-white mt-1 block">
            {formatCLP(pnl.netOperatingProfit)}
          </span>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <span className="text-[11px] text-slate-400 block font-semibold">Margen Bruto Autos</span>
            <span className="text-xl font-black text-emerald-400">{formatCLP(pnl.grossProfit)}</span>
          </div>

          <div className="border-l border-slate-700 pl-6">
            <span className="text-[11px] text-slate-400 block font-semibold">Rentabilidad s/ Venta</span>
            <span className="text-xl font-black text-purple-400">{pnl.operatingMarginPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
