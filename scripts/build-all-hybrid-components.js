const fs = require('fs');
const path = require('path');

// 1. SalesApprovalDrawer.tsx
const salesApprovalDrawer = `"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { SaleApprovalRecord, CommissionBase, CommissionType } from "@/types";
import {
  X,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Car,
  User,
  CreditCard,
  Percent,
  Divide,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesApprovalDrawerProps {
  isOpen: boolean;
  approvalId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SalesApprovalDrawer({
  isOpen,
  approvalId,
  onClose,
  onSuccess,
}: SalesApprovalDrawerProps) {
  const [saleApprovals] = useState(store.getSaleApprovals());
  const [vehicles] = useState(store.getVehicles());
  const [users] = useState(store.getUsers());

  const currentApproval = approvalId
    ? store.getSaleApproval(approvalId)
    : saleApprovals.find((s) => s.status === "PENDING") || saleApprovals[0];

  const vehicle = currentApproval ? store.getVehicle(currentApproval.vehicleId) : vehicles[0];

  const [selectedSalesRep, setSelectedSalesRep] = useState(currentApproval?.salesRepUserId || users[1]?.id || "");
  const [commissionBase, setCommissionBase] = useState<CommissionBase>(currentApproval?.commissionRule.base || "TOTAL_VENTA");
  const [commissionType, setCommissionType] = useState<CommissionType>(currentApproval?.commissionRule.type || "PERCENTAGE");
  const [commissionValue, setCommissionValue] = useState<number>(currentApproval?.commissionRule.percentage || 1);
  const [splitEqually, setSplitEqually] = useState(false);

  if (!isOpen || !currentApproval) return null;

  const salePrice = currentApproval.salePriceCLP || 60000000;
  const acqCost = vehicle?.acquisitionCost || salePrice * 0.75;
  const estimatedMargin = Math.max(0, salePrice - acqCost);

  const baseAmount = commissionBase === "TOTAL_VENTA" ? salePrice : estimatedMargin;
  const calculatedCommission = commissionType === "PERCENTAGE"
    ? Math.round(baseAmount * (commissionValue / 100))
    : commissionValue;

  const handleApprove = () => {
    store.approveSale(currentApproval.id, 1043);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleReject = () => {
    store.rejectSale(currentApproval.id);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {vehicle ? \`\${vehicle.brand} \${vehicle.model} [\${vehicle.year}]\` : "Mercedes-Benz A45S AMG [2023]"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{vehicle?.licensePlate || "PPHJ66"}</span>
                  <span>·</span>
                  <span>{currentApproval.buyerName || "Cliente Comprador"}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    ● {currentApproval.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6 text-sm">
            {/* Venta details */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Detalles de Venta</span>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block">Precio de Venta</span>
                  <span className="text-lg font-extrabold text-slate-900 tabular-nums">{formatCLP(salePrice)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Método de pago</span>
                  <span className="text-sm font-bold text-slate-800 capitalize">{currentApproval.paymentMethod.toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Vendedor Asignado */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Vendedor Asignado</span>
              <select
                value={selectedSalesRep}
                onChange={(e) => setSelectedSalesRep(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Comisión del Vendedor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Comisión del Vendedor</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setCommissionType("PERCENTAGE")}
                    className={\`px-2 py-0.5 rounded-md \${commissionType === "PERCENTAGE" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}\`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setCommissionType("FIXED")}
                    className={\`px-2 py-0.5 rounded-md \${commissionType === "FIXED" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}\`}
                  >
                    $
                  </button>
                </div>
              </div>

              {/* Calcular comisión sobre: */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-medium">Calcular comisión sobre:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCommissionBase("TOTAL_VENTA")}
                    className={\`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all \${
                      commissionBase === "TOTAL_VENTA"
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }\`}
                  >
                    Total de la venta
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommissionBase("MARGEN_BRUTO")}
                    className={\`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all \${
                      commissionBase === "MARGEN_BRUTO"
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }\`}
                  >
                    Margen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">
                    {commissionType === "PERCENTAGE" ? "Porcentaje de Comisión (%)" : "Monto Fijo ($ CLP)"}
                  </label>
                  <input
                    type="number"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Monto Calculado</label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-extrabold text-emerald-600 tabular-nums">
                    {formatCLP(calculatedCommission)}
                  </div>
                </div>
              </div>

              {/* Dividir entre múltiples colaboradores */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={splitEqually}
                    onChange={(e) => setSplitEqually(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>Dividir entre múltiples colaboradores</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
          >
            ✕ Rechazar
          </button>
          <button
            onClick={handleApprove}
            className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aprobar Venta y Emitir DTE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'sales', 'SalesApprovalDrawer.tsx'), salesApprovalDrawer, 'utf8');
console.log('1. SalesApprovalDrawer written');

// 2. VehiclePipelineKanban.tsx
const vehiclePipelineKanban = `"use client";

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
                <span className={\`w-2.5 h-2.5 rounded-full \${
                  stage.key === 'PUBLICADO' ? 'bg-blue-500' :
                  stage.key === 'VENDIDO' ? 'bg-emerald-500' :
                  stage.key === 'PREPARACION' ? 'bg-rose-500' :
                  stage.key === 'LISTO_FOTO' ? 'bg-amber-500' : 'bg-slate-400'
                }\`} />
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
                              style={{ width: \`\${prepProgress}%\` }}
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
                              onClick={() => moveStage(v.id, stage.key, -1)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600"
                              title="Mover a etapa anterior"
                            >
                              ←
                            </button>
                          )}
                          {stage.key !== "RETIRADO" && (
                            <button
                              onClick={() => moveStage(v.id, stage.key, 1)}
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
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'inventory', 'VehiclePipelineKanban.tsx'), vehiclePipelineKanban, 'utf8');
console.log('2. VehiclePipelineKanban written');

// 3. VehicleIntakeModal.tsx
const vehicleIntakeModal = `"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { X, Sparkles, Car, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated?: (vehicleId: string) => void;
}

