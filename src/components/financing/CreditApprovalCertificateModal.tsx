"use client";

import React from "react";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { PartnerEvaluation } from "@/lib/financing/scoring-engine";
import { Button } from "@/components/ui/button";
import { X, ShieldCheck, Printer, Share2, Award, Calendar, CheckCircle2 } from "lucide-react";

interface CreditApprovalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  applicantRut: string;
  vehicleName: string;
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  evaluation: PartnerEvaluation;
}

export function CreditApprovalCertificateModal({
  isOpen,
  onClose,
  applicantName,
  applicantRut,
  vehicleName,
  vehiclePrice,
  downPayment,
  termMonths,
  evaluation,
}: CreditApprovalCertificateModalProps) {
  if (!isOpen) return null;

  const certificateFolio = `CERT-FI-${Math.floor(100000 + Math.random() * 900000)}`;
  const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🚗 *CERTIFICADO DE PRE-APROBACIÓN CREDITICIA*\n` +
      `Estimado(a) *${applicantName}*, te confirmamos que tu crédito automotriz para *${vehicleName}* ha sido *PRE-APROBADO* por *${evaluation.partnerName}*.\n\n` +
      `• *Cuota Mensual:* ${formatCLP(evaluation.monthlyPaymentCLP)} (${termMonths} meses)\n` +
      `• *Pie:* ${formatCLP(downPayment)}\n` +
      `• *Tasa Mensual:* ${evaluation.monthlyRatePercent}%\n` +
      `• *CAE:* ${evaluation.caePercent}%\n` +
      `• *Folio Certificado:* ${certificateFolio}\n` +
      `• *Vigencia:* ${expiryDate}\n\n` +
      `Presenta este certificado en Automotora Oriente para concretar tu compra.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden print:border-none print:shadow-none animate-in fade-in zoom-in-95">
        {/* Certificate Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between border-b border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                Certificado Oficial de Pre-Aprobación F&I
              </span>
              <h2 className="text-lg font-black text-white">Automotora Oriente & {evaluation.partnerName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700">
          {/* Certificate Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-extrabold text-emerald-950 text-sm">CRÉDITO AUTOMOTRIZ PRE-APROBADO</div>
                <div className="text-[11px] text-emerald-800">Evaluación de riesgo crediticio satisfactoria</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-emerald-700 font-bold uppercase">{certificateFolio}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Válido 15 días</div>
            </div>
          </div>

          {/* Applicant & Vehicle Breakdown */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Postulante Titular</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">{applicantName}</div>
              <div className="text-[11px] font-mono text-slate-500">RUT: {applicantRut}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Vehículo Aprobado</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">{vehicleName}</div>
              <div className="text-[11px] text-slate-500 font-medium">Valor Contado: {formatCLP(vehiclePrice)}</div>
            </div>
          </div>

          {/* Financial Conditions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Pie Aprobado</div>
              <div className="text-sm font-black text-blue-950 mt-0.5">{formatCLP(downPayment)}</div>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Plazo</div>
              <div className="text-sm font-black text-blue-950 mt-0.5">{termMonths} Meses</div>
            </div>
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
              <div className="text-[10px] font-bold text-blue-200 uppercase">Cuota Mensual</div>
              <div className="text-sm font-black text-white mt-0.5">{formatCLP(evaluation.monthlyPaymentCLP)}</div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">CAE Oficial</div>
              <div className="text-sm font-black text-emerald-950 mt-0.5">{evaluation.caePercent}%</div>
            </div>
          </div>

          {/* Legal and Conditions Note */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Condiciones y Requisitos de Otorgamiento:</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
              {evaluation.conditions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Vencimiento: {expiryDate}</span>
            </span>
            <span>Comisión Dealer F&I: {formatCLP(evaluation.dealerCommissionCLP)}</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Certificado</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleShareWhatsApp}
              className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
