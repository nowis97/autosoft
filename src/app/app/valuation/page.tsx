"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { TradeInValuationForm } from "@/components/valuation/TradeInValuationForm";
import { ValuationResultCard } from "@/components/valuation/ValuationResultCard";
import { TradeInProposalModal } from "@/components/valuation/TradeInProposalModal";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { ValuationResult, calculateVehicleValuation } from "@/lib/chilean-utils/valuation";
import { fetchPlateScraper } from "@/lib/chilean-utils/plate-scraper";
import { normalizeLicensePlate } from "@/lib/chilean-utils/license-plate";
import { Calculator, TrendingUp, CheckCircle2, Clock, Car, Sparkles, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ValuationPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();

  const [gaiaQuery, setGaiaQuery] = useState("");
  const [isGaiaThinking, setIsGaiaThinking] = useState(false);
  const [selectedStockVehicle, setSelectedStockVehicle] = useState("");

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

  const handleGaiaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gaiaQuery.trim()) return;

    setIsGaiaThinking(true);

    // Extract potential plate from natural language query
    const words = gaiaQuery.split(/\s+/);
    const plateCandidate = words.find((w) => /^[A-Za-z]{2,4}\d{2,4}$/.test(w)) || "GAIA01";
    const normPlate = normalizeLicensePlate(plateCandidate);

    try {
      const scraped = await fetchPlateScraper(normPlate);
      const computedResult = calculateVehicleValuation({
        brand: scraped.brand,
        model: scraped.model,
        year: scraped.year,
        mileage: scraped.mileage || 45000,
        condition: "GOOD",
      });

      setActiveValuation({
        licensePlate: scraped.licensePlate,
        brand: scraped.brand,
        model: scraped.model,
        version: scraped.version || "1.6",
        year: scraped.year,
        mileage: scraped.mileage || 45000,
        condition: "GOOD",
        clientName: "Consulta GAIA IA",
        clientPhone: "+56 9 9999 8888",
        result: computedResult,
      });
    } catch (err) {
      console.warn("GAIA plate scraper error:", err);
    } finally {
      setIsGaiaThinking(false);
    }
  };

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
      pipelineStage: "REVISION_MECANICA",
      description: `Vehículo recibido en parte de pago de ${activeValuation.clientName || "cliente"}.`,
      features: ["Aire Acondicionado", "Cierre Centralizado", "Frenos ABS", "Doble Airbag"],
      images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"],
      publishedToWeb: false,
      publishedToMercadolibre: false,
      publishedToChileautos: false,
      publishedToYapo: false,
    });

    setSuccessMessage(`¡Vehículo ingresado al stock (${created.brand} ${created.model}) y enviado a Revisión Mecánica!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Tasador Inteligente GAIA & Retoma de Vehículos"
        subtitle="Calcula el valor de mercado en Chile con ajustes por kilometraje, condición y margen comercial"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* GAIA Natural Language Assistant Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <span>Tasador Conversacional GAIA IA</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[10px] font-black uppercase">Live</span>
                </h3>
                <p className="text-xs text-indigo-200/80">Escribe en lenguaje natural o selecciona un vehículo de tu inventario</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStockVehicle}
                onChange={(e) => {
                  setSelectedStockVehicle(e.target.value);
                  const found = vehicles.find((v) => v.id === e.target.value);
                  if (found) {
                    setGaiaQuery(`Tasar ${found.brand} ${found.model} ${found.year} con ${found.mileage} km patente ${found.licensePlate}`);
                  }
                }}
                className="bg-indigo-900/60 border border-indigo-400/30 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-100 focus:outline-none"
              >
                <option value="">Tasar desde inventario...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.licensePlate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleGaiaSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="ej. 'Tasar Mazda CX-5 2021 45.000 km excelente estado' o ingresa patente..."
              value={gaiaQuery}
              onChange={(e) => setGaiaQuery(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
            />
            <Button
              type="submit"
              disabled={isGaiaThinking || !gaiaQuery.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded-2xl shadow-lg gap-2"
            >
              {isGaiaThinking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Tasar</span>
            </Button>
          </form>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">Esperando datos de tasación</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Completa el formulario a la izquierda o escribe en GAIA IA para calcular los valores de mercado.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

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
    </div>
  );
}
