import React from "react";
import { Tenant } from "@/types";
import { ShieldCheck, BadgeCheck, Zap } from "lucide-react";

interface StorefrontHeroProps {
  tenant: Tenant;
  totalStock: number;
}

export function StorefrontHero({ tenant, totalStock }: StorefrontHeroProps) {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden py-12 sm:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
        style={{
          backgroundImage: `url(${tenant.bannerUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80"})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-semibold backdrop-blur-md">
          <SparklesIcon className="w-3.5 h-3.5" />
          {totalStock} Vehículos Disponibles para Entrega Inmediata
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
          Encuentra tu próximo auto con financiamiento y garantía
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Revisados mecánicamente, documentación al día y opciones de crédito automotriz con hasta 60 meses de plazo.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Garantía Mecánica Incluida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-blue-400" />
            <span>Recibimos tu Auto en Parte de Pago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Pre-Aprobación de Crédito en 2 Horas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
