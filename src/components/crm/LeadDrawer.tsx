"use client";

import React, { useState } from "react";
import { Lead } from "@/types";
import { formatCLP } from "@/lib/chilean-utils";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import {
  X,
  MessageCircle,
  Phone,
  Car,
  UserCheck,
} from "lucide-react";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function LeadDrawer({ lead, onClose, onUpdate }: LeadDrawerProps) {
  if (!lead) return null;

  const [notes, setNotes] = useState(lead.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const vehicle = lead.vehicleId ? store.getVehicleById(lead.vehicleId) : undefined;
  const users = store.getUsers();
  const assignedUser = users.find((u) => u.id === lead.assignedUserId);

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    store.updateLeadNotes(lead.id, notes);
    setTimeout(() => {
      setIsSavingNotes(false);
      onUpdate();
    }, 300);
  };

  const handleStatusChange = (newStatus: any) => {
    store.updateLeadStatus(lead.id, newStatus);
    onUpdate();
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const waMessage = vehicle
    ? `Hola ${lead.name}, te escribe ${assignedUser?.name || "un asesor"} de Automotora Oriente respecto a tu consulta por el ${vehicle.brand} ${vehicle.model} ${vehicle.year} (${formatCLP(vehicle.priceCash)}). ¿En qué podemos ayudarte?`
    : `Hola ${lead.name}, te escribimos de Automotora Oriente respecto a tu consulta. ¿Cómo estás?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {lead.channel}
                </Badge>
                <span className="text-xs text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString("es-CL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              {lead.rut && <p className="text-xs text-slate-500 font-mono">RUT: {lead.rut}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="w-full gap-2 font-bold shadow-xs">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Abrir WhatsApp</span>
                </Button>
              </a>

              <a href={`tel:${lead.phone}`}>
                <Button variant="outline" className="w-full gap-2 font-medium">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Llamar ({lead.phone})</span>
                </Button>
              </a>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Etapa del Pipeline
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "NEW", label: "Nuevo" },
                  { id: "CONTACTED", label: "Contactado" },
                  { id: "INTERESTED", label: "Interesado" },
                  { id: "NEGOTIATION", label: "Negociación" },
                  { id: "WON", label: "Vendido 🎉" },
                  { id: "LOST", label: "Perdido" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleStatusChange(st.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      lead.status === st.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {vehicle && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Vehículo de Interés</span>
                </div>
                <div className="flex gap-3">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.model}
                    className="w-20 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                      </div>
                      <div className="text-xs text-slate-500">{vehicle.version}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatCLP(vehicle.priceCash)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {lead.tradeInDetails && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                  Auto en Parte de Pago (Retoma)
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {lead.tradeInDetails.brand} {lead.tradeInDetails.model} ({lead.tradeInDetails.year})
                </div>
                <div className="text-xs text-slate-600 mt-1 flex justify-between">
                  <span>KM: {lead.tradeInDetails.mileage?.toLocaleString("es-CL")} km</span>
                  <span className="font-bold text-amber-900">
                    Tasación esperada: {formatCLP(lead.tradeInDetails.expectedPrice)}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Notas y Seguimiento Comercial
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Registra acuerdos, fechas de visita o condiciones especiales de crédito..."
                className="min-h-[100px] text-sm"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleSaveNotes} disabled={isSavingNotes}>
                  {isSavingNotes ? "Guardando..." : "Guardar Nota"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Asignado a: <strong className="text-slate-700">{assignedUser?.name || "Sin asignar"}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
