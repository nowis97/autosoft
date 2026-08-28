import React, { useState } from "react";
import { Vehicle, ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Wrench, X, Sparkles, PlusCircle } from "lucide-react";

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  defaultVehicleId?: string;
  onSaveOrder: (data: {
    vehicleId: string;
    category: ServiceCategory;
    description: string;
    providerName: string;
    costCLP: number;
    invoiceNumber: string;
    estimatedCompletionDate: string;
  }) => void;
}

export function ServiceOrderModal({
  isOpen,
  onClose,
  vehicles,
  defaultVehicleId,
  onSaveOrder,
}: ServiceOrderModalProps) {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId || vehicles[0]?.id || "");
  const [category, setCategory] = useState<ServiceCategory>("MECANICA");
  const [description, setDescription] = useState("Cambio de pastillas de freno delanteras y rectificado de discos.");
  const [providerName, setProviderName] = useState("Frenos & Mecánica Express");
  const [costCLP, setCostCLP] = useState(145000);
  const [invoiceNumber, setInvoiceNumber] = useState("FAC-10293");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("2026-08-30");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOrder({
      vehicleId,
      category,
      description,
      providerName,
      costCLP,
      invoiceNumber,
      estimatedCompletionDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Nueva Orden de Trabajo / Taller</div>
              <div className="text-[11px] text-slate-400">Puesta a punto y mantenimiento de stock</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Vehículo a Reparar / Preparar</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white font-semibold"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - Patente: {v.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Categoría del Servicio</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "MECANICA", label: "⚙️ Mecánica General" },
                { id: "PINTURA_DESABOLLADURA", label: "🎨 Pintura / Carrocería" },
                { id: "NEUMATICOS_FRENOS", label: "🛞 Neumáticos & Frenos" },
                { id: "DETAILING_ESTETICA", label: "✨ Detailing & Lavado" },
                { id: "TRAMITES_REVISION", label: "📋 Trámites / Revisión" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as ServiceCategory)}
                  className={`p-2 rounded-lg border text-left font-semibold transition-all ${
                    category === c.id
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descripción del Trabajo Realizado</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Proveedor / Taller Externo</label>
              <input
                type="text"
                required
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Costo Total (CLP)</label>
              <input
                type="number"
                min={0}
                step={1000}
                required
                value={costCLP}
                onChange={(e) => setCostCLP(parseInt(e.target.value, 10))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">N° Factura / Boleta</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha Entrega Estimada</label>
              <input
                type="date"
                value={estimatedCompletionDate}
                onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs font-semibold">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Cargar Gasto al Vehículo</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
