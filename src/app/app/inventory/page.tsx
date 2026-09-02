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

      <main className="p-6 max-w-7xl w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <VehicleFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            brandFilter={brandFilter}
            onBrandChange={setBrandFilter}
            brands={brands}
          />

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <div className="flex items-center bg-slate-200/80 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs font-semibold ${
                  viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Tabla"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md text-xs font-semibold ${
                  viewMode === "grid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Grilla"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("pipeline")}
                className={`p-1.5 rounded-md text-xs font-semibold ${
                  viewMode === "pipeline" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Vista Pipeline Kanban"
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => setIsIntakeModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold border-cyan-300 text-cyan-800 bg-cyan-50/50 hover:bg-cyan-100/50 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Alta con IA</span>
            </Button>

            <Link href="/app/inventory/new">
              <Button size="sm" className="gap-1.5 font-bold shadow-xs bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="w-4 h-4" />
                <span>Agregar Vehículo</span>
              </Button>
            </Link>
          </div>
        </div>

        {viewMode === "table" && (
          <VehicleTable vehicles={filteredVehicles} onRefresh={refreshData} />
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}

        {viewMode === "pipeline" && (
          <VehiclePipelineKanban />
        )}
      </main>

      <VehicleIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onVehicleCreated={refreshData}
      />
    </div>
  );
}
