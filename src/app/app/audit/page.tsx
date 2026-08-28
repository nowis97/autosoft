"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { SecurityAlertsBanner } from "@/components/audit/SecurityAlertsBanner";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { AuditLogDetailModal } from "@/components/audit/AuditLogDetailModal";
import { AuditLog } from "@/types";
import { ShieldCheck, ShieldAlert, UserCheck, Lock } from "lucide-react";

export default function AuditPage() {
  const logs = store.getAuditLogs();
  const alerts = store.getSecurityAlerts();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Auditoría, Logs de Seguridad & Compliance RBAC"
        subtitle="Registro inmutable de cambios de precios, descarga de bases de clientes y trazabilidad forense"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Eventos Registrados</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{logs.length}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">100% inmutable</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Alertas Críticas</div>
            <div className="text-2xl font-black text-red-600 mt-1">{alerts.criticalCount}</div>
            <div className="text-xs text-slate-400 mt-1">Fuga o descargas masivas</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Advertencias de Precios</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{alerts.warningCount}</div>
            <div className="text-xs text-slate-400 mt-1">Modificaciones en stock</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Aislamiento Multi-Tenant</div>
            <div className="text-2xl font-black text-blue-600 mt-1">RBAC Estricto</div>
            <div className="text-xs text-blue-500 font-semibold mt-1">Firma digital activa</div>
          </div>
        </div>

        {/* Security Alerts Banner */}
        <SecurityAlertsBanner
          alerts={alerts}
          onInspectAlert={(log) => setSelectedLog(log)}
        />

        {/* Audit Log Table */}
        <AuditLogTable
          logs={logs}
          onInspectLog={(log) => setSelectedLog(log)}
        />

        {selectedLog && (
          <AuditLogDetailModal
            isOpen={true}
            onClose={() => setSelectedLog(null)}
            log={selectedLog}
          />
        )}
      </main>
    </div>
  );
}
