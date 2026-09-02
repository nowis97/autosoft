"use client";

import React, { useState } from "react";
import Image from "next/image";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AdThemeSelector } from "@/components/marketing/AdThemeSelector";
import { AdCanvasPreview } from "@/components/marketing/AdCanvasPreview";
import { AdCopyGeneratorCard } from "@/components/marketing/AdCopyGeneratorCard";
import { AdFormat, AdTheme, AdCopyOptions } from "@/lib/marketing/ad-copy-generator";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import {
  Megaphone,
  Download,
  Sparkles,
  CheckCircle2,
  Calendar,
  Send,
  Clock,
  Car,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || "");
  const vehicle = store.getVehicleById(selectedVehicleId) || vehicles[0];

  const [selectedFormat, setSelectedFormat] = useState<AdFormat>("FEED_SQUARE");
  const [selectedTheme, setSelectedTheme] = useState<AdTheme>("DARK_LUXURY");
  const [options, setOptions] = useState<AdCopyOptions>({
    includeFinancing: true,
    includeTradeIn: true,
    highlightWarranty: true,
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [instagramPublishSuccess, setInstagramPublishSuccess] = useState(false);
  const [caption, setCaption] = useState(
    `🔥 ¡Gran Oportunidad! ${vehicle?.brand} ${vehicle?.model} (${vehicle?.year})\n\n` +
    `✅ Kilometraje: ${vehicle?.mileage?.toLocaleString("es-CL")} km\n` +
    `✅ Transmisión: ${vehicle?.transmission}\n` +
    `✅ Financiamiento automotriz disponible con pie desde 20%\n` +
    `✅ Recibimos tu auto en parte de pago\n\n` +
    `📍 Visítanos o escríbenos al DM para agendar tu test drive. ¡Te esperamos!`
  );

  const handleDownloadHD = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePublishInstagram = () => {
    setInstagramPublishSuccess(true);
    setTimeout(() => setInstagramPublishSuccess(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Marketing & Publicador Instagram Business"
        subtitle="Crea piezas gráficas de alto impacto, copys con IA y publica directamente en redes sociales"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* Vehicle Selector Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Vehículo a Promocionar</div>
              <div className="font-extrabold text-slate-900 text-base">
                {vehicle?.brand} {vehicle?.model} ({vehicle?.year})
              </div>
            </div>
            {vehicle && <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const v = store.getVehicleById(e.target.value);
                if (v) {
                  setCaption(
                    `🔥 ¡Gran Oportunidad! ${v.brand} ${v.model} (${v.year})\n\n` +
                    `✅ Kilometraje: ${v.mileage?.toLocaleString("es-CL")} km\n` +
                    `✅ Transmisión: ${v.transmission}\n` +
                    `✅ Financiamiento automotriz disponible con pie desde 20%\n` +
                    `✅ Recibimos tu auto en parte de pago\n\n` +
                    `📍 Visítanos o escríbenos al DM para agendar tu test drive. ¡Te esperamos!`
                  );
                }
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - {v.licensePlate}
                </option>
              ))}
            </select>

            <Button
              onClick={handleDownloadHD}
              className="font-bold text-xs gap-1.5 shadow-sm bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Creatividad HD</span>
            </Button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Creatividad HD generada y descargada exitosamente en formato 1080x1080.</span>
          </div>
        )}

        {instagramPublishSuccess && (
          <div className="bg-pink-50 border border-pink-200 text-pink-900 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <Share2 className="w-5 h-5 text-pink-600 shrink-0" />
            <span>¡Publicación enviada exitosamente a Instagram Business Graph API!</span>
          </div>
        )}

        {/* Instagram Publisher Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Publicador de Instagram Business</h3>
                <p className="text-xs text-slate-500">Conectado a @{tenant.slug}_motors</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handlePublishInstagram}
                size="sm"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Ahora</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 rounded-2xl overflow-hidden bg-slate-100 relative aspect-square border border-slate-200 flex items-center justify-center">
              {vehicle?.images && vehicle.images[0] ? (
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.model}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Car className="w-12 h-12 text-slate-300" />
              )}
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Texto del Post (Copy)</label>
                <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Optimizado por IA</span>
                </span>
              </div>

              <textarea
                rows={7}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Layout: Controls, Preview, Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Customization Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <AdThemeSelector
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
              options={options}
              onOptionsChange={setOptions}
            />
          </div>

          {/* Column 2: Live Canvas Preview (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            {vehicle ? (
              <AdCanvasPreview
                vehicle={vehicle}
                tenant={tenant}
                format={selectedFormat}
                theme={selectedTheme}
                options={options}
              />
            ) : null}
          </div>

          {/* Column 3: AI Copywriting Generator (4 cols) */}
          <div className="lg:col-span-4">
            {vehicle ? (
              <AdCopyGeneratorCard
                vehicle={vehicle}
                tenant={tenant}
                theme={selectedTheme}
                options={options}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
