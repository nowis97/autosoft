"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { ConsignmentModal } from "@/components/consignments/ConsignmentModal";
import { ConsignmentContractModal } from "@/components/consignments/ConsignmentContractModal";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { calculateConsignmentSettlement } from "@/lib/consignments/consignment-calculator";
import { Car, FileText, Plus, CheckCircle2, ShieldCheck, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsignmentsPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [consignments, setConsignments] = useState(store.getConsignments());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractConsignment, setContractConsignment] = useState<any | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveConsignment = (data: any) => {
    const newVehicle = store.createVehicle({
      tenantId: tenant.id,
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      version: data.version,
      year: data.year,
      mileage: data.mileage,
      transmission: "AUTOMATICA",
      fuelType: "BENCINA",
      bodyType: "SUV",
      color: "Blanco Glaciar",
      priceCash: data.agreedSalePriceCLP,
      priceFinanced: Math.round(data.agreedSalePriceCLP * 0.95),
      acquisitionCost: 0,
      status: "AVAILABLE",
      description: `Vehículo en consignación de ${data.ownerName}. Excelente estado y documentación al día.`,
      features: ["Aire Acondicionado", "Doble Airbag", "Frenos ABS", "Llantas de Aleación"],
      images: ["https://images.unsplash.com/photo-1541348263662-e0c86629c983?w=1200&auto=format&fit=crop&q=80"],
      publishedToWeb: true,
      publishedToMercadolibre: false,
      publishedToChileautos: false,
      publishedToYapo: false,
    });

    const newCons = store.createConsignment({
      tenantId: tenant.id,
      vehicleId: newVehicle.id,
      ownerName: data.ownerName,
      ownerRut: data.ownerRut,
      ownerPhone: data.ownerPhone,
      ownerEmail: data.ownerEmail,
      ownerBank: data.ownerBank,
      ownerAccountType: data.ownerAccountType,
      ownerAccountNumber: data.ownerAccountNumber,
      type: data.type,
      ownerTargetPriceCLP: data.ownerTargetPriceCLP,
      agreedSalePriceCLP: data.agreedSalePriceCLP,
      commissionType: data.commissionType,
      commissionValue: data.commissionValue,
      contractExclusivityDays: data.contractExclusivityDays,
      status: "ACTIVE",
    });

    setConsignments([...store.getConsignments()]);
    setSuccessMessage(`¡Consignación de ${data.brand} ${data.model} (${data.licensePlate}) registrada exitosamente en catálogo!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSettle = (consId: string, salePrice: number) => {
    store.settleConsignment(consId, salePrice, 0);
    setConsignments([...store.getConsignments()]);
    setSuccessMessage("¡Liquidación y rendición de cuentas emitida con éxito! Saldo listo para transferir.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Consignaciones & Autos de Terceros"
        subtitle="Gestión de vehículos dejados en venta por particulares con mandato mercantil y liquidación automática"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* Top Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Autos en Consignación</div>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {consignments.length} vehículos
            </div>
            <div className="text-xs text-slate-400 mt-1">$0 capital propio inmovilizado</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Comisiones Proyectadas</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {formatCLP(consignments.reduce((sum, c) => sum + Math.round(c.agreedSalePriceCLP * 0.04), 0))}
            </div>
            <div className="text-xs text-slate-400 mt-1">Margen de corretaje automotriz</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Nuevo Ingreso</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Registrar auto particular</div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-xs gap-1.5 shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Consignación</span>
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Consignment Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-purple-600" />
              <span>Catálogo de Vehículos Consignados ({consignments.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Vehículo / Patente</th>
                  <th className="py-3 px-3">Modalidad</th>
                  <th className="py-3 px-3">Propietario & Banco</th>
                  <th className="py-3 px-3">Precio Publicación</th>
                  <th className="py-3 px-3">Comisión Dealer</th>
                  <th className="py-3 px-3">Liquidación Dueño</th>
                  <th className="py-3 px-3 text-right">Contrato / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {consignments.map((c) => {
                  const veh = vehicles.find((v) => v.id === c.vehicleId);
                  const settlement = calculateConsignmentSettlement({
                    salePrice: c.agreedSalePriceCLP,
                    commissionType: c.commissionType,
                    commissionValue: c.commissionValue,
                  });

                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{veh?.brand} {veh?.model} ({veh?.year})</div>
                        {veh && <LicensePlateBadge plate={veh.licensePlate} size="sm" />}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.type === "PHYSICAL"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {c.type === "PHYSICAL" ? "🏢 Salón" : "📱 Virtual"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{c.ownerName}</div>
                        <div className="text-[10px] text-slate-400">{c.ownerBank} ({c.ownerAccountType})</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatCLP(c.agreedSalePriceCLP)}</td>
                      <td className="py-3 px-3 font-bold text-purple-600">
                        {formatCLP(settlement.dealerCommissionCLP)} ({settlement.effectiveCommissionPercentage}%)
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-600">{formatCLP(settlement.netPayoutToOwnerCLP)}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setContractConsignment({ consignment: c, vehicle: veh })}
                            className="text-[11px] font-bold h-7 px-2 gap-1 text-slate-800"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Contrato</span>
                          </Button>

                          {c.status !== "SETTLED" ? (
                            <Button
                              size="sm"
                              onClick={() => handleSettle(c.id, c.agreedSalePriceCLP)}
                              className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2 gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Liquidar</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Pagado
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ConsignmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveConsignment}
        />

        {contractConsignment && (
          <ConsignmentContractModal
            isOpen={true}
            onClose={() => setContractConsignment(null)}
            consignment={contractConsignment.consignment}
            vehicle={contractConsignment.vehicle}
            tenant={tenant}
          />
        )}
      </main>
    </div>
  );
}
