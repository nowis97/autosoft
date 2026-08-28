"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { validateLicensePlate, normalizeLicensePlate } from "@/lib/chilean-utils";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { ArrowLeft } from "lucide-react";

export default function NewVehiclePage() {
  const router = useRouter();

  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [mileage, setMileage] = useState("");
  const [transmission, setTransmission] = useState<"MANUAL" | "AUTOMATICA">("AUTOMATICA");
  const [fuelType, setFuelType] = useState<"BENCINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO">("BENCINA");
  const [bodyType, setBodyType] = useState<any>("SUV");
  const [color, setColor] = useState("");
  const [priceCash, setPriceCash] = useState("");
  const [priceFinanced, setPriceFinanced] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80");

  const [publishWeb, setPublishWeb] = useState(true);
  const [publishML, setPublishML] = useState(true);
  const [publishChileautos, setPublishChileautos] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plateValidation = validateLicensePlate(licensePlate);

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

    store.createVehicle({
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
      priceCash: parseInt(priceCash, 10),
      priceFinanced: priceFinanced ? parseInt(priceFinanced, 10) : undefined,
      acquisitionCost: acquisitionCost ? parseInt(acquisitionCost, 10) : undefined,
      status: "AVAILABLE",
      description: description || `Excelente ${brand} ${model} año ${year}. Documentación al día y transferible de inmediato.`,
      features: ["Aire Acondicionado", "Alarma", "Cierre Centralizado", "Frenos ABS"],
      images: [imageUrl],
      publishedToWeb: publishWeb,
      publishedToMercadolibre: publishML,
      publishedToChileautos: publishChileautos,
      publishedToYapo: true,
    });

    router.push("/app/inventory");
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Registrar Nuevo Vehículo"
        subtitle="Crea un vehículo con validación de patente y multipublicación automática"
      />

      <main className="p-6 max-w-4xl w-full">
        <Link
          href="/app/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inventario</span>
        </Link>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>1. Identificación y Patente Chilena</span>
              {licensePlate && <LicensePlateBadge plate={licensePlate} size="sm" />}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="plate">Patente Vehicular</Label>
                <Input
                  id="plate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  placeholder="Ej: BBCL12 o AB1234"
                  maxLength={7}
                  className="font-mono font-bold tracking-wider uppercase"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Formato nuevo (4L+2N) o antiguo (2L+4N)
                </span>
              </div>

              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: Toyota, Mazda, Chevrolet..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo</Label>
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
                <Label htmlFor="year">Año</Label>
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
                <Label htmlFor="mileage">Kilometraje (KM)</Label>
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
              2. Especificaciones Técnicas
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
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              3. Precios y Condiciones Comerciales (CLP)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priceCash">Precio Contado ($ CLP)</Label>
                <Input
                  id="priceCash"
                  type="number"
                  value={priceCash}
                  onChange={(e) => setPriceCash(e.target.value)}
                  placeholder="15990000"
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
                  placeholder="14990000"
                />
              </div>

              <div>
                <Label htmlFor="cost">Costo de Compra (Solo dueños)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value)}
                  placeholder="13200000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="desc">Descripción Comercial</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla mantenciones, estado de neumáticos, número de dueños y equipamiento destacado..."
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
                className="w-32 h-24 object-cover rounded-lg border border-slate-200 shrink-0"
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
                  En producción se conecta con subida drag & drop y compresión WebP automática.
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
            <Button type="submit" disabled={isSubmitting} className="font-bold px-8 shadow-md">
              {isSubmitting ? "Publicando..." : "Publicar Vehículo en Todos los Canales"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
