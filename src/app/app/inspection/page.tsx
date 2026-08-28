"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { InspectionFormModal } from "@/components/inspection/InspectionFormModal";
import { InspectionReportModal } from "@/components/inspection/InspectionReportModal";
import { VehicleInspection } from "@/types";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Plus, CheckCircle2, Eye, Wrench, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";

export default function InspectionPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [inspections, setInspections] = useState(store.getInspections());

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<VehicleInspection | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveInspection = (data: any) => {
    const created = store.createInspection(data);
    setInspections([...store.getInspections()]);
    setSuccessMessage(`¡Inspección técnica completada exitosamente con puntuación de ${created.score}/100 pts!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSendToWorkshop = (inspectionId: string) => {
    const createdOrders = store.convertInspectionToServiceOrders(inspectionId);
    setSuccessMessage(`¡Se crearon ${createdOrders.length} Órdenes de Trabajo en el Módulo de Taller para recondicionar el vehículo!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Check-in Móvil de Recepción & Inspección Técnica"
        subtitle="Checklist de 50 puntos con scoring (0-100), mapeador de daños y acta de recepción"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Inspecciones Realizadas</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{inspections.length}</div>
            <div className="text-xs text-slate-400 mt-1">Check-in de retomas y stock</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Promedio Scoring Técnico</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {inspections.length > 0
                ? Math.round(inspections.reduce((sum, i) => sum + i.score, 0) / inspections.length)
                : 0}{" "}
              / 100
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Estado certificado</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Requieren Puesta a Punto</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {inspections.filter((i) => i.rating === "REQUIERE_TALLER" || i.items.some((it) => it.status === "FAIL")).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Con fallas enviadas a taller</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Actas Firmadas</div>
            <div className="text-2xl font-black text-blue-600 mt-1">100%</div>
            <div className="text-xs text-blue-500 font-semibold mt-1">Conformidad del cliente</div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Protocolo de Recepción</div>
              <div className="font-extrabold text-slate-900 text-sm">
                Estándar 50 Puntos Autosoft ({tenant.name})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/inspection/yard-mode"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Modo Patio PWA</span>
            </Link>

            <Button
              onClick={() => setIsFormModalOpen(true)}
              className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Inspección de Entrada</span>
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Inspections Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-blue-600" />
              <span>Historial de Inspecciones & Certificados de Entrada ({inspections.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Trazabilidad física de retomas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Vehículo / Patente</th>
                  <th className="py-2.5 px-3">Inspector (RUT)</th>
                  <th className="py-2.5 px-3">Kilometraje & Bencina</th>
                  <th className="py-2.5 px-3">Scoring Técnico</th>
                  <th className="py-2.5 px-3">Daños Mapeados</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {inspections.map((insp) => {
                  const veh = vehicles.find((v) => v.id === insp.vehicleId) || vehicles[0];
                  return (
                    <tr key={insp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">
                          {veh.brand} {veh.model} ({veh.year})
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{veh.licensePlate}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{insp.inspectorName}</div>
                        <div className="text-[10px] text-slate-400">{insp.inspectorRut}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{insp.receptionMileage.toLocaleString("es-CL")} km</div>
                        <div className="text-[10px] text-slate-400">Combustible: {insp.fuelLevel}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-sm">{insp.score}/100</span>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                            insp.rating === "EXCELENTE"
                              ? "bg-emerald-100 text-emerald-800"
                              : insp.rating === "BUENO"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {insp.rating}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {insp.damagePoints.length} puntos marcados
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {new Date(insp.createdAt).toLocaleDateString("es-CL")}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInspection(insp)}
                          className="text-[11px] font-bold h-7 px-2.5 gap-1 text-slate-800"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver Certificado</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <InspectionFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          vehicles={vehicles}
          onSaveInspection={handleSaveInspection}
        />

        {selectedInspection && (
          <InspectionReportModal
            isOpen={true}
            onClose={() => setSelectedInspection(null)}
            inspection={selectedInspection}
            vehicle={vehicles.find((v) => v.id === selectedInspection.vehicleId) || vehicles[0]}
            tenant={tenant}
            onSendToWorkshop={handleSendToWorkshop}
          />
        )}
      </main>
    </div>
  );
}
