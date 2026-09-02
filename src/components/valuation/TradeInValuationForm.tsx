import React, { useState } from "react";
import { ValuationCondition } from "@/types";
import { calculateVehicleValuation, ValuationResult } from "@/lib/chilean-utils/valuation";
import { normalizeLicensePlate, validateLicensePlate } from "@/lib/chilean-utils/license-plate";
import { fetchPlateScraper } from "@/lib/chilean-utils/plate-scraper";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, Car, Loader2 } from "lucide-react";

interface TradeInValuationFormProps {
  onValuationComputed: (data: {
    licensePlate: string;
    brand: string;
    model: string;
    version: string;
    year: number;
    mileage: number;
    condition: ValuationCondition;
    clientName: string;
    clientPhone: string;
    result: ValuationResult;
  }) => void;
}

export function TradeInValuationForm({ onValuationComputed }: TradeInValuationFormProps) {
  const [licensePlate, setLicensePlate] = useState("LKJW23");
  const [brand, setBrand] = useState("Hyundai");
  const [model, setModel] = useState("Accent");
  const [version, setVersion] = useState("1.4 GL MT");
  const [year, setYear] = useState(2019);
  const [mileage, setMileage] = useState(62000);
  const [condition, setCondition] = useState<ValuationCondition>("GOOD");
  const [clientName, setClientName] = useState("Marcela Contreras");
  const [clientPhone, setClientPhone] = useState("+56 9 8234 5678");
  const [isLoadingScraper, setIsLoadingScraper] = useState(false);

  const handleLookupPlate = async (plateToQuery: string) => {
    const norm = normalizeLicensePlate(plateToQuery);
    if (!norm || norm.length < 5) return;
    setIsLoadingScraper(true);
    try {
      const data = await fetchPlateScraper(norm);
      setBrand(data.brand);
      setModel(data.model);
      setVersion(data.version || "1.6");
      setYear(data.year);
      setMileage(data.mileage || 40000);
    } catch (e) {
      console.warn("TradeIn scraper lookup error:", e);
    } finally {
      setIsLoadingScraper(false);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateVehicleValuation({
      brand,
      model,
      year,
      mileage,
      condition,
    });

    onValuationComputed({
      licensePlate: normalizeLicensePlate(licensePlate),
      brand,
      model,
      version,
      year,
      mileage,
      condition,
      clientName,
      clientPhone,
      result,
    });
  };

  return (
    <form onSubmit={handleCalculate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Tasar Auto en Parte de Pago
          </h3>
          <p className="text-[11px] text-slate-400">
            Calcula el valor comercial de mercado y los 3 rangos de compra en segundos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-700">Patente Chilena</label>
            {isLoadingScraper && (
              <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Consultando /api/scraper/plate...</span>
              </span>
            )}
          </div>
          <input
            type="text"
            required
            value={licensePlate}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setLicensePlate(val);
              const check = validateLicensePlate(val);
              if (check.valid) {
                handleLookupPlate(val);
              }
            }}
            onBlur={() => {
              if (licensePlate.length >= 5) {
                handleLookupPlate(licensePlate);
              }
            }}
            placeholder="BBCL12 o CD1234"
            className="w-full h-10 px-3 border border-slate-200 rounded-lg font-mono font-bold uppercase tracking-wider"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Marca</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white font-semibold"
          >
            {["Toyota", "Mazda", "Ford", "Chevrolet", "Suzuki", "Hyundai", "Kia", "Nissan", "Jeep"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Modelo</label>
          <input
            type="text"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Accent, RAV4, Ranger..."
            className="w-full h-10 px-3 border border-slate-200 rounded-lg font-semibold"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Versión / Cilindrada</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.4 GL MT / 2.0 AT"
            className="w-full h-10 px-3 border border-slate-200 rounded-lg"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Año de Fabricación</label>
          <input
            type="number"
            min={2005}
            max={2026}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg font-semibold"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Kilometraje Real</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={mileage}
            onChange={(e) => setMileage(parseInt(e.target.value, 10))}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg font-semibold"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="font-bold text-slate-800 text-xs block">
          Estado Estético y Mecánico del Vehículo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: "EXCELLENT", label: "🌟 Excelente", desc: "Sin detalles, mantenciones oficiales" },
            { id: "GOOD", label: "👍 Bueno", desc: "Desgaste normal, requiere pulido básico" },
            { id: "FAIR", label: "⚠️ Regular", desc: "Detalles de pintura o neumáticos gastados" },
            { id: "NEEDS_REPAIR", label: "🔧 Requiere Taller", desc: "Fallas mecánicas o choques leves" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCondition(c.id as ValuationCondition)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                condition === c.id
                  ? "bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600/20 font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-xs">{c.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Nombre del Cliente (Opcional)</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp</label>
          <input
            type="text"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <Button type="submit" className="w-full font-bold text-xs gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm py-2.5">
        <Sparkles className="w-4 h-4" />
        <span>Calcular Tasación Inteligente de Retoma</span>
      </Button>
    </form>
  );
}
