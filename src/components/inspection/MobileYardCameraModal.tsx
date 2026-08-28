"use client";

import { useState, useRef } from "react";
import { Camera, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  processYardInspectionPhoto,
  type YardPhotoCaptureInput,
  type ProcessedYardPhoto,
} from "@/lib/inspection/mobile-capture-engine";

interface MobileYardCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
  licensePlate: string;
  onPhotoSaved: (photo: ProcessedYardPhoto) => void;
}

export function MobileYardCameraModal({
  isOpen,
  onClose,
  vehicleTitle,
  licensePlate,
  onPhotoSaved,
}: MobileYardCameraModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [damageCategory, setDamageCategory] = useState<YardPhotoCaptureInput["damageCategory"]>("CARROCERIA_PINTURA");
  const [severity, setSeverity] = useState<YardPhotoCaptureInput["severity"]>("MODERADO");
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!photoPreview) return;

    const processed = processYardInspectionPhoto({
      photoBase64: photoPreview,
      damageCategory,
      severity,
      notes: notes || "Capturado en patio",
      timestamp: new Date().toISOString(),
    });

    onPhotoSaved(processed);
    setPhotoPreview(null);
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                Modo Patio • Captura Móvil
              </div>
              <h2 className="text-sm font-bold text-white truncate max-w-[200px]">
                {vehicleTitle} ({licensePlate})
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Photo Capture Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 relative overflow-hidden">
            {photoPreview ? (
              <div className="space-y-2">
                <img
                  src={photoPreview}
                  alt="Preview de Daño"
                  className="w-full h-44 object-cover rounded-xl shadow-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold"
                >
                  Cambiar Foto
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer py-6 flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-slate-800 text-sm">
                  Tomar Foto con Cámara Móvil
                </div>
                <div className="text-[11px] text-slate-400">
                  Toca para abrir la cámara o galería del teléfono
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Damage Categorization */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Categoría del Daño
              </label>
              <select
                value={damageCategory}
                onChange={(e) => setDamageCategory(e.target.value as YardPhotoCaptureInput["damageCategory"])}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
              >
                <option value="CARROCERIA_PINTURA">Carrocería & Pintura (Abolladuras / Rayones)</option>
                <option value="NEUMATICOS_FRENOS">Neumáticos & Frenos (Desgaste / Cortes)</option>
                <option value="MECANICA_MOTOR">Mecánica & Motor (Fugas / Ruidos)</option>
                <option value="INTERIOR_ELECTRICO">Interior & Eléctrico (Tapiz / Luces)</option>
                <option value="DOCUMENTACION">Documentación & Llaves</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Gravedad / Severidad
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["LEVE", "MODERADO", "CRITICO"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className="py-2 text-[11px] font-extrabold rounded-xl border transition-all"
                    style={{
                      backgroundColor: severity === sev ? (sev === "CRITICO" ? "#e11d48" : sev === "MODERADO" ? "#f59e0b" : "#2563eb") : "#ffffff",
                      color: severity === sev ? "#ffffff" : "#475569",
                      borderColor: severity === sev ? "transparent" : "#e2e8f0",
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Notas del Inspector
              </label>
              <input
                type="text"
                placeholder="Ej. Parachoques raspado en lateral izquierdo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!photoPreview}
              onClick={handleSavePhoto}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Evidencia</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
