"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VehicleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  brandFilter: string;
  onBrandChange: (brand: string) => void;
  brands: string[];
}

export function VehicleFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  brandFilter,
  onBrandChange,
  brands,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar por marca, modelo o patente..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white rounded-xl"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="AVAILABLE">Disponibles</option>
          <option value="RESERVED">Reservados</option>
          <option value="SOLD">Vendidos</option>
          <option value="IN_MAINTENANCE">En Taller</option>
        </select>

        <select
          value={brandFilter}
          onChange={(e) => onBrandChange(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="ALL">Todas las Marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
