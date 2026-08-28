import React from "react";
import { AutofactReport, Vehicle } from "@/types";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Calendar,
  Users,
  Gauge,
  XCircle,
} from "lucide-react";

interface AutofactReportCardProps {
  vehicle: Vehicle;
  report: AutofactReport;
}

export function AutofactReportCard({ vehicle, report }: AutofactReportCardProps) {
  const isAllClear =
    !report.hasFines &&
    !report.hasEncumbrance &&
    !report.isStolen &&
    report.technicalInspectionValid;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Informe Legal Preventivo (Autofact & Registro Civil)
            </h3>
            <p className="text-[11px] text-slate-400">Verificación de dominio y multas en tiempo real</p>
          </div>
        </div>

        <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />
      </div>

      <div
        className={`p-3.5 rounded-xl border flex items-center gap-3 ${
          isAllClear
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
            : "bg-amber-50/80 border-amber-200 text-amber-900"
        }`}
      >
        {isAllClear ? (
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
        )}
        <div className="text-xs">
          <div className="font-bold text-sm">
            {isAllClear ? "Vehículo 100% Transferible y Libre de Multas" : "Atención Requerida"}
          </div>
          <div className="text-xs opacity-90">
            {isAllClear
              ? "Sin prendas bancarias, sin encargo por robo y sin multas de TAG impagas en autopistas concesionadas."
              : "Revisa las observaciones legales antes de proceder con la firma notarial."}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multas de TAG
          </div>
          <div className="font-bold text-slate-900">
            {report.tagFinesCount === 0 ? "0 Multas ($0)" : `${report.tagFinesCount} Multas`}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-medium">
            {report.hasEncumbrance ? (
              <XCircle className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}{" "}
            Prenda / Embargo
          </div>
          <div className="font-bold text-slate-900">
            {report.hasEncumbrance ? "PRENDA ACTIVA" : "Sin Gravamen"}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Revisión Técnica
          </div>
          <div className="font-bold text-slate-900">
            {report.technicalInspectionValid ? "Al Día (Vigente)" : "Vencida"}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-purple-500" /> N° de Dueños
          </div>
          <div className="font-bold text-slate-900">{report.ownersCount} Dueño(s)</div>
        </div>
      </div>
    </div>
  );
}
