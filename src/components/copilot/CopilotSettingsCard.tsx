import React, { useState } from "react";
import { Tenant } from "@/types";
import { Button } from "@/components/ui/button";
import { Sliders, Save, CheckCircle2 } from "lucide-react";

interface CopilotSettingsCardProps {
  tenant: Tenant;
}

export function CopilotSettingsCard({ tenant }: CopilotSettingsCardProps) {
  const [tone, setTone] = useState<"COMERCIAL" | "FORMAL" | "AMIGABLE">("COMERCIAL");
  const [active247, setActive247] = useState(true);
  const [autoSimulateCredit, setAutoSimulateCredit] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Configuración & Tono del Copiloto IA
          </h3>
          <p className="text-[11px] text-slate-400">
            Personaliza el comportamiento conversacional para {tenant.name}
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuración de IA actualizada y activa en WhatsApp.</span>
        </div>
      )}

      <div className="space-y-3 text-xs">
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">Tono Conversacional</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "COMERCIAL", label: "🎯 Comercial & Cierre", desc: "Enfocado en agendar visitas y crédito" },
              { id: "FORMAL", label: "👔 Ejecutivo Formal", desc: "Lenguaje formal y protocolar" },
              { id: "AMIGABLE", label: "🤝 Cercano & Amable", desc: "Tono relajado y empático" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  tone === t.id
                    ? "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-bold text-slate-900">Respuesta Activa 24/7 (After-Hours)</div>
              <div className="text-[11px] text-slate-500">Responde automáticamente noches y fines de semana</div>
            </div>
            <input
              type="checkbox"
              checked={active247}
              onChange={(e) => setActive247(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-bold text-slate-900">Simulación Automática de Cuota F&I</div>
              <div className="text-[11px] text-slate-500">Calcula cuota estimada al detectar monto de pie</div>
            </div>
            <input
              type="checkbox"
              checked={autoSimulateCredit}
              onChange={(e) => setAutoSimulateCredit(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <Button onClick={handleSave} className="w-full font-bold text-xs gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4" />
          <span>Guardar Reglas de Negocio</span>
        </Button>
      </div>
    </div>
  );
}
