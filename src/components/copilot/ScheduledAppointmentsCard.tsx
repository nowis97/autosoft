import React from "react";
import { AppointmentBooking } from "@/types";
import { Calendar, Clock, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduledAppointmentsCardProps {
  appointments: AppointmentBooking[];
  onConfirmAppointment: (id: string) => void;
}

export function ScheduledAppointmentsCard({
  appointments,
  onConfirmAppointment,
}: ScheduledAppointmentsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Visitas & Test Drives Agendados por IA
            </h3>
            <p className="text-[11px] text-slate-400">
              Citas presenciales en sucursal agendadas de forma autónoma 24/7
            </p>
          </div>
        </div>

        <span className="text-xs font-black bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
          {appointments.length} agendadas
        </span>
      </div>

      <div className="space-y-3">
        {appointments.map((appo) => (
          <div
            key={appo.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{appo.leadName}</span>
                <span className="text-slate-400">({appo.leadPhone})</span>
                <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                  appo.status === "CONFIRMED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {appo.status === "CONFIRMED" ? "Confirmada" : "Por Confirmar"}
                </span>
              </div>
              <div className="text-slate-600 font-semibold flex items-center gap-2">
                <span>🚗 {appo.vehicleName}</span>
                <span>•</span>
                <span className="text-purple-700 font-bold">📅 {appo.date} a las {appo.time}</span>
              </div>
              {appo.notes && <p className="text-[11px] text-slate-400">{appo.notes}</p>}
            </div>

            {appo.status !== "CONFIRMED" && (
              <Button
                size="sm"
                onClick={() => onConfirmAppointment(appo.id)}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmar con Vendedor</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
