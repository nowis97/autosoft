import React from "react";
import { Tenant } from "@/types";
import { CarFront, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";

interface StorefrontFooterProps {
  tenant: Tenant;
}

export function StorefrontFooter({ tenant }: StorefrontFooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <CarFront className="w-5 h-5 text-blue-500" />
            <span>{tenant.name}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {tenant.tagline || "Tu automotora de confianza en Santiago con los mejores seminuevos garantizados."}
          </p>
          <div className="text-slate-500">RUT: {tenant.rut}</div>
        </div>

        <div className="space-y-3">
          <div className="text-white font-bold text-sm">Contacto Directo</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{tenant.address}, {tenant.city}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-white font-bold text-sm">Servicios Automotrices</div>
          <ul className="space-y-1.5">
            <li>• Financiamiento Automotriz Convencional e Inteligente</li>
            <li>• Recepción de Vehículos en Parte de Pago</li>
            <li>• Transferencia Notarial y CAV Inmediata</li>
            <li>• Seguros Vehiculares y Asistencia en Ruta</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-white font-bold text-sm">Seguridad & Confianza</div>
          <p className="text-slate-400 leading-relaxed">
            Todos nuestros vehículos son inspeccionados en más de 120 puntos mecánicos y cuentan con informe de multas y dominio al día.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Transferencia Garantizada</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div>© {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.</div>
        <div className="text-[11px] mt-2 sm:mt-0 text-slate-500">
          Powered by <strong className="text-slate-400">Autosoft 360</strong>
        </div>
      </div>
    </footer>
  );
}
