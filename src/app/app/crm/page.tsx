"use client";

import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { store } from "@/lib/store";

export default function CRMPage() {
  const stats = store.getStats();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="CRM & Pipeline de Prospectos"
        subtitle="Monitorea el ciclo comercial de cada cliente desde la consulta hasta la entrega"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">Total Leads Activos</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">{stats.leadsCount}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">Ventas Concretadas</span>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">{stats.leadsWon}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">Tasa de Conversión</span>
            <div className="text-2xl font-bold text-blue-600 tabular-nums">{stats.conversionRate}%</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">Postulaciones a Crédito</span>
            <div className="text-2xl font-bold text-purple-600 tabular-nums">{stats.activeFinancingApps}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Embudo de Ventas</h2>
            <div className="text-xs text-slate-500">
              💡 <em>Haz click en cualquier prospecto para ver detalles, notas y abrir WhatsApp directo.</em>
            </div>
          </div>

          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}
