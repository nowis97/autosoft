"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, Building2, Sparkles, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";
import { DealershipSetupModal } from "@/components/onboarding/DealershipSetupModal";

export function DataManagementBanner() {
  const [tenant, setTenant] = useState(store.getTenant());
  const [vehicleCount, setVehicleCount] = useState(store.getVehicles().length);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTenant(store.getTenant());
      setVehicleCount(store.getVehicles().length);
    });
    return unsub;
  }, []);

  const handleClear = () => {
    store.clearMockData();
    setShowConfirmClear(false);
    setActionMessage("¡Datos de prueba eliminados! Tu catálogo está listo para tus propios autos.");
    setTimeout(() => setActionMessage(""), 4000);
    // Suggest configuring dealership if still on default name
    if (tenant.name === "Automotora Oriente") {
      setShowSetupModal(true);
    }
  };

  const handleRestore = () => {
    store.restoreMockData();
    setActionMessage("¡Catálogo de demostración restaurado!");
    setTimeout(() => setActionMessage(""), 4000);
  };

  const isDemoActive = vehicleCount > 0 && tenant.name === "Automotora Oriente";

  return (
    <>
      <div className="bg-slate-900 text-white text-xs px-6 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          {isDemoActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              <Sparkles className="w-3 h-3" /> Modo Demostración
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              <Building2 className="w-3 h-3" /> {tenant.name}
            </span>
          )}
          <span className="text-slate-400 hidden sm:inline">
            {vehicleCount === 0
              ? "Catálogo limpio (0 vehículos en stock)"
              : `${vehicleCount} vehículos en stock | RUT: ${tenant.rut || "No configurado"}`}
          </span>
        </div>

        {actionMessage && (
          <div className="text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSetupModal(true)}
            className="h-7 text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white gap-1 px-2.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Configurar Automotora</span>
          </Button>

          {vehicleCount > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirmClear(true)}
              className="h-7 text-xs bg-red-950/40 text-red-300 border-red-800/50 hover:bg-red-900/60 hover:text-white gap-1 px-2.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Datos Demo</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRestore}
              className="h-7 text-xs bg-blue-950/40 text-blue-300 border-blue-800/50 hover:bg-blue-900/60 hover:text-white gap-1 px-2.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Demo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">¿Limpiar todos los datos de prueba?</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Esta acción borrará los vehículos de ejemplo, prospectos simulados y órdenes de servicio para que puedas
              ingresar el stock real de tu automotora.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              💡 <em>(Siempre podrás restaurar el catálogo de prueba con el botón &quot;Restaurar Demo&quot; si lo deseas).</em>
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowConfirmClear(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClear} className="gap-1.5 font-semibold">
                <Trash2 className="w-4 h-4" />
                <span>Sí, Limpiar Catálogo</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dealership Setup Modal */}
      <DealershipSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={() => {
          setActionMessage("¡Automotora actualizada con éxito!");
          setTimeout(() => setActionMessage(""), 4000);
        }}
      />
    </>
  );
}
