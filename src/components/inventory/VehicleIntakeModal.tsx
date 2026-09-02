"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { fetchPlateScraper } from "@/lib/chilean-utils/plate-scraper";
import { X, Sparkles, Car, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated?: (vehicleId: string) => void;
}

export function VehicleIntakeModal({ isOpen, onClose, onVehicleCreated }: VehicleIntakeModalProps) {
  const [plate, setPlate] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    if (!plate || plate.length < 5) return;
    setIsAnalyzing(true);
    setErrorMsg("");

    try {
      const scraped = await fetchPlateScraper(plate);

      const newVeh = store.createVehicle({
        tenantId: "tenant-oriente-1",
        licensePlate: scraped.licensePlate,
        brand: scraped.brand,
        model: scraped.model,
        version: scraped.version || "1.6",
        year: scraped.year,
        mileage: scraped.mileage || 35000,
        transmission: scraped.transmission,
        fuelType: scraped.fuelType,
        bodyType: scraped.bodyType,
        color: scraped.color || "Blanco",
        vin: scraped.vin,
        engineNumber: scraped.engineNumber,
        priceCash: scraped.priceCash,
        priceFinanced: scraped.priceFinanced,
        acquisitionCost: scraped.acquisitionCost,
        status: "AVAILABLE",
        pipelineStage: "REVISION_MECANICA",
        description: scraped.description || `Ingreso de ${scraped.brand} ${scraped.model} ${scraped.year}. Padrón consultado vía /api/scraper/plate.`,
        features: scraped.features || ["Documentación al Día", "Revisión Técnica Vigente"],
        images: [scraped.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"],
        publishedToWeb: false,
        publishedToMercadolibre: false,
        publishedToChileautos: false,
        publishedToYapo: false,
      });

      setIsAnalyzing(false);
      if (onVehicleCreated) onVehicleCreated(newVeh.id);
      onClose();
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg(err?.message || "No se pudo consultar la patente en las fuentes oficiales.");
    }
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
              <h3 className="text-xl font-extrabold text-slate-900">Consultando /api/scraper/plate</h3>
              <p className="text-xs text-slate-500 font-medium">
                Extrayendo datos oficiales de padrón y PRT para <strong className="text-slate-800">{plate.toUpperCase()}</strong>
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
              <h3 className="text-xl font-extrabold text-slate-900">Alta con Scraper de Patente</h3>
              <p className="text-xs text-slate-500">
                Consulta <code className="text-blue-600 font-mono">/api/scraper/plate/[plate]</code> para auto-completar especificaciones, año y tasación.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3 pt-2 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Patente Vehículo (ej. PPGH38, BBCL12)
              </label>
              <input
                type="text"
                placeholder="PPGH38"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && plate.length >= 5) {
                    e.preventDefault();
                    handleStartAnalysis();
                  }
                }}
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
              <span>Consultar /api/scraper/plate</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
