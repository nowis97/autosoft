"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { TradeInValuationForm } from "@/components/valuation/TradeInValuationForm";
import { ValuationResultCard } from "@/components/valuation/ValuationResultCard";
import { TradeInProposalModal } from "@/components/valuation/TradeInProposalModal";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { ValuationResult } from "@/lib/chilean-utils/valuation";
import { Calculator, TrendingUp, CheckCircle2, Clock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ValuationPage() {
  const tenant = store.getTenant();
  const valuations = store.getValuations();

  const [activeValuation, setActiveValuation] = useState<{
    licensePlate: string;
    brand: string;
    model: string;
    version: string;
    year: number;
    mileage: number;
    condition: any;
    clientName: string;
    clientPhone: string;
    result: ValuationResult;
  } | null>({
    licensePlate: "LKJW23",
    brand: "Hyundai",
    model: "Accent",
    version: "1.4 GL MT",
    year: 2019,
    mileage: 62000,
    condition: "GOOD",
    clientName: "Marcela Contreras",
    clientPhone: "+56 9 8234 5678",
    result: {
      estimatedMarketPrice: 8900000,
      mileageAdjustmentFactor: -1.8,
      conditionAdjustmentCLP: 267000,
      reconditioningEstimateCLP: 350000,
      quickOffer: 7120000,
      recommendedOffer: 7480000,
      maxOffer: 7830000,
      dealerMarginPercentage: 12,
      expectedGrossProfitCLP: 1070000,
    },
  });

  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleValuationComputed = (data: any) => {
    setActiveValuation(data);
    store.createValuation({
      tenantId: tenant.id,
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      version: data.version,
      year: data.year,
      mileage: data.mileage,
      condition: data.condition,
      estimatedMarketPrice: data.result.estimatedMarketPrice,
      quickOffer: data.result.quickOffer,
      recommendedOffer: data.result.recommendedOffer,
      maxOffer: data.result.maxOffer,
      reconditioningEstimateCLP: data.result.reconditioningEstimateCLP,
      expectedGrossProfitCLP: data.result.expectedGrossProfitCLP,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      status: "OFFERED",
    });
  };

  const handleConvertToInventory = (offerAmount: number) => {
    if (!activeValuation) return;

    const created = store.createVehicle({
      tenantId: tenant.id,
      licensePlate: activeValuation.licensePlate,
      brand: activeValuation.brand,
      model: activeValuation.model,
      version: activeValuation.version || "1.6",
      year: activeValuation.year,
      mileage: activeValuation.mileage,
      transmission: "AUTOMATICA",
      fuelType: "BENCINA",
      bodyType: "SUV",
      color: "Gris Plata",
      priceCash: activeValuation.result.estimatedMarketPrice,
      priceFinanced: Math.round(activeValuation.result.estimatedMarketPrice * 0.95),
      acquisitionCost: offerAmount,
      status: "IN_MAINTENANCE",
      description: `Vehículo recibido en parte de pago de ${activeValuation.clientName || "cliente"}. En proceso de preparación y revisión técnica oficial.`,
      features: ["Aire Acondicionado", "Cierre Centralizado", "Frenos ABS", "Doble Airbag"],
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
      ],
      publishedToWeb: false,
      publishedToMercadolibre: false,
      publishedToChileautos: false,
      publishedToYapo: false,
    });

    setSuccessMessage(`¡Vehículo ${created.brand} ${created.model} (${created.licensePlate}) ingresado exitosamente al Inventario DMS como auto en preparación!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Motor de Tasación Inteligente & Retomas (Pricing)"
        subtitle="Valuación predictiva de autos en parte de pago, rangos de oferta comercial y conversión directa a stock"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Tasaciones Realizadas</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{valuations.length} autos</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Cotizadas este mes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Retomas Aceptadas</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {valuations.filter((v) => v.status === "ACCEPTED").length} unidades
            </div>
            <div className="text-xs text-slate-400 mt-1">Ingresadas a stock DMS</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Margen Promedio Retoma</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">12.5%</div>
            <div className="text-xs text-slate-400 mt-1">Sobre PVP de mercado</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Tiempo Promedio de Tasación</div>
            <div className="text-2xl font-black text-purple-600 mt-1">&lt; 30 seg</div>
            <div className="text-xs text-slate-400 mt-1">vs 2 horas tradicional</div>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-6">
            <TradeInValuationForm onValuationComputed={handleValuationComputed} />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {activeValuation ? (
              <ValuationResultCard
                licensePlate={activeValuation.licensePlate}
                brand={activeValuation.brand}
                model={activeValuation.model}
                version={activeValuation.version}
                year={activeValuation.year}
                mileage={activeValuation.mileage}
                result={activeValuation.result}
                onOpenProposal={() => setIsProposalOpen(true)}
                onConvertToInventory={handleConvertToInventory}
              />
            ) : (
              <div className="p-12 bg-slate-100 rounded-2xl text-center text-xs text-slate-400">
                Completa los datos para ver la tasación predictiva
              </div>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Historial de Tasaciones & Retomas</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Patente</th>
                  <th className="py-3 px-3">Vehículo</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Valor Mercado</th>
                  <th className="py-3 px-3">Oferta Recomendada</th>
                  <th className="py-3 px-3">Margen Proyectado</th>
                  <th className="py-3 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {valuations.map((val) => (
                  <tr key={val.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <LicensePlateBadge plate={val.licensePlate} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {val.brand} {val.model} ({val.year})
                    </td>
                    <td className="py-3 px-3">
                      <div>{val.clientName || "Particular"}</div>
                      <div className="text-[10px] text-slate-400">{val.clientPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-600">
                      {formatCLP(val.estimatedMarketPrice)}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-600">
                      {formatCLP(val.recommendedOffer)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatCLP(val.expectedGrossProfitCLP)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        val.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {val.status === "ACCEPTED" ? "Ingresado a Stock" : "Oferta Enviada"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {activeValuation && (
          <TradeInProposalModal
            isOpen={isProposalOpen}
            onClose={() => setIsProposalOpen(false)}
            tenant={tenant}
            licensePlate={activeValuation.licensePlate}
            brand={activeValuation.brand}
            model={activeValuation.model}
            version={activeValuation.version}
            year={activeValuation.year}
            mileage={activeValuation.mileage}
            clientName={activeValuation.clientName}
            clientPhone={activeValuation.clientPhone}
            result={activeValuation.result}
          />
        )}
      </main>
    </div>
  );
}
