"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { QuickPreApprovalModal } from "@/components/financing/QuickPreApprovalModal";
import { CreditApprovalCertificateModal } from "@/components/financing/CreditApprovalCertificateModal";
import { evaluateMultiPartnerFinancing } from "@/lib/financing/scoring-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, Award, ShieldCheck, TrendingUp, CheckCircle2 } from "lucide-react";

export default function FinancingDashboardPage() {
  const applications = store.getApplications();
  const vehicles = store.getVehicles();
  const [apps] = useState(applications);
  const [isQuickEvalOpen, setIsQuickEvalOpen] = useState(false);
  const [selectedCertModal, setSelectedCertModal] = useState<any | null>(null);

  const partners = [
    { name: "Forum Servicios Financieros", commissionRate: "2.0%", status: "Activo", rate: "1.39%" },
    { name: "Santander Consumer", commissionRate: "1.8%", status: "Activo", rate: "1.35%" },
    { name: "Tanner Servicios Financieros", commissionRate: "2.2%", status: "Activo", rate: "1.52%" },
    { name: "Autofin", commissionRate: "2.5%", status: "Activo", rate: "1.58%" },
  ];

  const handleOpenCertificate = (app: any) => {
    const car = vehicles.find((v) => v.id === app.vehicleId) || vehicles[0];
    const evals = evaluateMultiPartnerFinancing({
      applicantName: app.applicantName,
      applicantRut: app.applicantRut,
      monthlyIncome: app.monthlyIncome,
      employmentStatus: app.employmentStatus,
      vehiclePrice: car?.priceCash || 15000000,
      downPayment: app.downPayment,
      termMonths: app.termMonths,
    });

    const partnerEval = evals.find((e) => e.partnerId === app.financialPartner) || evals[0];

    setSelectedCertModal({
      applicantName: app.applicantName,
      applicantRut: app.applicantRut,
      vehicleName: car ? `${car.brand} ${car.model} (${car.year})` : "Vehículo en Stock",
      vehiclePrice: car?.priceCash || 15000000,
      downPayment: app.downPayment,
      termMonths: app.termMonths,
      evaluation: partnerEval,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Financiamiento Automotriz & Scoring F&I en Vivo"
        subtitle="Simulación multi-entidad con Forum, Santander, Tanner y Autofin con emisión de certificado oficial de pre-aprobación"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Solicitudes en Evaluación</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{apps.length}</div>
            <div className="text-xs text-slate-400 mt-1">Multi-financiera conectada</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Tasa de Pre-Aprobación</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">88%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Scoring RCI &le; 40%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Monto Colocaciones</span>
            <div className="text-2xl font-black text-blue-700 mt-1">
              {formatCLP(apps.reduce((sum, a) => sum + (a.downPayment || 0) * 2.5, 0))}
            </div>
            <div className="text-xs text-slate-400 mt-1">Cartera en trámite</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Comisiones Dealer F&I</span>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {formatCLP(apps.length * 315000)}
            </div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Ingreso neto adicional</div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Motor de Decisión Crediticia</div>
              <div className="font-extrabold text-slate-900 text-sm">
                Evaluador Instantáneo Multi-Financiera
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsQuickEvalOpen(true)}
            className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nueva Pre-Evaluación Rápida</span>
          </Button>
        </div>

        {/* Partners Grid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Entidades Financieras Conectadas y Tasas Preferenciales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {partners.map((p) => (
              <div key={p.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="font-extrabold text-sm text-slate-900 leading-tight">{p.name}</div>
                <div className="text-xs text-slate-500">
                  Tasa ref: <strong className="text-blue-700">{p.rate} mes</strong> • Comisión: <strong className="text-slate-700">{p.commissionRate}</strong>
                </div>
                <Badge variant="available" className="text-[10px] font-bold">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Postulaciones y Dictámenes Crediticios</h3>
              <p className="text-xs text-slate-500">Solicitudes procesadas con scoring RCI y asignación de financiera</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Postulante / RUT</th>
                  <th className="py-3 px-4">Vehículo</th>
                  <th className="py-3 px-4">Pie / Plazo</th>
                  <th className="py-3 px-4">Cuota Est.</th>
                  <th className="py-3 px-4">Renta Declarada</th>
                  <th className="py-3 px-4">Financiera</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {apps.map((app) => {
                  const car = vehicles.find((v) => v.id === app.vehicleId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{app.applicantRut}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {car ? `${car.brand} ${car.model} (${car.year})` : "Vehículo en stock"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold">{formatCLP(app.downPayment)}</div>
                        <div className="text-slate-400 text-[11px]">{app.termMonths} meses</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">
                        {formatCLP(app.estimatedMonthlyPayment)}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums">{formatCLP(app.monthlyIncome)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {app.financialPartner || "SANTANDER"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={app.status === "APPROVED" || app.status === "SUBMITTED" ? "available" : "reserved"}>
                          {app.status === "APPROVED" || app.status === "SUBMITTED" ? "Pre-Aprobado" : "En Evaluación"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenCertificate(app)}
                          className="text-[11px] font-bold gap-1 text-blue-700 border-blue-200 hover:bg-blue-50 h-7"
                        >
                          <Award className="w-3 h-3" />
                          <span>Certificado</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Pre-Approval Modal */}
        <QuickPreApprovalModal
          isOpen={isQuickEvalOpen}
          onClose={() => setIsQuickEvalOpen(false)}
        />

        {/* Selected Certificate Modal */}
        {selectedCertModal && (
          <CreditApprovalCertificateModal
            isOpen={true}
            onClose={() => setSelectedCertModal(null)}
            applicantName={selectedCertModal.applicantName}
            applicantRut={selectedCertModal.applicantRut}
            vehicleName={selectedCertModal.vehicleName}
            vehiclePrice={selectedCertModal.vehiclePrice}
            downPayment={selectedCertModal.downPayment}
            termMonths={selectedCertModal.termMonths}
            evaluation={selectedCertModal.evaluation}
          />
        )}
      </main>
    </div>
  );
}
