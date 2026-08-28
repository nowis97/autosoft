"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { WhatsAppChatSimulator } from "@/components/copilot/WhatsAppChatSimulator";
import { ScheduledAppointmentsCard } from "@/components/copilot/ScheduledAppointmentsCard";
import { CopilotSettingsCard } from "@/components/copilot/CopilotSettingsCard";
import { Bot, MessageSquare, Flame, Clock, Sparkles } from "lucide-react";

export default function CopilotPage() {
  const tenant = store.getTenant();
  const inventory = store.getVehicles();
  const [appointments, setAppointments] = useState(store.getAppointments());

  const handleAppointmentCreated = (appoData: any) => {
    const created = store.createAppointment({
      tenantId: tenant.id,
      leadName: appoData.leadName,
      leadPhone: appoData.leadPhone,
      vehicleName: appoData.vehicleName,
      date: appoData.date,
      time: appoData.time,
      status: "SCHEDULED",
      notes: "Agendado en tiempo real desde el simulador de Copiloto IA.",
    });
    setAppointments([...store.getAppointments()]);
  };

  const handleConfirmAppointment = (id: string) => {
    store.updateAppointmentStatus(id, "CONFIRMED");
    setAppointments([...store.getAppointments()]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Copiloto de Ventas con IA & WhatsApp 24/7"
        subtitle="Atención autónoma de compradores, simulación de crédito y agendamiento de test drives en sucursal"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Consultas Atendidas 24/7</div>
            <div className="text-2xl font-black text-slate-900 mt-1">142 chats</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">74% fuera de horario</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Test Drives Agendados</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{appointments.length} citas</div>
            <div className="text-xs text-slate-400 mt-1">En sucursal Las Condes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Leads Calientes (🔥 Hot)</div>
            <div className="text-2xl font-black text-rose-600 mt-1">38 prospectos</div>
            <div className="text-xs text-slate-400 mt-1">Con pie listo para compra</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Tiempo de Respuesta</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">&lt; 3 seg</div>
            <div className="text-xs text-slate-400 mt-1">vs 12 hrs tradicional</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* WhatsApp Simulator Left */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Simulador en Vivo de WhatsApp con IA</span>
              </span>
              <span className="text-[11px] text-slate-400">Prueba el bot interactuando en tiempo real</span>
            </div>

            <WhatsAppChatSimulator
              tenant={tenant}
              inventory={inventory}
              onAppointmentCreated={handleAppointmentCreated}
            />
          </div>

          {/* Settings & Appointments Right */}
          <div className="lg:col-span-5 space-y-6">
            <ScheduledAppointmentsCard
              appointments={appointments}
              onConfirmAppointment={handleConfirmAppointment}
            />

            <CopilotSettingsCard tenant={tenant} />
          </div>
        </div>
      </main>
    </div>
  );
}
