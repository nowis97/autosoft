"use client";

import React from "react";
import Link from "next/link";
import { Tenant } from "@/types";
import { CarFront, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorefrontHeaderProps {
  tenant: Tenant;
}

export function StorefrontHeader({ tenant }: StorefrontHeaderProps) {
  const cleanPhone = tenant.whatsapp.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20consultar%20por%20su%20catálogo%20de%20vehículos`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{tenant.address}, {tenant.city}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>RUT: {tenant.rut}</span>
            <span>Horario: Lun - Sáb 09:30 a 19:00 hrs</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
        <Link href={`/site/${tenant.slug}`} className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-10 object-cover rounded-lg border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <CarFront className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="font-extrabold text-lg text-slate-900 leading-none">{tenant.name}</div>
            <div className="text-xs text-slate-500 font-medium">{tenant.tagline || "Seminuevos certificados"}</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href={`/site/${tenant.slug}/trade-in`}>
            <Button variant="outline" size="sm" className="hidden md:inline-flex font-semibold">
              Entrega tu Auto en Parte de Pago
            </Button>
          </Link>

          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm" className="gap-1.5 font-bold shadow-xs">
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
