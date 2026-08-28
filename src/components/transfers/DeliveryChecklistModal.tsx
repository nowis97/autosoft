import React, { useState } from "react";
import { Vehicle, DeliveryAct } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ShieldCheck, Key, Fuel, Gauge, X } from "lucide-react";

interface DeliveryChecklistModalProps {
  vehicle: Vehicle;
  buyerName: string;
  buyerRut: string;
  onClose: () => void;
  onConfirmDelivery: (act: DeliveryAct) => void;
}

export function DeliveryChecklistModal({
  vehicle,
  buyerName,
  buyerRut,
  onClose,
  onConfirmDelivery,
}: DeliveryChecklistModalProps) {
  const [mileage, setMileage] = useState(vehicle.mileage.toString());
  const [fuelLevel, setFuelLevel] = useState<"1/4" | "1/2" | "3/4" | "Lleno">("3/4");
  const [hasSpareTire, setHasSpareTire] = useState(true);
  const [hasToolkit, setHasToolkit] = useState(true);
  const [hasDuplicateKey, setHasDuplicateKey] = useState(true);
  const [hasTriangleAndVest, setHasTriangleAndVest] = useState(true);
  const [hasManuals, setHasManuals] = useState(true);
  const [cleanExterior, setCleanExterior] = useState(true);
  const [cleanInterior, setCleanInterior] = useState(true);

  const [signatureChecked, setSignatureChecked] = useState(false);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDelivery({
      deliveredMileage: parseInt(mileage, 10) || vehicle.mileage,
      fuelLevel,
      hasSpareTire,
      hasToolkit,
      hasDuplicateKey,
      hasTriangleAndVest,
      hasManuals,
      cleanExterior,
      cleanInterior,
      signedAt: new Date().toISOString(),
      receiverName: buyerName,
      receiverRut: buyerRut,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Acta Digital de Entrega y Recepción Conforme</h3>
              <p className="text-[11px] text-slate-400">
                Checklist de 10 puntos para entrega física de {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFinish} className="p-6 space-y-5 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <Label htmlFor="delKm" className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Kilometraje Exacto al Momento de Entrega
              </Label>
              <Input
                id="delKm"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                required
                className="mt-1 font-bold"
              />
            </div>

            <div>
              <Label className="flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-emerald-600" /> Nivel de Combustible en Tablero
              </Label>
              <select
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value as any)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 mt-1"
              >
                <option value="1/4">1/4 Estanque</option>
                <option value="1/2">1/2 Estanque</option>
                <option value="3/4">3/4 Estanque</option>
                <option value="Lleno">Estanque Lleno (100%)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Checklist de Equipamiento y Accesorios Entregados
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: "Copia de llave original (Duplicado)", val: hasDuplicateKey, set: setHasDuplicateKey },
                { label: "Rueda de repuesto en buen estado", val: hasSpareTire, set: setHasSpareTire },
                { label: "Gata mecánica y llave de ruedas", val: hasToolkit, set: setHasToolkit },
                { label: "Triángulo y chaleco reflectante reglamentario", val: hasTriangleAndVest, set: setHasTriangleAndVest },
                { label: "Manual de usuario y póliza de garantía", val: hasManuals, set: setHasManuals },
                { label: "Lavado y limpieza exterior conforme", val: cleanExterior, set: setCleanExterior },
                { label: "Limpieza y sanitización interior conforme", val: cleanInterior, set: setCleanInterior },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={signatureChecked}
                onChange={(e) => setSignatureChecked(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                required
              />
              <span className="text-[11px] leading-relaxed text-emerald-950 font-medium">
                Yo, <strong>{buyerName}</strong> (RUT: {buyerRut}), declaro recibir a mi entera conformidad el vehículo patente <strong>{vehicle.licensePlate}</strong>, con toda su documentación y accesorios detallados en esta acta.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!signatureChecked}
              className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Firmar y Completar Entrega del Auto</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
