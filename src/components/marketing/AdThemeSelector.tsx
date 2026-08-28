import React from "react";
import { AdFormat, AdTheme, AdCopyOptions } from "@/lib/marketing/ad-copy-generator";
import { Layout, Smartphone, Monitor, Sparkles, Building2, Flame } from "lucide-react";

interface AdThemeSelectorProps {
  selectedFormat: AdFormat;
  onSelectFormat: (format: AdFormat) => void;
  selectedTheme: AdTheme;
  onSelectTheme: (theme: AdTheme) => void;
  options: AdCopyOptions;
  onOptionsChange: (options: AdCopyOptions) => void;
}

export function AdThemeSelector({
  selectedFormat,
  onSelectFormat,
  selectedTheme,
  onSelectTheme,
  options,
  onOptionsChange,
}: AdThemeSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div>
        <label className="font-bold text-slate-800 text-xs block mb-2">1. Formato Publicitario</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "FEED_SQUARE", label: "Feed 1:1", desc: "Instagram & Facebook Post", icon: Layout },
            { id: "STORY_VERTICAL", label: "Story 9:16", desc: "Stories / Reels / TikTok", icon: Smartphone },
            { id: "BANNER_LANDSCAPE", label: "Banner 16:9", desc: "Cabeceras & Portales", icon: Monitor },
          ].map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFormat === f.id;

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectFormat(f.id as AdFormat)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <div className="font-bold text-xs">{f.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className="font-bold text-slate-800 text-xs block mb-2">2. Estilo Visual de la Pieza</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "DARK_LUXURY", label: "Dark Luxury", desc: "Fondo oscuro y acentos dorados", icon: Sparkles },
            { id: "CORPORATE", label: "Corporate Dealer", desc: "Identidad limpia oficial", icon: Building2 },
            { id: "FLASH_SALE", label: "Oferta Flash", desc: "Cinta roja y bono destacado", icon: Flame },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTheme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTheme(t.id as AdTheme)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-purple-50 border-purple-600 text-purple-900 font-bold ring-1 ring-purple-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-purple-600" : "text-slate-400"}`} />
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
        <label className="font-bold text-slate-800 block mb-1">3. Elementos a Destacar en el Diseño</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeFinancing}
            onChange={(e) => onOptionsChange({ ...options, includeFinancing: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-slate-700">Incluir Cuota Mensual y Pie Sugerido (20%)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.highlightWarranty}
            onChange={(e) => onOptionsChange({ ...options, highlightWarranty: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-slate-700">Insignia "Garantía 6 Meses / Seminuevo Certificado"</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeTradeIn}
            onChange={(e) => onOptionsChange({ ...options, includeTradeIn: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-slate-700">Badge "Aceptamos Auto en Parte de Pago"</span>
        </label>
      </div>
    </div>
  );
}
