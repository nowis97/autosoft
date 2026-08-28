"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { CreditSimulatorWidget } from "@/components/financing/CreditSimulatorWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Gauge,
  GitFork,
  Fuel,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  FileCheck,
} from "lucide-react";

export default function VehicleDetailPage() {
  const params = useParams();
  const tenantSlug = (params?.tenantSlug as string) || "auto-oriente";
  const vehicleId = params?.id as string;

  const tenant = store.getTenant(tenantSlug);
  const vehicle = store.getVehicleById(vehicleId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Vehículo no encontrado</h2>
        <p className="text-sm text-slate-500">Este auto puede haber sido vendido o retirado de publicación.</p>
        <Link href={`/site/${tenantSlug}`}>
          <Button variant="outline">Ver catálogo completo</Button>
        </Link>
      </div>
    );
  }

  const cleanPhone = tenant.whatsapp.replace(/[^0-9]/g, "");
  const waMessage = `Hola, me interesa el vehículo *${vehicle.brand} ${vehicle.model} ${vehicle.year}* (Patente: ${vehicle.licensePlate}) publicado en ${formatCLP(vehicle.priceCash)}. ¿Está disponible para ver o coordinar prueba de manejo?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Link
        href={`/site/${tenantSlug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al catálogo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
            <img
              src={vehicle.images[activeImageIndex] || vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3.5 right-3.5">
              <LicensePlateBadge plate={vehicle.licensePlate} size="md" />
            </div>
            <div className="absolute top-3.5 left-3.5">
              <Badge variant="available" className="font-bold text-xs shadow-xs">
                Disponible para entrega
              </Badge>
            </div>
          </div>

          {vehicle.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-600/30"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 mt-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Ficha Técnica del Vehículo
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Año
                </span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.year}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" /> Kilometraje
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {vehicle.mileage.toLocaleString("es-CL")} km
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" /> Transmisión
                </span>
                <span className="font-bold text-slate-900 text-sm capitalize">
                  {vehicle.transmission.toLowerCase()}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5" /> Combustible
                </span>
                <span className="font-bold text-slate-900 text-sm capitalize">
                  {vehicle.fuelType.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Descripción & Equipamiento
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {vehicle.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {vehicle.model}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{vehicle.version}</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Precio Contado</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                {formatCLP(vehicle.priceCash)}
              </div>
              {vehicle.priceFinanced && (
                <div className="text-xs font-semibold text-emerald-600 mt-1">
                  Precio con financiamiento: <strong>{formatCLP(vehicle.priceFinanced)}</strong>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button variant="whatsapp" className="w-full h-12 font-bold text-sm gap-2 shadow-md">
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Consultar por WhatsApp</span>
                </Button>
              </a>

              <Link href={`/site/${tenantSlug}/trade-in`} className="block w-full">
                <Button variant="outline" className="w-full h-11 font-semibold text-xs gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Tasación: Recibimos tu auto en parte de pago</span>
                </Button>
              </Link>
            </div>
          </div>

          <CreditSimulatorWidget vehicle={vehicle} />

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compra 100% Segura en {tenant.name}</span>
            </div>
            <p className="leading-relaxed">
              • Transferencia notarial digital inmediata ante Registro Civil.<br />
              • Autofact con informe libre de multas, prendas y embargos.<br />
              • Posibilidad de contratar seguro automotriz en el mismo acto de entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
