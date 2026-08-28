"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { validateLicensePlate, normalizeLicensePlate, lookupVehicleByPlate } from "@/lib/chilean-utils";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { ArrowLeft, Sparkles, Search, Check, RefreshCw, ShieldCheck } from "lucide-react";

export const PRESET_VEHICLES = [
  { plate: "BBCL12", label: "🚗 Toyota RAV4 2022" },
  { plate: "KPTY44", label: "🚙 Hyundai Tucson 2023" },
  { plate: "PPTT88", label: "🏎️ Mazda CX-5 2021" },
  { plate: "CWDK90", label: "🛻 Chevrolet D-Max 4x4" },
  { plate: "LJRR55", label: "⚡ Suzuki Swift 2023" },
  { plate: "HTTR99", label: "🌟 Kia Sportage 2022" },
];

export default function NewVehiclePage() {
  const router = useRouter();

  // Initialize with preloaded Toyota RAV4
  const initial = lookupVehicleByPlate("BBCL12");

  const [licensePlate, setLicensePlate] = useState(initial.licensePlate);
  const [brand, setBrand] = useState(initial.brand);
  const [model, setModel] = useState(initial.model);
  const [version, setVersion] = useState(initial.version);
  const [year, setYear] = useState(initial.year.toString());
  const [mileage, setMileage] = useState(initial.mileage.toString());
  const [transmission, setTransmission] = useState<"MANUAL" | "AUTOMATICA">(initial.transmission);
  const [fuelType, setFuelType] = useState<"BENCINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO">(initial.fuelType);
  const [bodyType, setBodyType] = useState<any>(initial.bodyType);
  const [color, setColor] = useState(initial.color);
  const [vin, setVin] = useState(initial.vin || "");
  const [engineNumber, setEngineNumber] = useState(initial.engineNumber || "");
  const [priceCash, setPriceCash] = useState(initial.priceCash.toString());
  const [priceFinanced, setPriceFinanced] = useState(initial.priceFinanced.toString());
  const [acquisitionCost, setAcquisitionCost] = useState(initial.acquisitionCost.toString());
  const [description, setDescription] = useState(initial.description);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);

  const [publishWeb, setPublishWeb] = useState(true);
  const [publishML, setPublishML] = useState(true);
  const [publishChileautos, setPublishChileautos] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [successBanner, setSuccessBanner] = useState("✨ Datos precargados listos a través de la patente. Modifica lo que desees o publica de inmediato.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plateValidation = validateLicensePlate(licensePlate);

  // Autofill all vehicle specifications from license plate
  const applyAutofillByPlate = (targetPlate: string) => {
    const norm = normalizeLicensePlate(targetPlate);
    if (!norm) return;

    const data = lookupVehicleByPlate(norm);
    setLicensePlate(data.licensePlate);
    setBrand(data.brand);
    setModel(data.model);
    setVersion(data.version);
    setYear(data.year.toString());
    setMileage(data.mileage.toString());
    setTransmission(data.transmission);
    setFuelType(data.fuelType);
    setBodyType(data.bodyType);
    setColor(data.color);
    if (data.vin) setVin(data.vin);
    if (data.engineNumber) setEngineNumber(data.engineNumber);
    setPriceCash(data.priceCash.toString());
    setPriceFinanced(data.priceFinanced.toString());
    setAcquisitionCost(data.acquisitionCost.toString());
    setDescription(data.description);
    setImageUrl(data.imageUrl);
    setErrorMsg("");

    const sourceLabel = data.source === "CAV_EXACT_MATCH" ? "Padrón Digital (CAV)" : "Series Registro Civil";
    setSuccessBanner("✅ ¡Datos de " + data.brand + " " + data.model + " " + data.year + " precargados desde " + sourceLabel + "!");
    setTimeout(() => setSuccessBanner(""), 4000);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setLicensePlate(val);
    const check = validateLicensePlate(val);
    if (check.valid) {
      applyAutofillByPlate(val);
    }
  };

  const handleClearForm = () => {
    setLicensePlate("");
    setBrand("");
    setModel("");
    setVersion("");
    setYear(new Date().getFullYear().toString());
    setMileage("");
    setColor("");
    setVin("");
    setEngineNumber("");
    setPriceCash("");
    setPriceFinanced("");
    setAcquisitionCost("");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80");
    setSuccessBanner("Formulario limpiado para ingreso manual.");
    setTimeout(() => setSuccessBanner(""), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim()) {
      setErrorMsg("Ingresa la patente del vehículo");
      return;
    }
    if (!plateValidation.valid) {
      setErrorMsg("La patente ingresada no cumple con el formato chileno válido (ej. BBCL12 o AB1234)");
      return;
    }
    if (!brand.trim() || !model.trim()) {
      setErrorMsg("Ingresa la marca y modelo");
      return;
    }
    if (!priceCash || parseInt(priceCash, 10) <= 0) {
      setErrorMsg("Ingresa un precio contado válido");
      return;
    }

    setIsSubmitting(true);

    const tenant = store.getTenant();

    const vehicleData = {
      tenantId: tenant.id,
      licensePlate: normalizeLicensePlate(licensePlate),
      brand,
      model,
      version: version || "Estándar",
      year: parseInt(year, 10) || new Date().getFullYear(),
      mileage: parseInt(mileage, 10) || 0,
      transmission,
      fuelType,
      bodyType,
      color: color || "Blanco",
      vin: vin || undefined,
      priceCash: parseInt(priceCash, 10),
      priceFinanced: priceFinanced ? parseInt(priceFinanced, 10) : undefined,
      acquisitionCost: acquisitionCost ? parseInt(acquisitionCost, 10) : undefined,
      status: "AVAILABLE" as const,
      description: description || "Excelente " + brand + " " + model + " año " + year + ". Documentación al día y transferible de inmediato.",
      features: ["Aire Acondicionado", "Alarma", "Cierre Centralizado", "Frenos ABS"],
      images: [imageUrl],
      publishedToWeb: publishWeb,
      publishedToMercadolibre: publishML,
      publishedToChileautos: publishChileautos,
      publishedToYapo: true,
    };

    store.createVehicle(vehicleData);

    // Persist to PostgreSQL backend
    fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    }).catch((err) => console.warn("Failed to persist vehicle to PostgreSQL", err));

    router.push("/app/inventory");
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Registrar Nuevo Vehículo"
        subtitle="Carga automática de especificaciones mediante Padrón Digital y patente chilena"
      />

      <main className="p-6 max-w-4xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/app/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inventario</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearForm}
            className="text-xs text-slate-500 hover:text-slate-800 gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpiar Formulario</span>
          </Button>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-blue-800/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Precarga con 1 Clic por Patente Chilena
              </span>
            </div>
            <span className="text-[11px] text-slate-300">Selecciona o escribe una patente:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_VEHICLES.map((p) => {
              const isSelected = normalizeLicensePlate(licensePlate) === normalizeLicensePlate(p.plate);
              return (
                <button
                  key={p.plate}
                  type="button"
                  onClick={() => applyAutofillByPlate(p.plate)}
                  className={"px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer " + (
                    isSelected
                      ? "bg-blue-500 text-white shadow-sm ring-2 ring-white/40"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  )}
                >
                  <span>{p.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">[{p.plate}]</span>
                </button>
              );
            })}
          </div>
        </div>

        {successBanner && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>1. Identificación y Consulta de Padrón Digital</span>
              {licensePlate && <LicensePlateBadge plate={licensePlate} size="sm" />}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="plate" className="flex items-center justify-between">
                  <span>Patente Vehicular *</span>
                  <span className="text-[10px] text-blue-600 font-normal">Autofill en vivo</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="plate"
                    value={licensePlate}
                    onChange={handlePlateChange}
                    placeholder="Ej: BBCL12 o AB1234"
                    maxLength={7}
                    className="font-mono font-bold tracking-wider uppercase bg-blue-50/40 border-blue-200 focus:border-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyAutofillByPlate(licensePlate)}
                    title="Consultar Padrón Digital"
                    className="shrink-0 text-xs gap-1 bg-slate-50 border-slate-200 hover:bg-slate-100"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Padrón</span>
                  </Button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Escribe cualquier patente para autocompletar marca, año y ficha.
                </span>
              </div>

              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: Toyota, Mazda, Chevrolet..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej: RAV4, CX-5, Sail..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <Label htmlFor="version">Versión / Equipamiento</Label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="Ej: 2.0 LE 4x2 CVT"
                />
              </div>

              <div>
                <Label htmlFor="year">Año de Fabricación *</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2022"
                  min={1990}
                  max={2027}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mileage">Kilometraje (KM) *</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="45000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              2. Especificaciones Técnicas y Chasis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <Label>Transmisión</Label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <option value="AUTOMATICA">Automática</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>

              <div>
                <Label>Combustible</Label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <option value="BENCINA">Bencina</option>
                  <option value="DIESEL">Diésel</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="ELECTRICO">Eléctrico</option>
                </select>
              </div>

              <div>
                <Label>Carrocería</Label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <option value="SUV">SUV</option>
                  <option value="SEDAN">Sedán</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="CAMIONETA">Camioneta (Pick-up)</option>
                  <option value="COUPE">Coupé</option>
                  <option value="UTILITARIO">Utilitario / Furgón</option>
                </select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Gris Grafito"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="vin">Número de Chasis (VIN)</Label>
                <Input
                  id="vin"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="9BRBD9840N8219401"
                  className="font-mono uppercase text-xs"
                />
              </div>

              <div>
                <Label htmlFor="engine">Número de Motor</Label>
                <Input
                  id="engine"
                  value={engineNumber}
                  onChange={(e) => setEngineNumber(e.target.value)}
                  placeholder="M20A-FKS-91024"
                  className="font-mono uppercase text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              3. Precios y Condiciones Comerciales (CLP)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priceCash">Precio Contado ($ CLP) *</Label>
                <Input
                  id="priceCash"
                  type="number"
                  value={priceCash}
                  onChange={(e) => setPriceCash(e.target.value)}
                  placeholder="16990000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="priceFinanced">Precio con Bono Financiamiento ($ CLP)</Label>
                <Input
                  id="priceFinanced"
                  type="number"
                  value={priceFinanced}
                  onChange={(e) => setPriceFinanced(e.target.value)}
                  placeholder="15990000"
                />
              </div>

              <div>
                <Label htmlFor="cost">Costo de Compra (Solo dueños)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value)}
                  placeholder="13800000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="desc">Descripción Comercial</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla mantenciones, estado de neumáticos, número de dueños y equipamiento..."
                className="min-h-[90px]"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              4. Fotografía de Portada
            </h3>

            <div className="flex gap-4 items-center">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-32 h-24 object-cover rounded-lg border border-slate-200 shrink-0 shadow-xs"
              />
              <div className="flex-1">
                <Label htmlFor="img">URL de Fotografía HD</Label>
                <Input
                  id="img"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Foto asignada automáticamente según el modelo del vehículo.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              5. Canales de Distribución y Publicación Inmediata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishWeb}
                  onChange={(e) => setPublishWeb(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs font-semibold text-slate-800">Sitio Web Propio</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishML}
                  onChange={(e) => setPublishML(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs font-semibold text-slate-800">Mercado Libre Chile</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishChileautos}
                  onChange={(e) => setPublishChileautos(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs font-semibold text-slate-800">Chileautos (Carsales)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/app/inventory">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="font-bold px-8 shadow-md bg-blue-600 hover:bg-blue-500 text-white">
              {isSubmitting ? "Guardando en Base de Datos..." : "Publicar Vehículo en Stock"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
