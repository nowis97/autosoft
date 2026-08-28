"use client";

import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Badge } from "@/components/ui/badge";
import { store } from "@/lib/store";
import { ExternalLink, Trash2 } from "lucide-react";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onRefresh?: () => void;
}

export function VehicleTable({ vehicles, onRefresh }: VehicleTableProps) {
  const toggleSync = (id: string, portal: "mercadolibre" | "chileautos" | "yapo" | "web") => {
    store.toggleSyndication(id, portal);
    if (onRefresh) onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este vehículo del inventario?")) {
      store.deleteVehicle(id);
      if (onRefresh) onRefresh();
    }
  };

  const statusVariant = {
    AVAILABLE: "available",
    RESERVED: "reserved",
    SOLD: "sold",
    IN_MAINTENANCE: "maintenance",
  };

  const statusLabels = {
    AVAILABLE: "Disponible",
    RESERVED: "Reservado",
    SOLD: "Vendido",
    IN_MAINTENANCE: "En Taller",
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3.5 px-4">Vehículo / Patente</th>
            <th className="py-3.5 px-4">Año / KM</th>
            <th className="py-3.5 px-4">Precio Contado</th>
            <th className="py-3.5 px-4">Estado</th>
            <th className="py-3.5 px-4 text-center">Web</th>
            <th className="py-3.5 px-4 text-center">Mercado Libre</th>
            <th className="py-3.5 px-4 text-center">Chileautos</th>
            <th className="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-slate-400">
                No se encontraron vehículos con los filtros aplicados.
              </td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.images[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&q=80"}
                      alt={v.model}
                      className="w-12 h-10 object-cover rounded-md border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[180px] mb-1">
                        {v.version}
                      </div>
                      <LicensePlateBadge plate={v.licensePlate} size="sm" />
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{v.year}</div>
                  <div className="text-xs text-slate-500">{v.mileage.toLocaleString("es-CL")} km</div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-slate-900 tabular-nums">{formatCLP(v.priceCash)}</div>
                  {v.priceFinanced && (
                    <div className="text-[11px] text-emerald-600">Financ: {formatCLP(v.priceFinanced)}</div>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={statusVariant[v.status] as any}>
                    {statusLabels[v.status]}
                  </Badge>
                  <div className="text-[10px] text-slate-400 mt-1">{v.daysInStock || 0} d en stock</div>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => toggleSync(v.id, "web")}
                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors ${
                      v.publishedToWeb
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                    title={v.publishedToWeb ? "Publicado en Web" : "Oculto de Web"}
                  >
                    {v.publishedToWeb ? "✓" : "–"}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => toggleSync(v.id, "mercadolibre")}
                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors ${
                      v.publishedToMercadolibre
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                    title={v.publishedToMercadolibre ? "Sincronizado en Mercado Libre" : "No publicado"}
                  >
                    {v.publishedToMercadolibre ? "✓" : "–"}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => toggleSync(v.id, "chileautos")}
                    className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors ${
                      v.publishedToChileautos
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                    title={v.publishedToChileautos ? "Sincronizado en Chileautos" : "No publicado"}
                  >
                    {v.publishedToChileautos ? "✓" : "–"}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/site/auto-oriente/vehicles/${v.id}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100"
                      title="Ver en Sitio Web Público"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                      title="Eliminar auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
