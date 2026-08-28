"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles, Building2 } from "lucide-react";

export default function InsurancePage() {
  const policies = store.getInsurancePolicies();
  const transfers = store.getTransfers();
  const vehicles = store.getVehicles();

  const totalCommissions = policies
    .filter((p) => p.status === "ACTIVE")
    .reduce((sum, p) => sum + p.dealerCommissionCLP, 0);

  const partners = [
    { name: "BCI Seguros", commissionRate: "$45.000 CLP / póliza", activeCount: 1, status: "Activo" },
    { name: "HDI Seguros", commissionRate: "$45.000 CLP / póliza", activeCount: 1, status: "Activo" },
    { name: "Mapfre", commissionRate: "$50.000 CLP / póliza", activeCount: 0, status: "Activo" },
    { name: "Consorcio", commissionRate: "$40.000 CLP / póliza", activeCount: 0, status: "Activo" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Seguros Automotrices & Comisiones"
        subtitle="Emisión en salón de pólizas multi-aseguradora y liquidación de comisiones para la automotora"
      />

      <main className="p-6 max-w-6xl w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Pólizas Emitidas</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{policies.length} pólizas</div>
            <div className="text-xs text-slate-400 mt-1">Con BCI, HDI y Mapfre</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Comisiones Totales Ganadas</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCLP(totalCommissions)}
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Ingreso 100% adicional para el dealer
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Tasa de Penetración en Salón</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">75%</div>
            <div className="text-xs text-slate-400 mt-1">Autos entregados con seguro activo</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Compañías Aseguradoras Aliadas</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {partners.map((p) => (
              <div key={p.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-sm text-slate-900">{p.name}</div>
                <div className="text-xs text-slate-500">Comisión fija: <strong className="text-emerald-700">{p.commissionRate}</strong></div>
                <Badge variant="available" className="text-[10px]">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Registro de Pólizas Contratadas</h3>
            <p className="text-xs text-slate-500">Pólizas generadas durante el cierre de venta y entrega</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Póliza N°</th>
                  <th className="py-3 px-4">Aseguradora</th>
                  <th className="py-3 px-4">Vehículo</th>
                  <th className="py-3 px-4">Deducible</th>
                  <th className="py-3 px-4">Prima Mensual</th>
                  <th className="py-3 px-4">Comisión Dealer</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {policies.map((p) => {
                  const transfer = transfers.find((t) => t.id === p.transferId);
                  const car = transfer ? vehicles.find((v) => v.id === transfer.vehicleId) : undefined;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.policyNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{p.carrier}</td>
                      <td className="py-3.5 px-4">
                        {car ? `${car.brand} ${car.model} (${car.licensePlate})` : "Vehículo"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{p.deductibleUF} UF</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatCLP(p.monthlyPremiumCLP)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">{formatCLP(p.dealerCommissionCLP)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={p.status === "ACTIVE" ? "available" : "reserved"}>
                          {p.status === "ACTIVE" ? "Póliza Activa" : "En Trámite"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
