"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { AdThemeSelector } from "@/components/marketing/AdThemeSelector";
import { AdCanvasPreview } from "@/components/marketing/AdCanvasPreview";
import { AdCopyGeneratorCard } from "@/components/marketing/AdCopyGeneratorCard";
import { AdFormat, AdTheme, AdCopyOptions } from "@/lib/marketing/ad-copy-generator";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Megaphone, Download, Sparkles, CheckCircle2 } from "lucide-react";
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

  const handleDownloadHD = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Marketing & Generador de Anuncios en Redes Sociales"
        subtitle="Crea piezas gráficas de alto impacto (Feed 1:1, Stories 9:16) y copys publicitarios con IA en 1 clic"
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
              onClick={handleDownloadHD}
              className="font-bold text-xs gap-1.5 shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Creatividad HD</span>
            </Button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ¡Creatividad publicitaria generada en alta resolución lista para pautar en Meta Ads o publicar en Instagram!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ad Preview Canvas Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Previsualización en Vivo de la Pieza Gráfica</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Formato: {selectedFormat === "FEED_SQUARE" ? "Post 1:1" : selectedFormat === "STORY_VERTICAL" ? "Story 9:16" : "Banner 16:9"}
              </span>
            </div>

            {vehicle && (
              <AdCanvasPreview
                vehicle={vehicle}
                tenant={tenant}
                format={selectedFormat}
                theme={selectedTheme}
                options={options}
              />
            )}
          </div>

          {/* Controls & Copy Generator Right */}
          <div className="lg:col-span-6 space-y-6">
            <AdThemeSelector
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
              options={options}
              onOptionsChange={setOptions}
            />

            {vehicle && (
              <AdCopyGeneratorCard
                vehicle={vehicle}
                tenant={tenant}
                theme={selectedTheme}
                options={options}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
