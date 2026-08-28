import React, { useState } from "react";
import { Vehicle, Tenant } from "@/types";
import { generateAdCopy, AdTheme, AdCopyOptions } from "@/lib/marketing/ad-copy-generator";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, MessageSquare, Sparkles, Share2 } from "lucide-react";

interface AdCopyGeneratorCardProps {
  vehicle: Vehicle;
  tenant: Tenant;
  theme: AdTheme;
  options: AdCopyOptions;
}

export function AdCopyGeneratorCard({
  vehicle,
  tenant,
  theme,
  options,
}: AdCopyGeneratorCardProps) {
  const [copied, setCopied] = useState(false);
  const copyText = generateAdCopy(vehicle, tenant, theme, options);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(copyText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-xs">
            Copy Publicitario con IA (Listo para Redes Sociales)
          </span>
        </div>

        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
          Optimizado con Emojis
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={10}
          readOnly
          value={copyText}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono leading-relaxed resize-none focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-[11px] text-slate-400">
          {copied ? "✅ ¡Texto copiado al portapapeles!" : "Copia y pega directo en Instagram o Facebook Ads"}
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs font-bold gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado" : "Copiar Copy"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleShareWhatsApp}
            className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar a Vendedores</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
