import React, { useState } from "react";
import { Vehicle, TransferOrder } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, ShieldCheck, Printer, X } from "lucide-react";

interface NotarialContractModalProps {
  vehicle: Vehicle;
  transfer: Partial<TransferOrder>;
  onClose: () => void;
  onConfirmSignature: () => void;
}

export function NotarialContractModal({
  vehicle,
  transfer,
  onClose,
  onConfirmSignature,
}: NotarialContractModalProps) {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    setTimeout(() => {
      onConfirmSignature();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Contrato Notarial de Compraventa Vehicular</h3>
              <p className="text-[11px] text-slate-400">
                Redacción oficial conforme al Art. 1793 Código Civil y Ley N° 18.290 de Tránsito
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-serif bg-slate-50/50">
          <div className="text-center font-sans border-b border-slate-200 pb-3 space-y-1">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
              CONTRATO DE COMPRAVENTA DE VEHÍCULO MOTORIZADO
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              FOLIO NOTARIAL DIGITAL: NOT-{transfer.id || "2026-9901"}
            </p>
          </div>

          <p>
            En <strong>Santiago de Chile</strong>, a {new Date().toLocaleDateString("es-CL")}, comparecen:
          </p>

          <p>
            <strong>PRIMERO (VENDEDOR):</strong> Automotora Oriente SpA, RUT 76.452.189-K, representada legalmente por don Rodrigo Valenzuela, ambos domiciliados en Av. Las Condes 12345, comuna de Las Condes.
          </p>

          <p>
            <strong>SEGUNDO (COMPRADOR):</strong> Don(ña) <strong>{transfer.buyerName || "Nombre del Comprador"}</strong>, Cédula Nacional de Identidad N° <strong>{transfer.buyerRut || "12.345.678-5"}</strong>, domiciliado(a) en {transfer.buyerAddress || "Dirección"}, comuna de {transfer.buyerCity || "Santiago"}.
          </p>

          <p>
            <strong>TERCERO (INDIVIDUALIZACIÓN DEL VEHÍCULO):</strong> Por el presente acto, el Vendedor vende, cede y transfiere al Comprador el siguiente vehículo motorizado usado:
          </p>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1 text-slate-800">
            <div>• <strong>PATENTE ÚNICA:</strong> {vehicle.licensePlate}</div>
            <div>• <strong>MARCA / MODELO:</strong> {vehicle.brand.toUpperCase()} {vehicle.model.toUpperCase()}</div>
            <div>• <strong>AÑO DE FABRICACIÓN:</strong> {vehicle.year}</div>
            <div>• <strong>TIPO CARROCERÍA:</strong> {vehicle.bodyType}</div>
            <div>• <strong>COLOR:</strong> {vehicle.color}</div>
            <div>• <strong>KILOMETRAJE:</strong> {vehicle.mileage.toLocaleString("es-CL")} KM</div>
          </div>

          <p>
            <strong>CUARTO (PRECIO Y LIQUIDACIÓN TRIBUTARIA):</strong> El precio de la compraventa es la suma de <strong>{formatCLP(transfer.salePrice || vehicle.priceCash)}</strong>, la cual se paga al contado. En cumplimiento del D.L. 3.475 sobre Impuesto de Timbres y Estampillas, se liquida el <strong>1.5% de Impuesto a la Transferencia</strong> por un monto de <strong>{formatCLP(transfer.transferTax15 || 0)}</strong>, más aranceles de notaría e inscripción en el Registro de Vehículos Motorizados.
          </p>

          <p>
            <strong>QUINTO (ESTADO DEL VEHÍCULO):</strong> El Comprador declara recibir el vehículo a su entera satisfacción, en el estado mecánico y de conservación en que se encuentra y que conoce.
          </p>
        </div>

        <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Firma Electrónica Avanzada válida ante el Servicio de Registro Civil e Identificación.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSign}
              disabled={signed}
              className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{signed ? "Firmando..." : "Firmar Contrato Digitalmente"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
