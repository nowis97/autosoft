import React from "react";
import { Sparkles, Check } from "lucide-react";

export interface ShowroomPreset {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  lightingType: "Cenital Brillante" | "Luz Suave Estudio" | "Urbano Difuso" | "Original";
}

export const SHOWROOM_PRESETS: ShowroomPreset[] = [
  {
    id: "showroom-premium",
    name: "Showroom Premium Dealer",
    description: "Concesionario moderno con piso epóxico brillante, luces LED y muro corporativo.",
    previewUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
    lightingType: "Cenital Brillante",
  },
  {
    id: "studio-minimalist",
    name: "Estudio Gris Infinito",
    description: "Ciclorama neutro de estudio automotriz profesional con sombra de suelo realista.",
    previewUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    lightingType: "Luz Suave Estudio",
  },
  {
    id: "urban-modern",
    name: "Urbano Arquitectónico",
    description: "Fondo contemporáneo con desenfoque de lente cinematográfico (bokeh).",
    previewUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
    lightingType: "Urbano Difuso",
  },
  {
    id: "original",
    name: "Fondo Original Sin Cambios",
    description: "Mantiene la fotografía original tal como fue capturada en el patio.",
    previewUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80",
    lightingType: "Original",
  },
];

interface VirtualShowroomSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
}

export function VirtualShowroomSelector({
  selectedPresetId,
  onSelectPreset,
}: VirtualShowroomSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Showroom Virtual & Reemplazo de Fondo IA
          </h3>
          <p className="text-[11px] text-slate-400">
            Segmenta automáticamente el auto y reemplaza el fondo por un estudio profesional
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SHOWROOM_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex gap-3 items-center ${
                isSelected
                  ? "border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                <img src={preset.previewUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{preset.name}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {preset.description}
                </div>
                <div className="text-[10px] font-semibold text-purple-700 mt-1">
                  💡 Iluminación: {preset.lightingType}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