export function VehicleIntakeModal({ isOpen, onClose, onVehicleCreated }: VehicleIntakeModalProps) {
  const [plate, setPlate] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    if (!plate || plate.length < 5) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => {
      setAnalysisStep(2);
    }, 1000);

    setTimeout(() => {
      // Create new intake vehicle
      const newVeh = store.createVehicle({
        tenantId: "tenant-oriente-1",
        licensePlate: plate.toUpperCase(),
        brand: "Nissan",
        model: "X-Trail",
        version: "2.5 Sense CVT 4x2",
        year: 2022,
        mileage: 38000,
        transmission: "AUTOMATICA",
        fuelType: "BENCINA",
        bodyType: "SUV",
        color: "Blanco Perla",
        priceCash: 19990000,
        acquisitionCost: 16500000,
        status: "AVAILABLE",
        pipelineStage: "REVISION_MECANICA",
        description: "Ingreso asistido por IA mediante consulta de padrón y tasación fiscal.",
        features: ["Climatizador", "Cámara 360", "Frenado Autónomo"],
        images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"],
        publishedToWeb: false,
        publishedToMercadolibre: false,
        publishedToChileautos: false,
        publishedToYapo: false,
      });

      setIsAnalyzing(false);
      if (onVehicleCreated) onVehicleCreated(newVeh.id);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative overflow-hidden text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        {isAnalyzing ? (
          <div className="py-8 space-y-5">
            {/* 3D Orb AI Loading Visual */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 animate-spin blur-md opacity-70" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-inner flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Analizando con IA</h3>
              <p className="text-xs text-slate-500 font-medium">
                Buscando información de padrón para <strong className="text-slate-800">{plate.toUpperCase()}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping delay-75" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping delay-150" />
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Car className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Alta Rápida con IA</h3>
              <p className="text-xs text-slate-500">
                Ingresa la patente chilena para auto-completar especificaciones, año y tasación.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Patente Vehículo (ej. PPGH38)
              </label>
              <input
                type="text"
                placeholder="PPGH38"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full text-center text-2xl font-black tracking-widest uppercase bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleStartAnalysis}
              disabled={!plate || plate.length < 5}
              className="w-full py-6 text-sm font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-md gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Escanear y Autocompletar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'inventory', 'VehicleIntakeModal.tsx'), vehicleIntakeModal, 'utf8');
console.log('3. VehicleIntakeModal written');

// 4. TaskKanban.tsx
const taskKanban = `"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/store";
import { DealerTask, DealerTaskStatus, DealerTaskDepartment, DealerTaskPriority } from "@/types";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Car,
  Calendar,
  User,
  Filter,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS: { key: DealerTaskStatus; label: string; color: string }[] = [
  { key: "PENDIENTE", label: "Pendientes", color: "bg-blue-500" },
  { key: "EN_PROGRESO", label: "En Progreso", color: "bg-amber-500" },
  { key: "POR_APROBAR", label: "Por Aprobar", color: "bg-purple-500" },
  { key: "COMPLETADA", label: "Completadas", color: "bg-emerald-500" },
];

export function TaskKanban() {
  const [tasks, setTasks] = useState(store.getTasks());
  const [selectedDept, setSelectedDept] = useState<string>("TODAS");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<DealerTaskDepartment>("DOCUMENTACION");
  const [priority, setPriority] = useState<DealerTaskPriority>("MEDIA");
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTasks(store.getTasks());
    });
    return unsub;
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesDept = selectedDept === "TODAS" || t.department === selectedDept;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.vehiclePlate && t.vehiclePlate.toLowerCase().includes(search.toLowerCase())) ||
      (t.vehicleModel && t.vehicleModel.toLowerCase().includes(search.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const getDaysOverdue = (dueDate: string) => {
    const diffTime = Date.now() - new Date(dueDate).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    store.createTask({
      tenantId: "tenant-oriente-1",
      title,
      description,
      department,
      priority,
      status: "PENDIENTE",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      vehiclePlate: selectedVehiclePlate ? selectedVehiclePlate.toUpperCase() : undefined,
      vehicleModel: selectedVehiclePlate ? "Vehículo Seleccionado" : undefined,
    });

    setTitle("");
    setDescription("");
    setShowCreateModal(false);
  };

  const moveTaskStatus = (taskId: string, currentStatus: DealerTaskStatus, direction: 1 | -1) => {
    const currentIndex = COLUMNS.findIndex((c) => c.key === currentStatus);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      store.updateTask(taskId, { status: COLUMNS[nextIndex].key });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Buscar tareas por título o patente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODAS">Todas las áreas</option>
            <option value="DOCUMENTACION">Documentación</option>
            <option value="VENTA">Venta</option>
            <option value="TALLER">Taller</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          size="sm"
          className="gap-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={\`w-2.5 h-2.5 rounded-full \${col.color}\`} />
                  <h4 className="font-bold text-slate-900 text-sm">{col.label}</h4>
                </div>
                <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-medium">
                    Sin tareas en esta columna
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const overdueDays = getDaysOverdue(t.dueDate);
                    const isOverdue = overdueDays > 0 && t.status !== "COMPLETADA";

                    return (
                      <div
                        key={t.id}
                        className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
                      >
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={\`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase \${
                            t.priority === 'ALTA' ? 'bg-rose-100 text-rose-700' :
                            t.priority === 'MEDIA' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }\`}>
                            {t.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800">
                            {t.department}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs leading-snug">{t.title}</h5>
                          {t.description && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                              {t.description}
                            </p>
                          )}
                        </div>

                        {/* Vehicle Link Badge */}
                        {t.vehiclePlate && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-800">
                            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{t.vehicleModel || "Vehículo"}</span>
                            <span className="ml-auto font-black text-slate-900 uppercase">{t.vehiclePlate}</span>
                          </div>
                        )}

                        {/* Overdue alert indicator */}
                        {isOverdue && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Vencida hace {overdueDays}d</span>
                          </div>
                        )}

                        {/* Footer and Shift controls */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(t.dueDate).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {col.key !== "PENDIENTE" && (
                              <button
                                onClick={() => moveTaskStatus(t.id, col.key, -1)}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                                title="Anterior"
                              >
                                ←
                              </button>
                            )}
                            {col.key !== "COMPLETADA" && (
                              <button
                                onClick={() => moveTaskStatus(t.id, col.key, 1)}
                                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-xs"
                                title="Siguiente"
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

      {/* Modal Nueva Tarea */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg mb-4">Nueva Tarea Operativa</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-600 block mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Inspección pre compra"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Descripción / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre horarios o clientes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Área / Categoría</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as DealerTaskDepartment)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DOCUMENTACION">Documentación</option>
                    <option value="VENTA">Venta</option>
                    <option value="TALLER">Taller</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as DealerTaskPriority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Patente Asociada (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. LBDC80"
                  value={selectedVehiclePlate}
                  onChange={(e) => setSelectedVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Crear Tarea
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'tasks', 'TaskKanban.tsx'), taskKanban, 'utf8');
console.log('4. TaskKanban written');

// 5. src/app/app/tasks/page.tsx
const tasksPage = `"use client";

import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { TaskKanban } from "@/components/tasks/TaskKanban";

export default function TasksOverviewPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Gestión de Tareas Operativas"
        subtitle="Tablero Kanban de seguimiento por patente, vencimientos y áreas"
      />

      <main className="p-6 max-w-7xl w-full">
        <TaskKanban />
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'app', 'tasks', 'page.tsx'), tasksPage, 'utf8');
console.log('5. app/tasks/page.tsx written');

// 6. DocumentTemplateViewer.tsx
const documentTemplateViewer = `"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP, validateRUT } from "@/lib/chilean-utils";
import { ContractTemplateType, ContractFinancialAdjustment } from "@/types";
import {
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TEMPLATES: { key: ContractTemplateType; label: string }[] = [
  { key: "NOTA_VENTA", label: "Nota de Venta" },
  { key: "NOTA_COMPRA", label: "Nota de Compra" },
  { key: "CONSIGNACION", label: "Consignación" },
  { key: "RESERVACION", label: "Reservación" },
  { key: "COTIZACION", label: "Cotización" },
  { key: "CIERRE_NEGOCIO", label: "Cierre de Negocio" },
  { key: "FICHA_TECNICA", label: "Ficha Técnica" },
];

export function DocumentTemplateViewer() {
  const [activeTemplate, setActiveTemplate] = useState<ContractTemplateType>("NOTA_VENTA");
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  // Client info state
  const [clientName, setClientName] = useState("Cliente Ejemplo");
  const [clientRut, setClientRut] = useState("12.345.678-9");
  const [clientPhone, setClientPhone] = useState("+56 9 1234 5678");
  const [clientEmail, setClientEmail] = useState("cliente@ejemplo.com");
  const [clientAddress, setClientAddress] = useState("Calle Ejemplo 123, Ciudad");

  // Financial Line Items
  const [adjustment, setAdjustment] = useState<ContractFinancialAdjustment>({
    basePriceCLP: selectedVehicle?.priceCash || 16000000,
    priceAdjustmentCLP: -1000000,
    gestoriaFeeCLP: 50000,
    additionalInsuranceCLP: 100000,
    accessoriesCLP: 50000,
    totalPriceCLP: 15200000,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculateTotal = (base: number, adj: number, gest: number, ins: number, acc: number) => {
    return base + adj + gest + ins + acc;
  };

  const handleUpdatePrice = (field: keyof ContractFinancialAdjustment, val: number) => {
    const updated = { ...adjustment, [field]: val };
    updated.totalPriceCLP = calculateTotal(
      updated.basePriceCLP,
      updated.priceAdjustmentCLP,
      updated.gestoriaFeeCLP,
      updated.additionalInsuranceCLP,
      updated.accessoriesCLP
    );
    setAdjustment(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Templates Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.key}
              onClick={() => setActiveTemplate(tpl.key)}
              className={\`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap \${
                activeTemplate === tpl.key
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }\`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleSave} size="sm" className="gap-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Guardar cambios</span>
          </Button>
          <Button onClick={() => window.print()} variant="outline" size="sm" className="gap-1.5 text-xs font-bold rounded-xl">
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Documento y términos legales guardados correctamente.</span>
        </div>
      )}

      {/* Document Workspace (Interactive Letterhead Preview) */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-lg max-w-4xl mx-auto space-y-8 text-slate-800 font-sans">
        {/* Dealership & Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{tenant.name}</h2>
            <p className="text-xs text-slate-500 font-semibold">RUT: {tenant.rut || "76.452.189-K"}</p>
            <p className="text-xs text-slate-500">Email: {tenant.email || "contacto@dealership.cl"}</p>
            <p className="text-xs text-slate-500">Tel: {tenant.phone || "+56 9 8765 4321"} · Web: {tenant.customDomain || \`\${tenant.slug}.autosoft.cl\`}</p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
              {TEMPLATES.find((t) => t.key === activeTemplate)?.label}
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">N° 12345</p>
            <p className="text-[11px] text-slate-400">Fecha: {new Date().toLocaleDateString("es-CL")}</p>
          </div>
        </div>

        {/* Client Details Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Datos del Cliente</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nombre Completo:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">RUT Chileno:</span>
              <input
                type="text"
                value={clientRut}
                onChange={(e) => setClientRut(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Teléfono de Contacto:</span>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Dirección / Comuna:</span>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Technical Specs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Detalles del Vehículo</h4>
            <select
              value={selectedVehicle?.id}
              onChange={(e) => {
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) {
                  setSelectedVehicle(found);
                  handleUpdatePrice("basePriceCLP", found.priceCash);
                }
              }}
              className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Marca y Modelo</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Año y Color</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.year} · {selectedVehicle?.color}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Patente</span>
              <span className="font-black text-slate-900 uppercase">{selectedVehicle?.licensePlate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Kilometraje</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.mileage?.toLocaleString("es-CL")} km</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown & Itemized Pricing */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Detalle Económico de la Operación</h4>
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600 font-semibold">Precio Publicado del Vehículo</span>
              <span className="font-bold text-slate-900 tabular-nums">{formatCLP(adjustment.basePriceCLP)}</span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span className="font-semibold">- Ajuste / Descuento de Precio</span>
              <input
                type="number"
                value={adjustment.priceAdjustmentCLP}
                onChange={(e) => handleUpdatePrice("priceAdjustmentCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Gestoría y Gastos de Transferencia</span>
              <input
                type="number"
                value={adjustment.gestoriaFeeCLP}
                onChange={(e) => handleUpdatePrice("gestoriaFeeCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Seguro y Garantía Adicional</span>
              <input
                type="number"
                value={adjustment.additionalInsuranceCLP}
                onChange={(e) => handleUpdatePrice("additionalInsuranceCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Accesorios y Equipamiento</span>
              <input
                type="number"
                value={adjustment.accessoriesCLP}
                onChange={(e) => handleUpdatePrice("accessoriesCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900 uppercase tracking-wider">TOTAL A PAGAR</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">{formatCLP(adjustment.totalPriceCLP)}</span>
            </div>
          </div>
        </div>

        {/* Legal Chilean Clauses */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Términos y Condiciones Legales</h4>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Ley 21.398 Pro-Consumidor & Ley 19.799 Firma Electrónica</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] leading-relaxed text-slate-600 space-y-2">
            <p>
              Por el presente instrumento, el comprador se responsabiliza de cualquier siniestro, accidente o daño que pudiere producirse a terceros una vez recibido el vehículo. Esta nota de venta no es cancelable ni válida como factura y queda sujeta a confirmación de fondos por la empresa.
            </p>
            <p>
              La entrega material del vehículo usado se realizará tras haberse verificado el pago total del saldo y suscrito el mandato especial de transferencia ante notario digital. El vehículo cuenta con la cobertura de garantía legal según el marco vigente.
            </p>
          </div>
        </div>

        {/* Dual Signatures Block */}
        <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-center text-xs">
          <div className="space-y-2">
            <div className="h-16 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-400 text-sm">Representante Legal</span>
            </div>
            <p className="font-extrabold text-slate-900">{tenant.name}</p>
            <p className="text-[10px] text-slate-400">RUT: {tenant.rut || "76.452.189-K"}</p>
          </div>

          <div className="space-y-2">
            <div className="h-16 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-400 text-sm">{clientName}</span>
            </div>
            <p className="font-extrabold text-slate-900">{clientName}</p>
            <p className="text-[10px] text-slate-400">RUT: {clientRut}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'documents', 'DocumentTemplateViewer.tsx'), documentTemplateViewer, 'utf8');
console.log('6. DocumentTemplateViewer written');

// 7. src/app/app/documents/page.tsx
const documentsPage = `"use client";

import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { DocumentTemplateViewer } from "@/components/documents/DocumentTemplateViewer";

export default function DocumentsOverviewPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Generador de Documentos y Contratos Chilenos"
        subtitle="7 plantillas oficiales de notas de venta, compra, consignación y notaría digital"
      />

      <main className="p-6 max-w-7xl w-full">
        <DocumentTemplateViewer />
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'app', 'documents', 'page.tsx'), documentsPage, 'utf8');
console.log('7. app/documents/page.tsx written');
`;

fs.writeFileSync(path.join(__dirname, 'build-all-hybrid-components.js'), CodeContent, 'utf8');
