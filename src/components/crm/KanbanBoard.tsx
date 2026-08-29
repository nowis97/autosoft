"use client";

import React, { useState } from "react";
import { Lead, LeadStatus } from "@/types";
import { store } from "@/lib/store";
import { LeadDrawer } from "./LeadDrawer";
import { Clock, MessageCircle, Phone } from "lucide-react";

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: "NEW", title: "Nuevos", color: "bg-blue-500" },
  { id: "CONTACTED", title: "Contactados", color: "bg-purple-500" },
  { id: "INTERESTED", title: "Interesados", color: "bg-amber-500" },
  { id: "NEGOTIATION", title: "En Negociación", color: "bg-orange-500" },
  { id: "WON", title: "Ventas Cerradas", color: "bg-emerald-500" },
  { id: "LOST", title: "Perdidos", color: "bg-slate-400" },
];

export function KanbanBoard() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const leads = store.getLeads();
  const vehicles = store.getVehicles();

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    if (selectedLead) {
      const updated = store.getLeadById(selectedLead.id);
      setSelectedLead(updated || null);
    }
  };

  const channelBadges: Record<string, string> = {
    WEB: "bg-blue-50 text-blue-700 border-blue-200",
    WHATSAPP: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CHILEAUTOS: "bg-red-50 text-red-700 border-red-200",
    MERCADOLIBRE: "bg-amber-50 text-amber-800 border-amber-200",
    WALK_IN: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const handleDirectWhatsApp = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    const car = vehicles.find((v) => v.id === lead.vehicleId);
    const msg = encodeURIComponent(
      "Hola " + lead.name + "! Te contacto de Automotora Oriente por tu consulta" +
      (car ? " sobre el " + car.brand + " " + car.model + " (" + car.year + ")." : ".")
    );
    window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
  };

  const handleDirectCall = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    window.location.href = "tel:" + lead.phone;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col min-h-[400px] md:min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={"w-2.5 h-2.5 rounded-full " + col.color} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {colLeads.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colLeads.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-slate-400 text-center px-2">
                    Sin prospectos
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const car = vehicles.find((v) => v.id === lead.vehicleId);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                              {lead.name}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">{lead.phone}</div>
                          </div>
                          <span
                            className={"text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 " + (
                              channelBadges[lead.channel] || "bg-slate-50 text-slate-700"
                            )}
                          >
                            {lead.channel}
                          </span>
                        </div>

                        {car && (
                          <div className="text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 font-medium truncate">
                            🚗 {car.brand} {car.model} ({car.year})
                          </div>
                        )}

                        {lead.tradeInDetails && (
                          <div className="text-[11px] text-amber-700 font-semibold truncate bg-amber-50/50 p-1 rounded">
                            🔄 Retoma: {lead.tradeInDetails.brand} {lead.tradeInDetails.model}
                          </div>
                        )}

                        {/* 1-Tap Mobile Actions */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleDirectWhatsApp(e, lead)}
                            className="flex-1 py-1.5 px-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs"
                            title="WhatsApp 1-Toque"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDirectCall(e, lead)}
                            className="py-1.5 px-2.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center"
                            title="Llamar"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(lead.createdAt).toLocaleDateString("es-CL", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>

                          <span className="text-blue-600 font-bold hover:underline">
                            Ficha →
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleRefresh}
      />
    </div>
  );
}
