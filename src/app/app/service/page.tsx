"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { VehicleCostLedgerCard } from "@/components/service/VehicleCostLedgerCard";
import { ServiceOrdersTable } from "@/components/service/ServiceOrdersTable";
import { ServiceOrderModal } from "@/components/service/ServiceOrderModal";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Wrench, DollarSign, TrendingUp, CheckCircle2, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicePage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [orders, setOrders] = useState(store.getServiceOrders());

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || "");
  const vehicle = store.getVehicleById(selectedVehicleId) || vehicles[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const stats = store.getStats();

  const handleSaveOrder = (data: any) => {
    store.createServiceOrder({
      tenantId: tenant.id,
      vehicleId: data.vehicleId,
      category: data.category,
      description: data.description,
      providerName: data.providerName,
      costCLP: data.costCLP,
      invoiceNumber: data.invoiceNumber,
      estimatedCompletionDate: data.estimatedCompletionDate,
      status: "IN_PROGRESS",
    });
    setOrders([...store.getServiceOrders()]);
    setSuccessMessage("Gasto de taller registrado e imputado exitosamente al costo del vehículo.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCompleteOrder = (id: string) => {
    store.completeServiceOrder(id);
    setOrders([...store.getServiceOrders()]);
  };

  const handleReadyForSale = () => {
    store.readyVehicleForSale(vehicle.id);
    setSuccessMessage(`¡Vehículo ${vehicle.brand} ${vehicle.model} aprobado para exhibición y publicado en catálogo!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Taller, Puesta a Punto & Libro de Costos"
        subtitle="Registro de gastos de mecánica, pintura y detailing para calcular el Margen Bruto Real y ROI exacto por vehículo"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Gasto Total en Taller</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCLP(stats.totalServiceCostAll)}
            </div>
            <div className="text-xs text-amber-600 font-semibold mt-1">Invertido en preparación</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Órdenes de Trabajo</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {orders.length} órdenes
            </div>
            <div className="text-xs text-slate-400 mt-1">Mecánica, pintura y detailing</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Autos en Preparación</div>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {vehicles.filter((v) => v.status === "IN_MAINTENANCE").length} autos
            </div>
            <div className="text-xs text-slate-400 mt-1">Puesta a punto previa a venta</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Margen Bruto Global</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {formatCLP(stats.estimatedProfitMargin)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Utilidad neta proyectada</div>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Vehicle Selector Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Vehículo Seleccionado</div>
              <div className="font-extrabold text-slate-900 text-sm">
                {vehicle?.brand} {vehicle?.model} ({vehicle?.year})
              </div>
            </div>
            {vehicle && <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - {v.licensePlate}
                </option>
              ))}
            </select>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Orden de Trabajo</span>
            </Button>
          </div>
        </div>

        {/* Cost Ledger Card */}
        {vehicle && (
          <VehicleCostLedgerCard
            vehicle={vehicle}
            orders={orders}
            onOpenNewOrderModal={() => setIsModalOpen(true)}
            onReadyForSale={handleReadyForSale}
          />
        )}

        {/* Service Orders Table */}
        <ServiceOrdersTable
          orders={orders}
          vehicles={vehicles}
          onCompleteOrder={handleCompleteOrder}
        />

        <ServiceOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicles={vehicles}
          defaultVehicleId={vehicle?.id}
          onSaveOrder={handleSaveOrder}
        />
      </main>
    </div>
  );
}
