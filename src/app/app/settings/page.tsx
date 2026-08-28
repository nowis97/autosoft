"use client";

import React from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus } from "lucide-react";

export default function SettingsPage() {
  const users = store.getUsers();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Equipo y Permisos de Acceso"
        subtitle="Administra los vendedores, jefes de ventas y permisos de visualización de margen"
      />

      <main className="p-6 max-w-4xl w-full space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Usuarios de la Automotora</h3>
              <p className="text-xs text-slate-500">Cada vendedor tiene su buzón de leads y WhatsApp personal</p>
            </div>
            <Button size="sm" className="gap-1.5 font-semibold text-xs">
              <Plus className="w-4 h-4" />
              <span>Invitar Asesor</span>
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-slate-500">{u.email} · {u.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={u.role === "DEALER_OWNER" ? "default" : "secondary"}>
                    {u.role === "DEALER_OWNER" ? "Dueño / Administrador" : "Vendedor de Salón"}
                  </Badge>
                  <span className="text-[11px] text-emerald-600 font-semibold">Activo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Control de Seguridad y Confidencialidad (RBAC)</span>
          </div>
          <p className="leading-relaxed">
            • Los vendedores (<strong>DEALER_SALES_REP</strong>) solo ven precios de venta al público y cuotas de financiamiento.
            El costo de compra y el margen bruto están estrictamente protegidos para los administradores.
          </p>
        </div>
      </main>
    </div>
  );
}
