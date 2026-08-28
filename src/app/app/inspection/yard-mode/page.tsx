"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import {
  Camera,
  Smartphone,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/chilean-utils";
import { MobileYardCameraModal } from "@/components/inspection/MobileYardCameraModal";
import { type ProcessedYardPhoto } from "@/lib/inspection/mobile-capture-engine";

export default function YardModePage() {
  const [vehicles] = useState(store.getVehicles());
  const [selectedVehicle] = useState(vehicles[0] || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [yardPhotos, setYardPhotos] = useState<ProcessedYardPhoto[]>([]);
  const [itemStatuses, setItemStatuses] = useState<Record<string, "PASS" | "WARNING" | "FAIL">>({
    "car-1": "PASS",
    "car-2": "PASS",
    "car-3": "PASS",
    "neu-1": "PASS",
    "mec-1": "PASS",
  });

  const handlePhotoSaved = (photo: ProcessedYardPhoto) => {
    setYardPhotos((prev) => [photo, ...prev]);
  };

  const handleToggleStatus = (itemId: string, status: "PASS" | "WARNING" | "FAIL") => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: status }));
  };

  const totalCostEstimate = yardPhotos.reduce((sum, p) => sum + p.estimatedFixCostCLP, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/app/inspection"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Modo Patio PWA</span>
            </div>
            <h1 className="text-sm font-black text-white">Check-in Rápido en Terreno</h1>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCameraOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>Foto</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-24">
        {/* Active Vehicle Picker */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Vehículo en Recepción</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-base text-white">
                {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.year})
              </div>
              <div className="text-xs text-blue-400 font-mono font-bold mt-0.5">
                Patente: {selectedVehicle?.licensePlate}
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase">
              En Patio
            </span>
          </div>
        </div>

        {/* Quick Yard Checklist (1-Tap Buttons) */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Checklist Rápido 1-Toque
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">5 puntos críticos</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: "car-1", name: "Parachoque y Focos Delanteros" },
              { id: "car-2", name: "Puertas y Espejos Laterales" },
              { id: "car-3", name: "Parachoque Trasero y Portalón" },
              { id: "neu-1", name: "Neumáticos (Banda y Llanta)" },
              { id: "mec-1", name: "Niveles y Encendido de Motor" },
            ].map((item) => {
              const current = itemStatuses[item.id] || "PASS";
              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, "PASS")}
                      className="px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                      style={{
                        backgroundColor: current === "PASS" ? "#059669" : "#1e293b",
                        color: current === "PASS" ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      ✓ OK
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, "WARNING")}
                      className="px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                      style={{
                        backgroundColor: current === "WARNING" ? "#d97706" : "#1e293b",
                        color: current === "WARNING" ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      ⚠ Obs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, "FAIL")}
                      className="px-2.5 py-1 text-[10px] font-black rounded-lg transition-all"
                      style={{
                        backgroundColor: current === "FAIL" ? "#e11d48" : "#1e293b",
                        color: current === "FAIL" ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      ✕ Falla
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Captured Yard Photos Evidence */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Evidencias Capturadas ({yardPhotos.length})
            </div>
            {totalCostEstimate > 0 && (
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                Estimado: {formatCLP(totalCostEstimate)}
              </span>
            )}
          </div>

          {yardPhotos.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-700 rounded-xl">
              Toma fotos con la cámara para adjuntar evidencias de carrocería.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {yardPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 text-[11px]"
                >
                  <img
                    src={photo.photoBase64}
                    alt="Evidencia Patio"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 space-y-0.5">
                    <span className="font-bold text-amber-400 block truncate">
                      {photo.damageCategory.replace("_", " ")}
                    </span>
                    <span className="text-slate-400 text-[10px] block">
                      {photo.notes || photo.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Camera Modal */}
        {isCameraOpen && (
          <MobileYardCameraModal
            isOpen={true}
            onClose={() => setIsCameraOpen(false)}
            vehicleTitle={selectedVehicle ? selectedVehicle.brand + " " + selectedVehicle.model : ""}
            licensePlate={selectedVehicle?.licensePlate || ""}
            onPhotoSaved={handlePhotoSaved}
          />
        )}
      </main>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800 p-4 backdrop-blur-md z-40 max-w-lg mx-auto">
        <Button
          onClick={() => {
            alert("¡Recepción de patio completada y enviada a Taller Oficial Oriente!");
          }}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Finalizar Check-in de Patio</span>
        </Button>
      </div>
    </div>
  );
}
