"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { Vehicle, VehiclePipelineStage } from "@/types";
import {
  Car,
  Camera,
  Wrench,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";

const STAGES: { key: VehiclePipelineStage; label: string; color: string }[] = [
  { key: "REVISION_MECANICA", label: "Revisión Mecánica", color: "bg-slate-100 text-slate-700" },
  { key: "PREPARACION", label: "Preparación", color: "bg-rose-100 text-rose-700" },
  { key: "LISTO_FOTO", label: "Listo para la foto", color: "bg-amber-100 text-amber-700" },
  { key: "PUBLICADO", label: "Publicado", color: "bg-blue-100 text-blue-700" },
  { key: "RESERVADO", label: "Reservado", color: "bg-purple-100 text-purple-700" },
  { key: "VENDIDO", label: "Vendido", color: "bg-emerald-100 text-emerald-700" },
  { key: "RETIRADO", label: "Retirado", color: "bg-slate-200 text-slate-600" },
];

export function VehiclePipelineKanban() {
  const [vehicles, setVehicles] = useState(store.getVehicles());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setVehicles(store.getVehicles());
    });
    return unsub;
  }, []);

  const moveStage = (vehicleId: string, currentStage: VehiclePipelineStage, direction: 1 | -1) => {
    const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      store.updateVehiclePipelineStage(vehicleId, STAGES[newIndex].key);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {STAGES.map((stage) => {
        const stageVehicles = vehicles.filter((v) => {
          const vStage = v.pipelineStage || (v.status === "SOLD" ? "VENDIDO" : v.status === "RESERVED" ? "RESERVADO" : v.status === "IN_MAINTENANCE" ? "PREPARACION" : "PUBLICADO");
          return vStage === stage.key;
        });

        return (
          <div
            key={stage.key}
            className="w-72 shrink-0 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  stage.key === 'PUBLICADO' ? 'bg-blue-500' :
                  stage.key === 'VENDIDO' ? 'bg-emerald-500' :
                  stage.key === 'PREPARACION' ? 'bg-rose-500' :
                  stage.key === 'LISTO_FOTO' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <h4 className="font-bold text-slate-900 text-xs">{stage.label}</h4>
              </div>
              <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-[11px] flex items-center justify-center shadow-2xs">
                {stageVehicles.length}
              </span>
            </div>

            {/* Vehicle Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px] pr-1">
              {stageVehicles.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  No hay vehículos
                </div>
              ) : (
                stageVehicles.map((v) => {
                  const prepProgress = v.pipelineStage === "PREPARACION" ? 25 : 100;
                  return (
                    <div
                      key={v.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group relative"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-14 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                          {v.images && v.images[0] ? (
                            <Image
                              src={v.images[0]}
                              alt={v.model}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Car className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate">
                            {v.brand} {v.model}
                          </h5>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span>{v.year}</span>
                            <span>·</span>
                            <span className="font-bold text-slate-700 uppercase">{v.licensePlate}</span>
                            <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-[10px] font-semibold">
                              {v.daysInStock || 0}d
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Preparación progress bar */}
                      {stage.key === "PREPARACION" && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Avance Taller</span>
                            <span className="text-rose-600">{prepProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-rose-500 h-full rounded-full transition-all"
                              style={{ width: `${prepProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Card Footer & Stage shift actions */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                          {formatCLP(v.priceCash)}
                        </span>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {stage.key !== "REVISION_MECANICA" && (
                            <button
                              onClick={() => moveStage(v.id, (v.pipelineStage || 'REVISION_MECANICA'), -1)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600"
                              title="Mover a etapa anterior"
                            >
                              ←
                            </button>
                          )}
                          {stage.key !== "RETIRADO" && (
                            <button
                              onClick={() => moveStage(v.id, (v.pipelineStage || 'REVISION_MECANICA'), 1)}
                              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-2xs"
                              title="Mover a siguiente etapa"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
