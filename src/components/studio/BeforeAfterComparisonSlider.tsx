import React, { useState } from "react";
import { Tenant } from "@/types";
import { BrandingOptions } from "./BrandingOverlayControls";
import { Sparkles, ShieldCheck } from "lucide-react";

interface BeforeAfterComparisonSliderProps {
  originalImage: string;
  presetId: string;
  brandingOptions: BrandingOptions;
  tenant: Tenant;
}

export function BeforeAfterComparisonSlider({
  originalImage,
  presetId,
  brandingOptions,
  tenant,
}: BeforeAfterComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  // Filter styles simulating virtual showroom studio lighting
  const getProcessedFilterStyle = () => {
    if (presetId === "showroom-premium") {
      return "contrast(115%) brightness(105%) saturate(110%)";
    }
    if (presetId === "studio-minimalist") {
      return "contrast(110%) brightness(108%) saturate(100%)";
    }
    if (presetId === "urban-modern") {
      return "contrast(120%) brightness(102%) saturate(115%)";
    }
    return "none";
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 space-y-3 p-4">
      <div className="flex items-center justify-between text-xs text-white px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-bold">Vista Previa en Vivo & Comparador</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Arrastra el deslizador para comparar <strong>Antes vs Después</strong>
        </div>
      </div>

      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-950 select-none">
        {/* Processed (After) Image */}
        <img
          src={originalImage}
          alt="Procesada"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: getProcessedFilterStyle() }}
        />

        {/* Showroom Virtual overlay simulation */}
        {presetId !== "original" && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
        )}

        {/* Watermark Logo */}
        {brandingOptions.showWatermarkLogo && (
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{tenant.name}</span>
          </div>
        )}

        {/* Commercial Badge */}
        {brandingOptions.selectedBadge !== "NONE" && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-3.5 py-1.5 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {brandingOptions.selectedBadge === "GARANTIA" && "Garantía 6 Meses"}
            {brandingOptions.selectedBadge === "SEMINUEVO" && "Seminuevo Certificado"}
            {brandingOptions.selectedBadge === "BONO_CREDITO" && "Bono Crédito $1.000.000"}
            {brandingOptions.selectedBadge === "UNICO_DUENO" && "Único Dueño"}
          </div>
        )}

        {/* Custom Dealer License Plate Simulation */}
        {brandingOptions.showCustomPlate && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white border-2 border-slate-400 px-6 py-1.5 rounded-md font-mono font-black text-xs tracking-widest shadow-2xl uppercase">
            {optionsTextOrDealer(brandingOptions.plateText, tenant.name)}
          </div>
        )}

        {/* Original (Before) Image Clip */}
        <div
          className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalImage}
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            Foto Original Cruda
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs pointer-events-none">
            ↔
          </div>
        </div>

        {/* Interactive range input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1">
        <span>← Foto Original en Patio</span>
        <span className="text-purple-400 font-bold">Showroom Virtual IA + Branding →</span>
      </div>
    </div>
  );
}

function optionsTextOrDealer(text?: string, fallback = "DEALER") {
  return text && text.trim() ? text.toUpperCase() : fallback.toUpperCase();
}
