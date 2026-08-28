"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function SyndicationPage() {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();

  const feedUrl = `https://app.autosoft.cl/api/feeds/chileautos/${tenant.chileautosToken}`;

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Sincronización con Mercado Libre y Chileautos completada con éxito. Todos los inventarios están al día.");
    }, 1200);
  };

  const mlPublishedCount = vehicles.filter((v) => v.publishedToMercadolibre).length;
  const caPublishedCount = vehicles.filter((v) => v.publishedToChileautos).length;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Sincronización Multicanal"
        subtitle="Administra las conexiones automáticas con Mercado Libre, Chileautos y portales clasificados"
      />

      <main className="p-6 max-w-5xl w-full space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Distribución Automática de Stock</h2>
              <p className="text-xs text-slate-500">
                Al crear, editar o vender un vehículo, Autosoft actualiza o retira la publicación en todos los portales.
              </p>
            </div>
          </div>

          <Button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="gap-2 shrink-0 font-bold shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Sincronizando..." : "Forzar Sincronización"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center font-black text-amber-900 text-sm">
                    ML
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Mercado Libre Chile</h3>
                    <span className="text-xs text-slate-400">API Oficial OAuth2</span>
                  </div>
                </div>
                <Badge variant="available">Conectado</Badge>
              </div>

              <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Vehículos Publicados:</span>
                  <strong className="text-slate-900">{mlPublishedCount} autos</strong>
                </div>
                <div className="flex justify-between">
                  <span>Última Sincronización:</span>
                  <span className="text-slate-500">Hace 4 minutos (Automática)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado de Token:</span>
                  <span className="text-emerald-600 font-semibold">Válido (Auto-renovable)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Tus publicaciones se sincronizan en tiempo real con la categoría vehicular oficial de Mercado Libre.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                Configurar Credenciales Mercado Libre
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center font-black text-red-700 text-sm">
                    CA
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Chileautos (Carsales)</h3>
                    <span className="text-xs text-slate-400">Feed XML AutoGate</span>
                  </div>
                </div>
                <Badge variant="available">Feed Activo</Badge>
              </div>

              <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Vehículos en Feed:</span>
                  <strong className="text-slate-900">{caPublishedCount} autos</strong>
                </div>
                <div className="flex justify-between">
                  <span>Protocolo:</span>
                  <span className="text-slate-500">XML AutoGate / Carsales DMS</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato de Salida:</span>
                  <span className="text-emerald-600 font-semibold">HTTP XML Feed</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">URL del Feed para Chileautos</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={feedUrl}
                    className="h-9 px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 w-full select-all"
                  />
                  <Button size="sm" variant="outline" onClick={copyFeedUrl} className="shrink-0 h-9">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a href={feedUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5">
                  <span>Abrir Feed XML en Navegador</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Registro de Eventos y Despublicación Automática</h3>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                time: "Hace 12 min",
                event: "Vehículo modificado: Toyota RAV4 (BBCL12)",
                portal: "Mercado Libre + Chileautos",
                status: "SUCCESS",
                detail: "Precio y kilometraje actualizados correctamente.",
              },
              {
                time: "Hace 1 hora",
                event: "Vehículo vendido: Jeep Grand Cherokee (CD1234)",
                portal: "Todos los canales",
                status: "SUCCESS",
                detail: "Despublicado y pausado de Mercado Libre y Chileautos.",
              },
              {
                time: "Ayer 18:20",
                event: "Nuevo vehículo creado: Suzuki Swift (GHYW90)",
                portal: "Web + Mercado Libre + Chileautos",
                status: "SUCCESS",
                detail: "Publicación creada con 1 foto HD y especificaciones completas.",
              },
            ].map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{log.event}</div>
                  <div className="text-slate-400">{log.detail} · <span className="text-blue-600 font-medium">{log.portal}</span></div>
                </div>
                <div className="text-right">
                  <Badge variant="available">Completado</Badge>
                  <div className="text-[10px] text-slate-400 mt-1">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
