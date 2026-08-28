import React from "react";
import { ShieldCheck, Tag, Sparkles, Building2 } from "lucide-react";
import { Tenant } from "@/types";

export interface BrandingOptions {
  showWatermarkLogo: boolean;
  showCustomPlate: boolean;
  plateText: string;
  selectedBadge: "NONE" | "GARANTIA" | "SEMINUEVO" | "BONO_CREDITO" | "UNICO_DUENO";
}

interface BrandingOverlayControlsProps {
  tenant: Tenant;
  options: BrandingOptions;
  onChange: (options: BrandingOptions) => void;
}

export function BrandingOverlayControls({
  tenant,
  options,
  onChange,
}: BrandingOverlayControlsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Auto-Branding & Placa Institucional
          </h3>
          <p className="text-[11px] text-slate-400">
            Aplica automáticamente la identidad corporativa de {tenant.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={options.showWatermarkLogo}
            onChange={(e) =>
              onChange({ ...options, showWatermarkLogo: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <div>
            <div className="font-bold text-slate-900">Marca de Agua con Logo Oficial</div>
            <div className="text-slate-500 text-[11px]">
              Inserta el isotipo oficial en la esquina superior derecha con sombra sutil.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={options.showCustomPlate}
            onChange={(e) =>
              onChange({ ...options, showCustomPlate: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <div>
            <div className="font-bold text-slate-900">Placa Institucional en Patente</div>
            <div className="text-slate-500 text-[11px]">
              Cubre la patente física con el marco oficial: <strong>{options.plateText || tenant.name}</strong>
            </div>
          </div>
        </label>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>Badge Comercial Destacado (Cintillo en Foto de Portada)</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "NONE", label: "Sin Badge" },
            { id: "GARANTIA", label: "🛡️ Garantía 6 Meses" },
            { id: "SEMINUEVO", label: "✨ Seminuevo Certificado" },
            { id: "BONO_CREDITO", label: "💰 Bono Financiamiento" },
            { id: "UNICO_DUENO", label: "🚗 Único Dueño" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onChange({ ...options, selectedBadge: b.id as any })}
              className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                options.selectedBadge === b.id
                  ? "bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
