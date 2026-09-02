"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { VehicleTable } from "@/components/inventory/VehicleTable";
import { VehicleFilters } from "@/components/inventory/VehicleFilters";
import { VehiclePipelineKanban } from "@/components/inventory/VehiclePipelineKanban";
import { VehicleIntakeModal } from "@/components/inventory/VehicleIntakeModal";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Kanban, Sparkles } from "lucide-react";
import { VehicleCard } from "@/components/inventory/VehicleCard";

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState(store.getVehicles());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "pipeline">("table");
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  const refreshData = () => {
    setVehicles(store.getVehicles());
  };

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setVehicles(store.getVehicles());
    });
    return unsub;
  }, []);

  const brands = Array.from(new Set(store.getVehicles().map((v) => v.brand))).sort();

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    const matchesBrand = brandFilter === "ALL" || v.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesSearch =
      !search ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.year.toString().includes(search);

    return matchesStatus && matchesBrand && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Inventario de Vehículos (DMS)"
        subtitle="Administra tu stock, estados del pipeline y sincronización con Mercado Libre y Chileautos"
      />

      <main className="p-6 max-w-7xl w-full space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
          <VehicleFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            brandFilter={brandFilter}
            onBrandChange={setBrandFilter}
            brands={brands}
          />

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Tabla"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Grilla"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
              <button
                onClick={() => setViewMode("pipeline")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "pipeline" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Pipeline Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
            </div>

            <Button
              onClick={() => setIsIntakeModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold rounded-xl border-cyan-300 text-cyan-800 bg-cyan-50/60 hover:bg-cyan-100/60 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Alta con IA</span>
            </Button>

            <Link href="/app/inventory/new">
              <Button size="sm" className="gap-1.5 font-bold rounded-xl shadow-xs bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* View Mode Switching */}
        {viewMode === "pipeline" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pipeline Operativo del Vehículo</h3>
                <p className="text-xs text-slate-500">Mueve los vehículos a través de las 7 etapas operacionales</p>
              </div>
            </div>
            <VehiclePipelineKanban />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onUpdate={refreshData} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <VehicleTable vehicles={filteredVehicles} onUpdate={refreshData} />
          </div>
        )}
      </main>

      <VehicleIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onVehicleCreated={() => refreshData()}
      />
    </div>
  );
}
