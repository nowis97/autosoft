import React from "react";
import { BrandPerformance } from "@/lib/analytics/pnl-calculator";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Car, Clock, TrendingUp } from "lucide-react";

interface BrandRotationMatrixCardProps {
  performance: BrandPerformance[];
}

export function BrandRotationMatrixCard({ performance }: BrandRotationMatrixCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Matriz de Rotación DSI & Rentabilidad por Marca</span>
        </h3>
        <span className="text-xs text-slate-400 font-semibold">Velocidad de venta y margen promedio</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">Marca</th>
              <th className="py-3 px-3">Stock Disponible</th>
              <th className="py-3 px-3">Unidades Vendidas</th>
              <th className="py-3 px-3">Días Promedio en Stock (DSI)</th>
              <th className="py-3 px-3">Margen Promedio / Auto</th>
              <th className="py-3 px-3 text-right">Margen Bruto Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {performance.map((b) => (
              <tr key={b.brand} className="hover:bg-slate-50">
                <td className="py-3 px-3 font-extrabold text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>{b.brand}</span>
                </td>
                <td className="py-3 px-3 font-bold text-slate-800">{b.unitsInStock} autos</td>
                <td className="py-3 px-3 font-bold text-emerald-600">{b.unitsSold} autos</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.avgDaysInStock <= 30
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    ⏱️ {b.avgDaysInStock} días
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-slate-800">{formatCLP(b.avgGrossProfitPerUnit)}</td>
                <td className="py-3 px-3 text-right font-black text-slate-900">{formatCLP(b.totalGrossProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
