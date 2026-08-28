"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Button } from "@/components/ui/button";
import {
  PhotoUploaderDropzone,
  StudioPhoto,
} from "@/components/studio/PhotoUploaderDropzone";
import {
  VirtualShowroomSelector,
  SHOWROOM_PRESETS,
} from "@/components/studio/VirtualShowroomSelector";
import {
  BrandingOverlayControls,
  BrandingOptions,
} from "@/components/studio/BrandingOverlayControls";
import { BeforeAfterComparisonSlider } from "@/components/studio/BeforeAfterComparisonSlider";
import { Sparkles, CheckCircle2, Save, Share2 } from "lucide-react";

export default function StudioPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || "");
  const vehicle = store.getVehicleById(selectedVehicleId) || vehicles[0];

  const [photos, setPhotos] = useState<StudioPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("showroom-premium");

  const [brandingOptions, setBrandingOptions] = useState<BrandingOptions>({
    showWatermarkLogo: true,
    showCustomPlate: true,
    plateText: tenant.name,
    selectedBadge: "GARANTIA",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  useEffect(() => {
    if (vehicle && vehicle.images.length > 0) {
      const initial: StudioPhoto[] = vehicle.images.map((url, idx) => ({
        id: `photo-${idx}`,
        url,
        originalUrl: url,
        isCover: idx === 0,
        angle: idx === 0 ? "PORTADA" : idx === 1 ? "LATERAL" : "INTERIOR",
      }));
      setPhotos(initial);
      setSelectedPhotoId(initial[0]?.id || "");
    }
  }, [selectedVehicleId]);

  const activePhoto = photos.find((p) => p.id === selectedPhotoId) || photos[0];

  const handleApplyToAll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessSaved(true);
      setTimeout(() => setSuccessSaved(false), 3000);
    }, 1200);
  };

  const handleSaveToVehicle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      store.updateVehicle(vehicle.id, {
        images: photos.map((p) => p.url),
      });
      setSuccessSaved(true);
      setTimeout(() => setSuccessSaved(false), 3000);
      alert(`¡Álbum fotográfico de ${vehicle.brand} ${vehicle.model} actualizado y sincronizado con Mercado Libre, Chileautos y tu web propia!`);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Estudio Fotográfico con IA & Auto-Branding"
        subtitle="Transforma fotos de patio en catálogo de concesionario premium con showroom virtual y marca propia"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Vehículo en Edición</div>
              <div className="font-extrabold text-slate-900 text-base">
                {vehicle?.brand} {vehicle?.model} ({vehicle?.year})
              </div>
            </div>
            {vehicle && <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - {v.licensePlate}
                </option>
              ))}
            </select>

            <Button
              onClick={handleSaveToVehicle}
              disabled={isProcessing}
              className="font-bold text-xs gap-1.5 shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4" />
              <span>{isProcessing ? "Procesando..." : "Guardar & Sincronizar Stock"}</span>
            </Button>
          </div>
        </div>

        {successSaved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Fotografías procesadas con IA y distribuidas automáticamente a Mercado Libre, Chileautos y tu web propia.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            {activePhoto ? (
              <BeforeAfterComparisonSlider
                originalImage={activePhoto.originalUrl}
                presetId={selectedPresetId}
                brandingOptions={brandingOptions}
                tenant={tenant}
              />
            ) : (
              <div className="p-12 bg-slate-100 rounded-2xl text-center text-xs text-slate-400">
                Sube una fotografía para comenzar a editar
              </div>
            )}

            <PhotoUploaderDropzone
              photos={photos}
              onPhotosChange={setPhotos}
              selectedPhotoId={selectedPhotoId}
              onSelectPhoto={setSelectedPhotoId}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <VirtualShowroomSelector
              selectedPresetId={selectedPresetId}
              onSelectPreset={setSelectedPresetId}
            />

            <BrandingOverlayControls
              tenant={tenant}
              options={brandingOptions}
              onChange={setBrandingOptions}
            />

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Procesamiento por Lote en 1 Clic
                </span>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  IA Turbo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Aplica este showroom virtual, logo y marco de patente a las {photos.length} fotos del vehículo simultáneamente.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyToAll}
                disabled={isProcessing}
                className="w-full text-xs font-bold gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Aplicar a todo el álbum ({photos.length} fotos)</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
