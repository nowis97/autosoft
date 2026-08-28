import React from "react";
import { TenantSubscription } from "@/types";
import { Car, Camera, MessageSquare, Users } from "lucide-react";

interface UsageMetricsCardProps {
  subscription: TenantSubscription;
  vehiclesCount: number;
  usersCount: number;
}

export function UsageMetricsCard({
  subscription,
  vehiclesCount,
  usersCount,
}: UsageMetricsCardProps) {
  const vehiclePct = Math.min(100, Math.round((vehiclesCount / subscription.maxVehicles) * 100));
  const photoPct = Math.min(100, Math.round((subscription.aiPhotoCreditsUsed / subscription.aiPhotoCreditsMonthly) * 100));
  const copilotPct = Math.min(100, Math.round((subscription.aiCopilotChatsUsed / subscription.aiCopilotChatsMonthly) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span>Consumo de Recursos & Cuotas del Plan {subscription.tier}</span>
        </h3>
        <span className="text-xs text-slate-400 font-semibold">
          Próxima renovación: {new Date(subscription.nextBillingDate).toLocaleDateString("es-CL")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Vehicles Quota */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-600" />
              <span>Vehículos en Inventario</span>
            </span>
            <span className="font-black text-slate-900">
              {vehiclesCount} / {subscription.maxVehicles >= 9999 ? "Ilimitado" : subscription.maxVehicles}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${vehiclePct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">{vehiclePct}% de la capacidad utilizada</div>
        </div>

        {/* AI Photo Studio Quota */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Fotos con IA Estudio</span>
            </span>
            <span className="font-black text-slate-900">
              {subscription.aiPhotoCreditsUsed} / {subscription.aiPhotoCreditsMonthly}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${photoPct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">{subscription.aiPhotoCreditsMonthly - subscription.aiPhotoCreditsUsed} fotos disponibles este mes</div>
        </div>

        {/* AI WhatsApp Copilot Quota */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Conversaciones WhatsApp IA</span>
            </span>
            <span className="font-black text-slate-900">
              {subscription.aiCopilotChatsUsed} / {subscription.aiCopilotChatsMonthly}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${copilotPct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">{copilotPct}% consumido con IA autónoma</div>
        </div>
      </div>
    </div>
  );
}
