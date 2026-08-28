"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { store } from "@/lib/store";
import { StorefrontHero } from "@/components/site/StorefrontHero";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StorefrontCatalogPage() {
  const params = useParams();
  const tenantSlug = (params?.tenantSlug as string) || "auto-oriente";
  const tenant = store.getTenant(tenantSlug);

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedBodyType, setSelectedBodyType] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState<number | "ALL">("ALL");

  const allVehicles = store.getVehicles().filter((v) => v.publishedToWeb && v.status !== "SOLD");
  const brands = Array.from(new Set(allVehicles.map((v) => v.brand))).sort();

  const filteredVehicles = allVehicles.filter((v) => {
    const matchesBrand = selectedBrand === "ALL" || v.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesBody = selectedBodyType === "ALL" || v.bodyType === selectedBodyType;
    const matchesPrice = maxPrice === "ALL" || v.priceCash <= maxPrice;
    const matchesSearch =
      !search ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.year.toString().includes(search);

    return matchesBrand && matchesBody && matchesPrice && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      <StorefrontHero tenant={tenant} totalStock={allVehicles.length} />

      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por marca, modelo o año..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Todas las Marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Tipo de Carrocería</option>
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedán</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="CAMIONETA">Camioneta</option>
              </select>

              <select
                value={maxPrice.toString()}
                onChange={(e) => setMaxPrice(e.target.value === "ALL" ? "ALL" : parseInt(e.target.value, 10))}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Cualquier Precio</option>
                <option value="10000000">Hasta $10.000.000</option>
                <option value="15000000">Hasta $15.000.000</option>
                <option value="20000000">Hasta $20.000.000</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Vehículos en Exhibición ({filteredVehicles.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Actualizado hoy</span>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No encontramos vehículos con estos filtros</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Intenta restablecer los filtros de búsqueda o contáctanos por WhatsApp para consultar por próximos ingresos a stock.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedBrand("ALL");
                setSelectedBodyType("ALL");
                setMaxPrice("ALL");
              }}
              className="text-xs font-bold text-blue-600 hover:underline pt-2"
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                publicView={true}
                tenantSlug={tenantSlug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
