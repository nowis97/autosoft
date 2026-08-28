import React from "react";
import { validateLicensePlate } from "@/lib/chilean-utils";
import { cn } from "@/lib/utils";

interface LicensePlateBadgeProps {
  plate: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LicensePlateBadge({ plate, className, size = "md" }: LicensePlateBadgeProps) {
  const { display, valid } = validateLicensePlate(plate);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs tracking-wider",
    md: "px-2.5 py-1 text-xs sm:text-sm tracking-widest",
    lg: "px-3.5 py-1.5 text-sm sm:text-base tracking-widest",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold uppercase rounded-md border-2 border-slate-700 bg-white text-slate-900 shadow-xs select-none",
        sizeClasses[size],
        !valid && "border-amber-500 text-amber-700 bg-amber-50",
        className
      )}
      title={valid ? "Patente Chilena Válida" : "Formato de Patente no estándar"}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 opacity-80" />
      {display}
    </div>
  );
}
