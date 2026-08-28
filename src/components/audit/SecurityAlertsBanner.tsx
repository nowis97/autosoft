import React from "react";
import { AuditLog } from "@/types";
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityAlertsBannerProps {
  alerts: {
    criticalCount: number;
    warningCount: number;
    criticals: AuditLog[];
    warnings: AuditLog[];
  };
  onInspectAlert: (log: AuditLog) => void;
}

export function SecurityAlertsBanner({
  alerts,
  onInspectAlert,
}: SecurityAlertsBannerProps) {
  if (alerts.criticalCount === 0 && alerts.warningCount === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Sistema Seguro: No se detectan anomalías de seguridad ni descargas no autorizadas de leads.</span>
        </div>
        <span className="text-[11px] text-emerald-700 font-semibold">Auditoría 100% al día</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.criticals.map((log) => (
        <div
          key={log.id}
          className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                  Alerta Crítica
                </span>
                <span className="text-xs font-bold text-red-950">{log.entityName}</span>
                <span className="text-[11px] text-red-600 font-medium">por {log.userName} ({log.userRole})</span>
              </div>
              <p className="text-xs text-red-800 mt-1 font-medium">{log.details}</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => onInspectAlert(log)}
            className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white gap-1.5 shrink-0"
          >
            <span>Inspeccionar Traza</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}

      {alerts.warnings.map((log) => (
        <div
          key={log.id}
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                  Advertencia Operativa
                </span>
                <span className="text-xs font-bold text-amber-950">{log.entityName}</span>
                <span className="text-[11px] text-amber-700 font-medium">por {log.userName}</span>
              </div>
              <p className="text-xs text-amber-800 mt-1 font-medium">{log.details}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onInspectAlert(log)}
            className="text-xs font-bold bg-white text-amber-900 border-amber-300 hover:bg-amber-100 gap-1.5 shrink-0"
          >
            <span>Ver Modificación</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
