import React from "react";
import { VehicleInspection, Vehicle, Tenant } from "@/types";
import { DamageMapSelector } from "./DamageMapSelector";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, X, Printer, Wrench, ShieldCheck, QrCode } from "lucide-react";

interface InspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: VehicleInspection;
  vehicle: Vehicle;
  tenant: Tenant;
  onSendToWorkshop: (inspectionId: string) => void;
}

export function InspectionReportModal({
  isOpen,
  onClose,
  inspection,
  vehicle,
  tenant,
  onSendToWorkshop,
}: InspectionReportModalProps) {
  if (!isOpen) return null;

  const failedItems = inspection.items.filter((i) => i.status === "FAIL");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Certificado de Inspección Técnica & Check-in</div>
              <div className="text-[11px] text-slate-400">ID: {inspection.id} • {tenant.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
          {/* Header Vehicle & Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Vehículo Certificado</div>
              <h3 className="text-lg font-black text-white">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </h3>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                Patente: <strong>{vehicle.licensePlate}</strong> • {inspection.receptionMileage.toLocaleString("es-CL")} km • Estanque: {inspection.fuelLevel}
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
              <div className="text-3xl font-black text-white">{inspection.score} / 100</div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-block mt-1 ${
                inspection.rating === "EXCELENTE"
                  ? "bg-emerald-500 text-white"
                  : inspection.rating === "BUENO"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-red-500 text-white"
              }`}>
                {inspection.rating}
              </span>
            </div>
          </div>

          {/* Damage Map */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2">Mapeo de Daños de Entrada</h4>
            <DamageMapSelector damagePoints={inspection.damagePoints} onChangeDamagePoints={() => {}} readOnly={true} />
          </div>

          {/* Failed Items Table if Any */}
          {failedItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
              <div className="font-bold text-red-950 flex items-center justify-between">
                <span>Fallas Críticas Detectadas ({failedItems.length})</span>
                <span className="text-[11px] text-red-700">Puesta a punto requerida</span>
              </div>
              <ul className="space-y-1 text-red-900">
                {failedItems.map((f) => (
                  <li key={f.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <strong>{f.name}</strong> {f.notes ? `- ${f.notes}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inspector & Signatures */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Inspector Responsable</div>
              <div className="font-bold text-slate-900">{inspection.inspectorName}</div>
              <div className="text-slate-500 text-[10px]">RUT: {inspection.inspectorRut}</div>
              <div className="text-emerald-600 font-bold text-[10px] pt-1">✓ Firma Digital Validada</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Acta de Recepción</div>
              <div className="font-bold text-slate-900">Conformidad de Cliente</div>
              <div className="text-slate-500 text-[10px]">{new Date(inspection.createdAt).toLocaleDateString("es-CL")}</div>
              <div className="text-emerald-600 font-bold text-[10px] pt-1">✓ Aceptado en Salón</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
            Cerrar
          </Button>

          <div className="flex gap-2">
            {failedItems.length > 0 && (
              <Button
                size="sm"
                onClick={() => {
                  onSendToWorkshop(inspection.id);
                  onClose();
                }}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Enviar Fallas a Taller</span>
              </Button>
            )}
            <Button size="sm" onClick={() => window.print()} className="text-xs font-bold bg-blue-600 text-white gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Certificado</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
