import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { PriceTag } from "@/components/shared/PriceTag";
import { Fuel, Gauge, GitFork, ArrowUpRight } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  publicView?: boolean;
  tenantSlug?: string;
}

export function VehicleCard({ vehicle, publicView = false, tenantSlug = "auto-oriente" }: VehicleCardProps) {
  const coverImage =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";

  const href = publicView
    ? "/site/" + tenantSlug + "/vehicles/" + vehicle.id
    : "/app/inventory/" + vehicle.id + "/edit";

  const statusVariant = {
    AVAILABLE: "available",
    RESERVED: "reserved",
    SOLD: "sold",
    IN_MAINTENANCE: "maintenance",
  }[vehicle.status] as "available" | "reserved" | "sold" | "maintenance";

  const statusLabels = {
    AVAILABLE: "Disponible",
    RESERVED: "Reservado",
    SOLD: "Vendido",
    IN_MAINTENANCE: "En Taller",
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={coverImage}
            alt={vehicle.brand + " " + vehicle.model + " " + vehicle.year}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <Badge variant={statusVariant} className="font-bold shadow-xs">
              {statusLabels[vehicle.status]}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />
          </div>

          {vehicle.daysInStock !== undefined && vehicle.status === "AVAILABLE" && (
            <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
              {vehicle.daysInStock === 0 ? "Ingresó hoy" : vehicle.daysInStock + " días en stock"}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
              {vehicle.brand}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {vehicle.year}
            </span>
          </div>

          <Link href={href}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {vehicle.model} {vehicle.version}
            </h3>
          </Link>

          <div className="flex items-center gap-3 my-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.mileage.toLocaleString("es-CL")} km</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.transmission.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <PriceTag
          priceCash={vehicle.priceCash}
          priceFinanced={vehicle.priceFinanced}
          size="sm"
        />

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all"
        >
          <span>{publicView ? "Ver Ficha" : "Editar"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
