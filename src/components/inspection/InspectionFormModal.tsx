import React, { useState } from "react";
import { Vehicle, InspectionChecklistItem, DamagePoint } from "@/types";
import { INSPECTION_50_POINTS_TEMPLATE, calculateInspectionScore } from "@/lib/inspection/inspection-engine";
import { DamageMapSelector } from "./DamageMapSelector";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, X, Check, AlertTriangle, AlertCircle, Save } from "lucide-react";

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSaveInspection: (data: any) => void;
}

export function InspectionFormModal({
  isOpen,
  onClose,
  vehicles,
  onSaveInspection,
}: InspectionFormModalProps) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || "");
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

  const [inspectorName, setInspectorName] = useState("Claudio Morales");
  const [inspectorRut, setInspectorRut] = useState("15.981.204-9");
  const [receptionMileage, setReceptionMileage] = useState(selectedVehicle?.mileage || 45000);
  const [fuelLevel, setFuelLevel] = useState<"1/4" | "1/2" | "3/4" | "Lleno">("3/4");
  const [reconditioningEstimateCLP, setReconditioningEstimateCLP] = useState(250000);

  const [items, setItems] = useState<InspectionChecklistItem[]>(
    INSPECTION_50_POINTS_TEMPLATE.map((tmpl) => ({
      id: tmpl.id,
      name: tmpl.name,
      category: tmpl.category,
      status: "PASS",
    }))
  );

  const [damagePoints, setDamagePoints] = useState<DamagePoint[]>([]);

  if (!isOpen) return null;

  const scoreResult = calculateInspectionScore(items);

  const handleItemStatusChange = (id: string, status: "PASS" | "WARNING" | "FAIL") => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInspection({
      tenantId: selectedVehicle.tenantId,
      vehicleId,
      inspectorName,
      inspectorRut,
      receptionMileage,
      fuelLevel,
      items,
      damagePoints,
      reconditioningEstimateCLP,
      clientSignature: `Firmado por ${selectedVehicle.brand} Owner`,
      inspectorSignature: `Firmado por ${inspectorName} (Inspector Certificado)`,
      status: "COMPLETED",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Nueva Inspección Técnica & Check-in (50 Puntos)</div>
              <div className="text-[11px] text-slate-400">Recepción de retoma o consignación con certificación oficial</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Top Score Real-Time Ribbon */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Puntaje Técnico Obtenido</div>
              <div className="text-2xl font-black text-white flex items-center gap-2">
                <span>{scoreResult.score} / 100 pts</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  scoreResult.rating === "EXCELENTE"
                    ? "bg-emerald-500 text-white"
                    : scoreResult.rating === "BUENO"
                    ? "bg-amber-500 text-slate-900"
                    : "bg-red-500 text-white"
                }`}>
                  {scoreResult.rating}
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <div>{scoreResult.failCount} fallas críticas a reparar</div>
              <div>{scoreResult.warningCount} observaciones menores</div>
            </div>
          </div>

          {/* Vehicle and Inspector Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vehículo a Inspeccionar</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.year}) - Patente: {v.licensePlate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Inspector Responsable</label>
              <input
                type="text"
                required
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kilometraje de Recepción</label>
              <input
                type="number"
                required
                value={receptionMileage}
                onChange={(e) => setReceptionMileage(parseInt(e.target.value, 10))}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nivel de Combustible</label>
              <select
                value={fuelLevel}
                onChange={(e: any) => setFuelLevel(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white font-semibold"
              >
                <option value="1/4">1/4 de Estanque</option>
                <option value="1/2">1/2 Estanque</option>
                <option value="3/4">3/4 de Estanque</option>
                <option value="Lleno">Estanque Lleno</option>
              </select>
            </div>
          </div>

          {/* Interactive Damage Map */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs mb-2">1. Mapeo de Daños de Carrocería</h4>
            <DamageMapSelector
              damagePoints={damagePoints}
              onChangeDamagePoints={setDamagePoints}
            />
          </div>

          {/* 50 Points Checklist */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs">2. Checklist de 50 Puntos de Inspección</h4>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      {item.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleItemStatusChange(item.id, "PASS")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        item.status === "PASS"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Check className="w-3 h-3" /> OK
                    </button>

                    <button
                      type="button"
                      onClick={() => handleItemStatusChange(item.id, "WARNING")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        item.status === "WARNING"
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" /> Obs.
                    </button>

                    <button
                      type="button"
                      onClick={() => handleItemStatusChange(item.id, "FAIL")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        item.status === "FAIL"
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" /> Falla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              <Save className="w-4 h-4" />
              <span>Guardar Certificado de Inspección</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
