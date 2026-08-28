"use client";

import React, { useState } from "react";
import {
  FileText,
  X,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Smartphone,
  ExternalLink,
  Scale,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransferOrder, Vehicle, Tenant, DigitalNotaryContract } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import {
  generateTransferMandateContract,
  createDigitalNotarySignatureRequest,
} from "@/lib/notary/notary-engine";

interface DigitalNotaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: TransferOrder;
  vehicle: Vehicle;
  tenant: Tenant;
}

export function DigitalNotaryModal({
  isOpen,
  onClose,
  transfer,
  vehicle,
  tenant,
}: DigitalNotaryModalProps) {
  const [contract, setContract] = useState<DigitalNotaryContract>(() =>
    generateTransferMandateContract({
      transferId: transfer.id,
      tenantId: tenant.id,
      contractType: "MANDATO_ESPECIAL_TRANSFERENCIA",
      grantorName: transfer.buyerName,
      grantorRut: transfer.buyerRut,
      grantorEmail: transfer.buyerEmail,
      grantorPhone: transfer.buyerPhone,
      grantorAddress: transfer.buyerAddress,
      grantorCity: transfer.buyerCity,
      grantorDocumentNumber: "123.456.789",
      representativeName: tenant.name,
      representativeRut: tenant.rut,
      vehicleDescription: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
      licensePlate: vehicle.licensePlate,
      salePriceCLP: transfer.salePrice,
    })
  );

  const [isSignedSimulated, setIsSignedSimulated] = useState(false);
  const signatureRequest = createDigitalNotarySignatureRequest(contract);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateSign = () => {
    setIsSignedSimulated(true);
    setContract((prev) => ({
      ...prev,
      status: "NOTARIZED",
      signedAt: new Date().toISOString(),
      notarizedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                  Notaría Online • Ley 19.799
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  {contract.status}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                Mandato Especial de Transferencia Vehicular
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 space-y-6 text-slate-800 text-xs bg-slate-50/50">
          {/* Certificate Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600" />
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              REPÚBLICA DE CHILE • SERVICIO DE PROTOCOLIZACIÓN DIGITAL
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              MANDATO ESPECIAL AMPLIO PARA TRANSFERENCIA DE DOMINIO
            </h1>
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
              Conforme a los Arts. 2116 y ss. del Código Civil chileno y Ley N° 19.799 sobre Documentos y Firmas Electrónicas con validez ante el Servicio de Registro Civil e Identificación.
            </p>

            <div className="pt-3 flex items-center justify-center gap-4 text-[11px] font-mono font-bold text-slate-600">
              <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                CUV: <strong className="text-blue-600">{contract.cuvCode}</strong>
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                Notaría: {contract.notaryOfficeName}
              </span>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 leading-relaxed text-slate-700">
            <div>
              <strong className="text-slate-900">PRIMERO (Las Partes):</strong> Comparece don/doña{" "}
              <strong className="text-slate-900">{contract.grantorName}</strong>, Cédula Nacional de Identidad N°{" "}
              <strong className="text-slate-900">{contract.grantorRut}</strong>, domiciliado en{" "}
              {contract.grantorAddress}, comuna de {contract.grantorCity}, en adelante el &quot;MANDANTE&quot;; y por la otra parte,{" "}
              <strong className="text-slate-900">{contract.representativeName}</strong>, RUT N°{" "}
              <strong className="text-slate-900">{contract.representativeRut}</strong>, en adelante el &quot;MANDATARIO&quot;.
            </div>

            <div>
              <strong className="text-slate-900">SEGUNDO (Objeto del Mandato):</strong> El Mandante confiere mandato especial amplio al Mandatario para que en su nombre y representación realice todas las gestiones necesarias para inscribir y transferir el vehículo motorizado placa patente única{" "}
              <strong className="text-blue-700 font-mono font-black">{contract.licensePlate}</strong>, correspondiente a un{" "}
              <strong className="text-slate-900">{contract.vehicleDescription}</strong>, por el precio acordado de{" "}
              <strong className="text-slate-900">{formatCLP(contract.salePriceCLP)} CLP</strong>.
            </div>

            <div>
              <strong className="text-slate-900">TERCERO (Facultades Notariales y Registro Civil):</strong> El Mandatario queda expresamente facultado para suscribir solicitudes de transferencia ante el Servicio de Registro Civil e Identificación, pagar los impuestos a la transferencia (1.5% Ley de Timbres y Estampillas D.L. 3475), derechos arancelarios y retirar el correspondiente Padrón (Certificado de Inscripción y Anotaciones Vigentes).
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono">Hash SHA-256: {contract.verificationHashSHA256.substring(0, 32)}...</span>
              <span>Firmado Electrónicamente vía Ley 19.799</span>
            </div>
          </div>

          {/* Electronic Signatures Box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-400">Firma del Mandante</div>
              {isSignedSimulated ? (
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">{contract.grantorName}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Firmado con ClaveÚnica</div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {new Date().toLocaleString("es-CL")}
                  </div>
                </div>
              ) : (
                <div className="py-2 space-y-2">
                  <div className="text-[11px] text-amber-600 font-bold">Pendiente de Firma Digital</div>
                  <Button
                    size="sm"
                    onClick={handleSimulateSign}
                    className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Firmar con ClaveÚnica
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-400">Certificación Notarial</div>
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900">{contract.notaryOfficeName}</div>
                <div className="text-[10px] text-blue-600 font-bold">Ministro de Fe Digital</div>
                <div className="text-[9px] text-slate-400 font-mono">Firma Avanzada FEA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <a
              href={signatureRequest.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Enviar a WhatsApp ({transfer.buyerPhone})</span>
            </a>

            <Button
              variant="outline"
              onClick={handlePrint}
              className="text-xs font-bold gap-1.5 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Mandato</span>
            </Button>
          </div>

          <Button
            onClick={onClose}
            className="text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-white px-5"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
