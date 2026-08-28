import React from "react";
import Link from "next/link";
import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { PriceTag } from "@/components/shared/PriceTag";
import { Fuel, Gauge, GitFork } from "lucide-react";

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
    ? `/site/${tenantSlug}/vehicles/${vehicle.id}`
    : `/app/inventory/${vehicle.id}/edit`;

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
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={coverImage}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <Badge variant={statusVariant} className="font-semibold shadow-xs">
              {statusLabels[vehicle.status]}
            </Badge>
          </div>

          <div className="absolute top-2.5 right-2.5">
            <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />
          </div>

          {vehicle.daysInStock !== undefined && vehicle.status === "AVAILABLE" && (
            <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
              {vehicle.daysInStock === 0 ? "Ingresó hoy" : `${vehicle.daysInStock} días en stock`}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {vehicle.brand}
            </span>
            <span className="text-xs font-bold text-slate-500">{vehicle.year}</span>
          </div>

          <Link href={href}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {vehicle.model} {vehicle.version}
            </h3>
          </Link>

          <div className="flex items-center gap-3 my-3 text-xs text-slate-500">
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

      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
        <PriceTag
          priceCash={vehicle.priceCash}
          priceFinanced={vehicle.priceFinanced}
          showMonthlyQuote={true}
        />
        <Link href={href}>
          <span className="text-xs font-bold text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline">
            Ver Ficha →
          </span>
        </Link>
      </div>
    </div>
  );
}
