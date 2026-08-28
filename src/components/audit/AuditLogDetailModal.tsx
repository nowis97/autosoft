import React from "react";
import { AuditLog } from "@/types";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X, User, Globe, Clock, FileCode, Tag } from "lucide-react";

interface AuditLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog;
}

export function AuditLogDetailModal({
  isOpen,
  onClose,
  log,
}: AuditLogDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
              log.severity === "CRITICAL"
                ? "bg-red-600"
                : log.severity === "WARNING"
                ? "bg-amber-600"
                : "bg-blue-600"
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Registro Forense de Auditoría</div>
              <div className="text-[11px] text-slate-400">ID: {log.id} • Cumplimiento RBAC</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                log.severity === "CRITICAL"
                  ? "bg-red-100 text-red-800"
                  : log.severity === "WARNING"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}>
                Severidad: {log.severity}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(log.timestamp).toLocaleString("es-CL")}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm">{log.details}</h4>
            <div className="text-slate-500 text-[11px]">Entidad Afectada: <strong>{log.entityName || log.entityId}</strong></div>
          </div>

          {/* User & Network Context */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600" />
                <span>Ejecutor de la Acción</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{log.userName}</div>
              <div className="text-slate-500 text-[10px]">Rol: {log.userRole}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>Dirección IP & Origen</span>
              </div>
              <div className="font-mono font-bold text-slate-900 text-[11px] truncate">{log.ipAddress}</div>
              <div className="text-slate-400 text-[9px] truncate">{log.userAgent || "Cliente Web Autosoft"}</div>
            </div>
          </div>

          {/* Diff Payload */}
          {(log.previousValue || log.newValue) && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-purple-600" />
                <span>Diff de Modificación (Valor Anterior vs Nuevo)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl font-mono text-[11px]">
                  <div className="text-[9px] font-bold text-red-600 uppercase mb-1">Valor Anterior:</div>
                  <pre className="text-red-950 whitespace-pre-wrap break-all">
                    {JSON.stringify(log.previousValue, null, 2)}
                  </pre>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl font-mono text-[11px]">
                  <div className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Nuevo Valor:</div>
                  <pre className="text-emerald-950 whitespace-pre-wrap break-all">
                    {JSON.stringify(log.newValue, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Firma Criptográfica Inmutable</span>
          </div>
          <Button size="sm" onClick={onClose} className="text-xs font-bold bg-slate-900 text-white">
            Cerrar Inspección
          </Button>
        </div>
      </div>
    </div>
  );
}
