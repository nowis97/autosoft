import React, { useState } from "react";
import { AuditLog, AuditSeverity } from "@/types";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Search, Filter, ArrowUpRight, Eye } from "lucide-react";

interface AuditLogTableProps {
  logs: AuditLog[];
  onInspectLog: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, onInspectLog }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = selectedSeverity === "ALL" || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Bitácora de Auditoría Forense ({filteredLogs.length} eventos)</span>
          </h3>
          <p className="text-xs text-slate-400">Trazabilidad inmutable de cambios de stock, precios y permisos</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por usuario o auto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs border border-slate-200 rounded-lg w-48 sm:w-60 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-700"
          >
            <option value="ALL">Todas las Severidades</option>
            <option value="CRITICAL">🚨 Críticas</option>
            <option value="WARNING">⚠️ Advertencias</option>
            <option value="INFO">ℹ️ Informativas</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Severidad / Evento</th>
              <th className="py-2.5 px-3">Usuario (Rol)</th>
              <th className="py-2.5 px-3">Entidad Afectada</th>
              <th className="py-2.5 px-3">Detalle de la Acción</th>
              <th className="py-2.5 px-3">Fecha & IP</th>
              <th className="py-2.5 px-3 text-right">Forense</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    log.severity === "CRITICAL"
                      ? "bg-red-100 text-red-800"
                      : log.severity === "WARNING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {log.severity}
                  </span>
                  <div className="font-bold text-[11px] text-slate-900 mt-1">{log.actionType}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{log.userName}</div>
                  <div className="text-[10px] text-slate-400">{log.userRole}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800 block truncate max-w-[180px]">
                    {log.entityName || log.entityId}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{log.entityType}</span>
                </td>
                <td className="py-3 px-3 max-w-[280px]">
                  <p className="text-slate-800 line-clamp-2">{log.details}</p>
                </td>
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                  <div>{new Date(log.timestamp).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} hrs</div>
                  <div className="text-[10px] text-slate-400">{log.ipAddress.split(" ")[0]}</div>
                </td>
                <td className="py-3 px-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onInspectLog(log)}
                    className="text-[11px] font-bold h-7 px-2.5 gap-1 text-slate-800"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ver</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
