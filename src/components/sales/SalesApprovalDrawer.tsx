"use client";

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
                  {vehicle ? `${vehicle.brand} ${vehicle.model} [${vehicle.year}]` : "Mercedes-Benz A45S AMG [2023]"}
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
                    className={`px-2 py-0.5 rounded-md ${commissionType === "PERCENTAGE" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setCommissionType("FIXED")}
                    className={`px-2 py-0.5 rounded-md ${commissionType === "FIXED" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
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
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      commissionBase === "TOTAL_VENTA"
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Total de la venta
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommissionBase("MARGEN_BRUTO")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      commissionBase === "MARGEN_BRUTO"
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
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
