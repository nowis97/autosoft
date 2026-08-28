"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { WarrantyTicket, AftersalesReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MessageCircle, AlertTriangle, Plus, CheckCircle2, Clock } from "lucide-react";

export default function AftersalesPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [tickets, setTickets] = useState(store.getWarrantyTickets());
  const [reminders, setReminders] = useState(store.getAftersalesReminders());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendWhatsAppReminder = (reminder: AftersalesReminder) => {
    store.markReminderSent(reminder.id);
    setReminders([...store.getAftersalesReminders()]);
    const phoneClean = reminder.clientPhone.replace(/[^0-9]/g, "");
    const url = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(reminder.messageText)}`;
    window.open(url, "_blank");
    setSuccessMessage(`¡Recordatorio de mantenimiento enviado por WhatsApp a ${reminder.clientName}!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCreateWarrantyTicket = () => {
    const targetVeh = vehicles.find((v) => v.status === "SOLD") || vehicles[0];
    const created = store.createWarrantyTicket({
      tenantId: tenant.id,
      vehicleId: targetVeh.id,
      clientName: "Gonzalo Valenzuela",
      clientPhone: "+56 9 9876 5432",
      clientRut: "11.111.111-1",
      issueDescription: "Revisión en garantía legal por testigo de pastillas de freno.",
      category: "FRENOS_SUSPENSION",
      deliveryDate: "2026-08-25",
    });
    setTickets([...store.getWarrantyTickets()]);
    setSuccessMessage(`¡Ticket de Garantía Legal #${created.id} (Ley 21.398 6 Meses) ingresado a taller!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Post-Venta, Garantía Legal & Recordatorios WhatsApp"
        subtitle="Gestión de garantía técnica de 6 meses (Ley 21.398 Pro-Consumidor) y seguimiento post-entrega a 30, 90 y 180 días"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Garantía Legal Vigente</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">6 Meses</div>
            <div className="text-xs text-slate-400 mt-1">Ley 21.398 Pro-Consumidor</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Tickets de Garantía</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tickets.length}</div>
            <div className="text-xs text-slate-400 mt-1">Atención técnica en taller</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Recordatorios Pendientes</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {reminders.filter((r) => r.status === "PENDING").length}
            </div>
            <div className="text-xs text-blue-500 font-semibold mt-1">Fidelización por WhatsApp</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Tasa de Recompra</div>
            <div className="text-2xl font-black text-purple-600 mt-1">24%</div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Clientes fidelizados</div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Compliance Legal Post-Venta</div>
              <div className="font-extrabold text-slate-900 text-sm">
                Protección Legal y Trazabilidad SERNAC ({tenant.name})
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateWarrantyTicket}
            className="font-bold text-xs gap-1.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Ingresar Ticket de Garantía</span>
          </Button>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Warranty Tickets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tickets de Garantía Legal 6 Meses ({tickets.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Ley 21.398</span>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{t.id}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-0.5">{t.clientName}</h4>
                      <div className="text-[11px] text-slate-500">RUT: {t.clientRut} • Tel: {t.clientPhone}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                    "{t.issueDescription}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-semibold">
                    <span>Entrega: {t.deliveryDate}</span>
                    <span className="text-emerald-700">Vence: {t.warrantyExpiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Reminders */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Recordatorios Programados de Mantenimiento ({reminders.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">WhatsApp Automation</span>
            </div>

            <div className="space-y-3">
              {reminders.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                        {r.reminderType.replace(/_/g, " ")}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1.5">{r.clientName}</h4>
                      <div className="text-[11px] text-slate-500">{r.vehicleDescription}</div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === "SENT" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {r.status === "SENT" ? "Enviado" : "Pendiente"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                    "{r.messageText}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Fecha sugerida: {r.dueDate}</span>
                    <Button
                      size="sm"
                      onClick={() => handleSendWhatsAppReminder(r)}
                      className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-7"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Enviar WhatsApp</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
