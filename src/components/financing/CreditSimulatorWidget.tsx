"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import { formatCLP, calculateLoanQuote } from "@/lib/chilean-utils";
import { Button } from "@/components/ui/button";
import { FinancingApplicationModal } from "./FinancingApplicationModal";
import { BadgePercent, Sparkles } from "lucide-react";

interface CreditSimulatorWidgetProps {
  vehicle: Vehicle;
}

export function CreditSimulatorWidget({ vehicle }: CreditSimulatorWidgetProps) {
  const basePrice = vehicle.priceFinanced || vehicle.priceCash;
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculatedDownPayment = Math.round(basePrice * (downPaymentPercent / 100));

  const simulation = calculateLoanQuote({
    vehiclePrice: basePrice,
    downPayment: calculatedDownPayment,
    termMonths,
  });

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-100 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <BadgePercent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Simulador de Financiamiento</h3>
            <p className="text-xs text-slate-500">Calcula tu cuota a medida con aprobación rápida</p>
          </div>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
          Tasa desde 1.45%
        </span>
      </div>

      <div className="bg-white border border-blue-200/80 rounded-xl p-4 my-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-xs text-slate-500 font-medium">Cuota Mensual Estimada</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 tabular-nums">
            {formatCLP(simulation.monthlyPayment)} <span className="text-sm font-normal text-slate-400">/ mes</span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Pie: <strong className="text-slate-800">{formatCLP(calculatedDownPayment)}</strong></div>
          <div>Plazo: <strong className="text-slate-800">{termMonths} meses</strong></div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Pie Inicial ({downPaymentPercent}%)</span>
          <span className="tabular-nums text-blue-700">{formatCLP(calculatedDownPayment)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[20, 30, 40, 50].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setDownPaymentPercent(pct)}
              className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                downPaymentPercent === pct
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {pct}% ({formatCLP(Math.round(basePrice * (pct / 100)))})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Plazo en Meses</span>
          <span className="text-blue-700">{termMonths} meses ({termMonths / 12} años)</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[12, 24, 36, 48, 60].map((months) => (
            <button
              key={months}
              type="button"
              onClick={() => setTermMonths(months)}
              className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                termMonths === months
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {months} m
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full gap-2 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white h-12 text-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>Postular a Pre-Aprobación Online</span>
      </Button>

      <p className="text-[11px] text-slate-400 text-center mt-2.5">
        *Valores referenciales sujetos a evaluación comercial por entidades financieras aliadas.
      </p>

      <FinancingApplicationModal
        vehicle={vehicle}
        initialDownPayment={calculatedDownPayment}
        initialTermMonths={termMonths}
        estimatedPayment={simulation.monthlyPayment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
