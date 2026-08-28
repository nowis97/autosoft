import React, { useState } from "react";
import { SalesRepCommission } from "@/lib/analytics/pnl-calculator";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, DollarSign } from "lucide-react";

interface SalesCommissionsTableProps {
  commissions: SalesRepCommission[];
}

export function SalesCommissionsTable({ commissions }: SalesCommissionsTableProps) {
  const [list, setList] = useState(commissions);

  const handleMarkPaid = (userId: string) => {
    setList(list.map((c) => (c.userId === userId ? { ...c, status: "PAID" } : c)));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Liquidación de Comisiones a Ejecutivos Comerciales</span>
        </h3>
        <span className="text-xs text-slate-400 font-semibold">$100k por auto + $50k por crédito colocado</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">Ejecutivo</th>
              <th className="py-3 px-3">Rol</th>
              <th className="py-3 px-3">Autos Vendidos</th>
              <th className="py-3 px-3">Créditos F&I</th>
              <th className="py-3 px-3">Comisión Fija</th>
              <th className="py-3 px-3">Comisión F&I</th>
              <th className="py-3 px-3">Total Devengado</th>
              <th className="py-3 px-3 text-right">Estado / Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {list.map((rep) => (
              <tr key={rep.userId} className="hover:bg-slate-50">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{rep.name}</div>
                  <div className="text-[10px] text-slate-400">{rep.email}</div>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-600">{rep.role}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{rep.vehiclesSold}</td>
                <td className="py-3 px-3 font-bold text-blue-600">{rep.financingApplicationsCount}</td>
                <td className="py-3 px-3 text-slate-700">{formatCLP(rep.fixedVehicleCommissionsCLP)}</td>
                <td className="py-3 px-3 text-emerald-600">{formatCLP(rep.variableFinancingCommissionsCLP)}</td>
                <td className="py-3 px-3 font-black text-slate-900">{formatCLP(rep.totalCommissionCLP)}</td>
                <td className="py-3 px-3 text-right">
                  {rep.status === "PENDING" ? (
                    <Button
                      size="sm"
                      onClick={() => handleMarkPaid(rep.userId)}
                      className="text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white h-7 px-2.5 gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Emitir Pago</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Liquidado
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
