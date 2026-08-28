import React from "react";
import { Vehicle, Tenant } from "@/types";
import { AdFormat, AdTheme, AdCopyOptions } from "@/lib/marketing/ad-copy-generator";
import { formatCLP, calculateLoanQuote } from "@/lib/chilean-utils/financing";
import { ShieldCheck, Flame, Sparkles, MessageCircle, Star } from "lucide-react";

interface AdCanvasPreviewProps {
  vehicle: Vehicle;
  tenant: Tenant;
  format: AdFormat;
  theme: AdTheme;
  options: AdCopyOptions;
}

export function AdCanvasPreview({
  vehicle,
  tenant,
  format,
  theme,
  options,
}: AdCanvasPreviewProps) {
  const price = vehicle.priceFinanced || vehicle.priceCash;
  const downPayment = Math.round(price * 0.2);
  const quote = calculateLoanQuote({
    vehiclePrice: price,
    downPayment,
    termMonths: 48,
  });

  // Calculate Aspect Ratio container
  let aspectClass = "aspect-square max-w-[440px]"; // 1:1 Feed
  if (format === "STORY_VERTICAL") {
    aspectClass = "aspect-9/16 max-w-[340px]"; // 9:16 Story
  } else if (format === "BANNER_LANDSCAPE") {
    aspectClass = "aspect-16/9 max-w-[560px]"; // 16:9 Banner
  }

  // Theme Styles
  let themeBg = "bg-slate-950 text-white";
  let accentColor = "text-amber-400";
  let badgeGradient = "from-amber-500 to-yellow-600";

  if (theme === "CORPORATE") {
    themeBg = "bg-slate-900 text-white";
    accentColor = "text-blue-400";
    badgeGradient = "from-blue-600 to-indigo-600";
  } else if (theme === "FLASH_SALE") {
    themeBg = "bg-zinc-950 text-white";
    accentColor = "text-rose-400";
    badgeGradient = "from-rose-600 to-red-600";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
      <div
        id="ad-creative-canvas"
        className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 ${themeBg} flex flex-col justify-between select-none`}
      >
        {/* Main Background Car Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={vehicle.images[0] || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80"}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-extrabold text-xs tracking-tight text-white">{tenant.name}</span>
          </div>

          {theme === "FLASH_SALE" ? (
            <div className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg animate-pulse">
              <Flame className="w-3 h-3 fill-current" /> Bono F&I Activo
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
              {vehicle.year} • {vehicle.mileage.toLocaleString("es-CL")} KM
            </div>
          )}
        </div>

        {/* Center / Highlights */}
        {options.highlightWarranty && (
          <div className="relative z-10 px-4">
            <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${badgeGradient} text-white text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-xl`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seminuevo Certificado • Garantía 6 Meses</span>
            </div>
          </div>
        )}

        {/* Bottom Specs & Price Box */}
        <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-8">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {vehicle.transmission} • {vehicle.fuelType}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {vehicle.brand} {vehicle.model}
            </h2>
            <div className="text-xs text-slate-300 line-clamp-1">{vehicle.version}</div>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-800 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Precio Contado</span>
              <span className={`text-lg font-black ${accentColor}`}>
                {formatCLP(vehicle.priceCash)}
              </span>
            </div>

            {options.includeFinancing && (
              <div className="border-l border-slate-700 pl-3 text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">Cuota Mensual</span>
                <span className="text-sm font-black text-emerald-400">
                  {formatCLP(quote.monthlyPayment)} / mes
                </span>
                <span className="text-[9px] text-slate-400 block">(Pie 20% · 48 cuotas)</span>
              </div>
            )}
          </div>

          {/* Call to Action Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: {tenant.whatsapp}</span>
            </div>
            <span className="text-[10px] text-slate-400">{tenant.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
