"use client";

import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Badge } from "@/components/ui/badge";
import { store } from "@/lib/store";
import { ExternalLink, Trash2, MessageCircle, Eye } from "lucide-react";

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

  const handleShareWhatsApp = (v: Vehicle) => {
    const text = encodeURIComponent(
      "Hola! Te comparto la información de este auto:\n\n" +
      "🚗 *" + v.brand + " " + v.model + " " + (v.version || "") + "*\n" +
      "📅 Año: " + v.year + " | 🛣️ " + v.mileage.toLocaleString("es-CL") + " km\n" +
      "🔢 Patente: " + v.licensePlate + "\n" +
      "💰 Precio Contado: " + formatCLP(v.priceCash) + "\n" +
      (v.priceFinanced ? "💳 Precio Financiado: " + formatCLP(v.priceFinanced) + "\n" : "") +
      "🌐 Ver fotos y ficha completa: https://autosoft360.vercel.app/site/auto-oriente/vehicles/" + v.id
    );
    window.open("https://wa.me/?text=" + text, "_blank");
  };

  return (
    <div className="w-full space-y-4">
      {/* VISTA DESKTOP: Tabla Tradicional (hidden md:block) */}
      <div className="hidden md:block w-full overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
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
                      className={"w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors " + (
                        v.publishedToWeb
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      )}
                      title={v.publishedToWeb ? "Publicado en Web" : "Oculto de Web"}
                    >
                      {v.publishedToWeb ? "✓" : "–"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleSync(v.id, "mercadolibre")}
                      className={"w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors " + (
                        v.publishedToMercadolibre
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      )}
                      title={v.publishedToMercadolibre ? "Sincronizado en Mercado Libre" : "No publicado"}
                    >
                      {v.publishedToMercadolibre ? "✓" : "–"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleSync(v.id, "chileautos")}
                      className={"w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors " + (
                        v.publishedToChileautos
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      )}
                      title={v.publishedToChileautos ? "Sincronizado en Chileautos" : "No publicado"}
                    >
                      {v.publishedToChileautos ? "✓" : "–"}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(v)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50"
                        title="Compartir por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <Link
                        href={"/site/auto-oriente/vehicles/" + v.id}
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

      {/* VISTA MOBILE: Tarjetas Táctiles (md:hidden) */}
      <div data-testid="mobile-vehicle-cards" className="md:hidden space-y-3">
        {vehicles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
            No se encontraron vehículos con los filtros aplicados.
          </div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-4 space-y-3"
            >
              {/* Top Row: Photo + Brand/Model + Status */}
              <div className="flex gap-3">
                <img
                  src={v.images[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&q=80"}
                  alt={v.model}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                      {v.brand} {v.model}
                    </h3>
                    <Badge variant={statusVariant[v.status] as any} className="text-[10px] px-1.5 py-0">
                      {statusLabels[v.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{v.version}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <LicensePlateBadge plate={v.licensePlate} size="sm" />
                    <span className="text-xs font-semibold text-slate-700">{v.year}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{v.mileage.toLocaleString("es-CL")} km</span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 bg-slate-50/50 -mx-4 -mb-3 p-3 mt-1">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Precio Contado</div>
                  <div className="font-black text-slate-900 text-base tabular-nums">{formatCLP(v.priceCash)}</div>
                  {v.priceFinanced && (
                    <div className="text-[10px] font-semibold text-emerald-600">
                      Financ: {formatCLP(v.priceFinanced)}
                    </div>
                  )}
                </div>

                {/* Mobile 1-Tap Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(v)}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                    title="Compartir por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <Link
                    href={"/site/auto-oriente/vehicles/" + v.id}
                    target="_blank"
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                    title="Ver en Web"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    title="Eliminar auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
