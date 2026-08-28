"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { validateRut, formatRut } from "@/lib/chilean-utils/rut";
import {
  evaluateMultiPartnerFinancing,
  evaluateCreditRiskScore,
  calculateRCI,
  PartnerEvaluation,
} from "@/lib/financing/scoring-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditApprovalCertificateModal } from "./CreditApprovalCertificateModal";
import { X, Sparkles, Building2, CheckCircle2, AlertTriangle, XCircle, Award } from "lucide-react";

interface QuickPreApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickPreApprovalModal({ isOpen, onClose }: QuickPreApprovalModalProps) {
  const vehicles = store.getVehicles().filter((v) => v.status === "AVAILABLE");

  const [applicantName, setApplicantName] = useState("Gonzalo Valenzuela");
  const [applicantRut, setApplicantRut] = useState("11.111.111-1");
  const [monthlyIncome, setMonthlyIncome] = useState("2400000");
  const [employmentStatus, setEmploymentStatus] = useState<"DEPENDENT" | "INDEPENDENT">("DEPENDENT");
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || "");
  const [downPayment, setDownPayment] = useState(Math.round((vehicles[0]?.priceCash || 15000000) * 0.25));
  const [termMonths, setTermMonths] = useState(48);

  const [evaluations, setEvaluations] = useState<PartnerEvaluation[] | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<PartnerEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRut(applicantRut)) {
      setErrorMsg("Ingresa un RUT chileno válido (Módulo 11)");
      return;
    }
    setErrorMsg("");

    const evals = evaluateMultiPartnerFinancing({
      applicantName,
      applicantRut: formatRut(applicantRut),
      monthlyIncome: parseInt(monthlyIncome, 10) || 1500000,
      employmentStatus,
      vehiclePrice: currentVehicle.priceCash,
      downPayment,
      termMonths,
    });

    setEvaluations(evals);
  };

  const riskProfile = evaluateCreditRiskScore({
    monthlyIncome: parseInt(monthlyIncome, 10) || 1500000,
    downPayment,
    vehiclePrice: currentVehicle.priceCash,
    employmentStatus,
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Evaluador y Pre-Aprobación F&I en Vivo</div>
              <div className="text-[11px] text-slate-400">Scoring simultáneo con Forum, Santander, Tanner y Autofin</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleEvaluate} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nombre del Postulante</Label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <Label>RUT Chileno</Label>
              <Input
                value={applicantRut}
                onChange={(e) => setApplicantRut(e.target.value)}
                placeholder="11.111.111-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Renta Líquida Mensual</Label>
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Tipo de Empleo</Label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-900"
              >
                <option value="DEPENDENT">Dependiente (Contrato)</option>
                <option value="INDEPENDENT">Independiente (Boletas/F29)</option>
              </select>
            </div>

            <div>
              <Label>Vehículo a Financiar</Label>
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  const v = vehicles.find((veh) => veh.id === e.target.value);
                  if (v) setDownPayment(Math.round(v.priceCash * 0.25));
                }}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-900 truncate"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({formatCLP(v.priceCash)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Pie Inicial ({Math.round((downPayment / (currentVehicle?.priceCash || 1)) * 100)}%)</Label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div>
              <Label>Plazo del Crédito</Label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(parseInt(e.target.value, 10))}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-900"
              >
                <option value={24}>24 Meses (2 Años)</option>
                <option value={36}>36 Meses (3 Años)</option>
                <option value={48}>48 Meses (4 Años)</option>
                <option value={60}>60 Meses (5 Años)</option>
              </select>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                Score Crediticio: {riskProfile.score}/950 pts ({riskProfile.riskTier === "LOW" ? "Riesgo Bajo" : "Estándar"})
              </span>
            </div>

            <Button type="submit" size="sm" className="font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluar Simultáneamente (4 Financieras)</span>
            </Button>
          </div>
        </form>

        {/* Results Matrix */}
        {evaluations && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Dictamen de Entidades Financieras Conectadas</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluations.map((ev) => (
                <div
                  key={ev.partnerId}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{ev.partnerName}</div>
                      <div className="text-[10px] text-slate-500">Tasa: {ev.monthlyRatePercent}% mes • CAE: {ev.caePercent}%</div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ev.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : ev.status === "CONDITIONED"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {ev.status === "APPROVED" ? "Aprobado" : ev.status === "CONDITIONED" ? "Condicionado" : "Rechazado"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Cuota Mensual</div>
                      <div className="text-sm font-black text-blue-700">{formatCLP(ev.monthlyPaymentCLP)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Comisión Dealer</div>
                      <div className="text-xs font-bold text-emerald-600">{formatCLP(ev.dealerCommissionCLP)}</div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCertificate(ev)}
                    className="w-full text-[11px] font-bold gap-1 text-blue-700 border-blue-200 hover:bg-blue-50 h-7"
                  >
                    <Award className="w-3 h-3" />
                    <span>Ver Certificado de Aprobación</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCertificate && currentVehicle && (
        <CreditApprovalCertificateModal
          isOpen={true}
          onClose={() => setSelectedCertificate(null)}
          applicantName={applicantName}
          applicantRut={applicantRut}
          vehicleName={`${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})`}
          vehiclePrice={currentVehicle.priceCash}
          downPayment={downPayment}
          termMonths={termMonths}
          evaluation={selectedCertificate}
        />
      )}
    </div>
  );
}
