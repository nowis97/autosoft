"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Car,
  DollarSign,
  Clock,
  Users,
  Share2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState(store.getStats());
  const [vehicles, setVehicles] = useState(store.getVehicles());
  const [leads, setLeads] = useState(store.getLeads());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setStats(store.getStats());
      setVehicles(store.getVehicles());
      setLeads(store.getLeads());
    });
    return unsub;
  }, []);

  const staleVehicles = vehicles.filter((v) => (v.daysInStock || 0) > 30 && v.status === "AVAILABLE");
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Panel General"
        subtitle="Métricas operacionales, rotación de stock y oportunidades de venta"
      />

      <main className="p-6 space-y-6 max-w-7xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Inventario Total</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.availableCount}{" "}
              <span className="text-sm font-normal text-slate-400">/ {stats.totalVehicles} autos</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">{stats.availableCount} disponibles</span>
              <span>·</span>
              <span className="text-amber-600 font-semibold">{stats.reservedCount} reservados</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Valor del Stock</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {formatCLP(stats.totalInventoryValue)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Margen estimado: <strong className="text-slate-700">{formatCLP(stats.estimatedProfitMargin)}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Días Promedio (DSI)</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.avgDaysInStock}{" "}
              <span className="text-sm font-normal text-slate-400">días</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Rotación saludable (&lt; 45 días meta)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Prospectos & Cierre</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.leadsCount}{" "}
              <span className="text-sm font-normal text-slate-400">leads ({stats.conversionRate}% conv.)</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {stats.leadsWon} ventas cerradas este mes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Vehículos que Requieren Atención (&gt;30 días)</h3>
              </div>
              <Link href="/app/inventory" className="text-xs font-bold text-blue-600 hover:underline">
                Ver todo el stock →
              </Link>
            </div>

            {staleVehicles.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400 bg-slate-50 rounded-lg">
                Excelente: Ningún vehículo supera los 30 días en stock.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staleVehicles.map((v) => (
                  <div key={v.id} className="p-3 border border-slate-200 rounded-lg flex gap-3 bg-slate-50/50">
                    <img src={v.images[0]} alt={v.model} className="w-16 h-14 object-cover rounded-md shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 truncate">{v.brand} {v.model} ({v.year})</div>
                      <div className="text-blue-700 font-semibold mt-0.5">{formatCLP(v.priceCash)}</div>
                      <div className="text-amber-700 font-semibold text-[11px] mt-1">
                        ⚠️ {v.daysInStock} días en inventario
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Sincronización Multicanal</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Tus vehículos se distribuyen automáticamente a los principales portales de Chile.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Mercado Libre Chile</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">API Conectada</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Chileautos / Carsales</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Feed XML Activo</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Sitio Web Propio</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700">Online (SSL)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link href="/app/syndication">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Gestionar Conexiones y Logs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Últimos Prospectos Recibidos (CRM)</h3>
              <p className="text-xs text-slate-500">Consultas generadas desde la web, WhatsApp y portales</p>
            </div>
            <Link href="/app/crm">
              <Button size="sm" variant="outline" className="text-xs font-semibold">
                Abrir Tablero Kanban →
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLeads.map((lead) => {
              const car = vehicles.find((v) => v.id === lead.vehicleId);

              return (
                <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                      {lead.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-slate-500">{lead.phone} · {lead.channel}</div>
                    </div>
                  </div>

                  {car && (
                    <div className="hidden sm:block text-slate-600">
                      🚗 <strong>{car.brand} {car.model}</strong> ({car.year})
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {lead.status}
                    </span>
                    <Link href="/app/crm">
                      <Button size="sm" variant="ghost" className="text-xs text-blue-600 font-semibold">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
