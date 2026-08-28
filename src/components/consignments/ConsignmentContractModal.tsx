import React from "react";
import { Consignment, Vehicle, Tenant } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { FileText, X, Printer, ShieldCheck } from "lucide-react";

interface ConsignmentContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  consignment: Consignment;
  vehicle: Vehicle;
  tenant: Tenant;
}

export function ConsignmentContractModal({
  isOpen,
  onClose,
  consignment,
  vehicle,
  tenant,
}: ConsignmentContractModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Contrato de Mandato y Consignación Mercantil</div>
              <div className="text-[11px] text-slate-400">Validez legal en República de Chile</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto font-serif leading-relaxed">
          <div className="text-center font-bold text-sm uppercase tracking-wide border-b border-slate-200 pb-2">
            CONTRATO DE MANDATO ESPECIAL Y CORRETAJE AUTOMOTRIZ
          </div>

          <p>
            En <strong>{tenant.city}</strong>, a <strong>{new Date().toLocaleDateString("es-CL")}</strong>, comparecen:
          </p>

          <p>
            Por una parte, como <strong>EL COMITENTE / PROPIETARIO</strong>: don(ña) <strong>{consignment.ownerName}</strong>, Cédula de Identidad N° <strong>{consignment.ownerRut}</strong>, teléfono {consignment.ownerPhone}, correo electrónico {consignment.ownerEmail}.
          </p>

          <p>
            Y por la otra parte, como <strong>EL MANDATARIO / COMISIONISTA</strong>: <strong>{tenant.name}</strong>, RUT <strong>{tenant.rut}</strong>, representada por su administración en {tenant.address}, {tenant.city}.
          </p>

          <div className="font-bold text-slate-900 border-l-2 border-blue-600 pl-2">
            PRIMERO: INDIVIDUALIZACIÓN DEL VEHÍCULO
          </div>
          <p>
            El Comitente encomienda al Mandatario la gestión de venta del vehículo:
            <br />
            • <strong>Marca / Modelo:</strong> {vehicle.brand} {vehicle.model} ({vehicle.version})
            <br />
            • <strong>Año:</strong> {vehicle.year} | <strong>Patente:</strong> {vehicle.licensePlate} | <strong>Kilometraje:</strong> {vehicle.mileage.toLocaleString("es-CL")} km
            <br />
            • <strong>Modalidad:</strong> {consignment.type === "PHYSICAL" ? "Consignación Física (Custodia en Salón)" : "Consignación Virtual (En uso por Propietario)"}
          </p>

          <div className="font-bold text-slate-900 border-l-2 border-blue-600 pl-2">
            SEGUNDO: PRECIO Y COMISIÓN DE CORRETAJE
          </div>
          <p>
            El precio convenido para la publicación es de <strong>{formatCLP(consignment.agreedSalePriceCLP)}</strong>.
            <br />
            Por la gestión de venta, el Mandatario devengará una comisión de:
            <strong> {consignment.commissionType === "PERCENTAGE" ? `${consignment.commissionValue}% sobre el valor final de venta` : formatCLP(consignment.commissionValue)}</strong>.
          </p>

          <div className="font-bold text-slate-900 border-l-2 border-blue-600 pl-2">
            TERCERO: CUENTA BANCARIA DE LIQUIDACIÓN
          </div>
          <p>
            El producto neto de la venta será transferido a:
            <br />
            • <strong>Banco:</strong> {consignment.ownerBank} | <strong>Cuenta:</strong> {consignment.ownerAccountType} N° {consignment.ownerAccountNumber}
            <br />
            • <strong>Titular:</strong> {consignment.ownerName} (RUT: {consignment.ownerRut})
          </p>

          <div className="font-bold text-slate-900 border-l-2 border-blue-600 pl-2">
            CUARTO: PLAZO DE EXCLUSIVIDAD
          </div>
          <p>
            El presente mandato rige por un plazo de <strong>{consignment.contractExclusivityDays} días corridos</strong>.
          </p>

          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-[11px] font-sans">
            <div className="border-t border-slate-400 pt-2">
              <strong>{consignment.ownerName}</strong>
              <div className="text-slate-500">RUT: {consignment.ownerRut}</div>
              <div className="text-[10px] text-slate-400">EL PROPIETARIO</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <strong>{tenant.name}</strong>
              <div className="text-slate-500">RUT: {tenant.rut}</div>
              <div className="text-[10px] text-slate-400">LA AUTOMOTORA</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Documento listo para firma notarial o digital</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
              Cerrar
            </Button>
            <Button size="sm" onClick={() => window.print()} className="text-xs font-bold gap-1.5 bg-blue-600 text-white">
              <Printer className="w-4 h-4" />
              <span>Imprimir Contrato</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
