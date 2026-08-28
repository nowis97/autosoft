import React, { useState } from "react";
import { DamagePoint } from "@/types";
import { Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DamageMapSelectorProps {
  damagePoints: DamagePoint[];
  onChangeDamagePoints: (points: DamagePoint[]) => void;
  readOnly?: boolean;
}

export function DamageMapSelector({
  damagePoints,
  onChangeDamagePoints,
  readOnly = false,
}: DamageMapSelectorProps) {
  const [selectedType, setSelectedType] = useState<DamagePoint["type"]>("RAYON");
  const [selectedSeverity, setSelectedSeverity] = useState<DamagePoint["severity"]>("LEVE");
  const [description, setDescription] = useState("");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPoint: DamagePoint = {
      id: `dmg-${Date.now()}`,
      x,
      y,
      type: selectedType,
      severity: selectedSeverity,
      description: description || `Daño tipo ${selectedType} (${selectedSeverity})`,
    };

    onChangeDamagePoints([...damagePoints, newPoint]);
    setDescription("");
  };

  const handleRemovePoint = (id: string) => {
    onChangeDamagePoints(damagePoints.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-slate-900">Agregar Punto de Daño en Carrocería</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Tipo de Daño</label>
              <select
                value={selectedType}
                onChange={(e: any) => setSelectedType(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="RAYON">✏️ Rayón / Raspón</option>
                <option value="ABOLLADURA">🔨 Abolladura</option>
                <option value="TRIZADURA">💥 Trizadura de Vidrio</option>
                <option value="REPINTADO">🎨 Pieza Repintada</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Severidad</label>
              <select
                value={selectedSeverity}
                onChange={(e: any) => setSelectedSeverity(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="LEVE">🟢 Leve (Detailing / Pulido)</option>
                <option value="MODERADO">🟡 Moderado (Desabolladura)</option>
                <option value="GRAVE">🔴 Grave (Cambio de pieza)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Detalle / Ubicación</label>
              <input
                type="text"
                placeholder="Ej. Puerta trasera derecha"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white"
              />
            </div>
          </div>
          <p className="text-[10px] text-blue-600 font-semibold">
            👉 Haz clic sobre el vehículo en el diagrama inferior para posicionar el pin de daño.
          </p>
        </div>
      )}

      {/* Car Silhouette Interactive Canvas */}
      <div className="relative border-2 border-slate-200 bg-slate-900 rounded-2xl p-4 overflow-hidden select-none">
        <div
          onClick={handleCanvasClick}
          className={`relative w-full h-56 bg-slate-950/80 rounded-xl flex items-center justify-center border border-slate-800 ${
            readOnly ? "cursor-default" : "cursor-crosshair"
          }`}
        >
          {/* SVG Vehicle Blueprint Outline */}
          <svg viewBox="0 0 500 200" className="w-full h-full opacity-40 text-blue-400 stroke-current fill-none">
            {/* Top View Silhouette */}
            <path
              d="M 60 50 C 60 30, 90 20, 150 20 L 350 20 C 410 20, 440 30, 440 50 L 450 70 C 455 85, 455 115, 450 130 L 440 150 C 440 170, 410 180, 350 180 L 150 180 C 90 180, 60 170, 60 150 L 50 130 C 45 115, 45 85, 50 70 Z"
              strokeWidth="2.5"
            />
            {/* Windshield & Rear glass */}
            <path d="M 140 35 L 180 45 L 180 155 L 140 165 Z" strokeWidth="1.5" />
            <path d="M 360 35 L 320 45 L 320 155 L 360 165 Z" strokeWidth="1.5" />
            {/* Roof / Windows */}
            <line x1="180" y1="45" x2="320" y2="45" strokeWidth="1.5" />
            <line x1="180" y1="155" x2="320" y2="155" strokeWidth="1.5" />
            <circle cx="90" cy="50" r="12" strokeWidth="1.5" />
            <circle cx="90" cy="150" r="12" strokeWidth="1.5" />
            <circle cx="410" cy="50" r="12" strokeWidth="1.5" />
            <circle cx="410" cy="150" r="12" strokeWidth="1.5" />
          </svg>

          {/* Placed Damage Pins */}
          {damagePoints.map((point, index) => (
            <div
              key={point.id}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border border-white animate-bounce ${
                  point.severity === "GRAVE"
                    ? "bg-red-600"
                    : point.severity === "MODERADO"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              >
                {index + 1}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                <span className="font-bold">{point.type} ({point.severity})</span>
                <span className="text-slate-300">{point.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Damage Points Summary List */}
      {damagePoints.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Daños Constatados ({damagePoints.length})</div>
          <div className="space-y-1">
            {damagePoints.map((pt, i) => (
              <div
                key={pt.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-[10px] ${
                    pt.severity === "GRAVE" ? "bg-red-600" : pt.severity === "MODERADO" ? "bg-amber-500" : "bg-blue-500"
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <strong className="text-slate-900">{pt.type}</strong>: {pt.description}
                  </div>
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(pt.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
