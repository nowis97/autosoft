"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileCheck2, ShieldCheck, ArrowRight, Scale } from "lucide-react";
import { NotarialContractModal } from "@/components/transfers/NotarialContractModal";
import { DeliveryChecklistModal } from "@/components/transfers/DeliveryChecklistModal";
import { DigitalNotaryModal } from "@/components/transfers/DigitalNotaryModal";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(store.getTransfers());
  const [vehicles, setVehicles] = useState(store.getVehicles());
  const tenant = store.getTenant();
  const [selectedContractTransfer, setSelectedContractTransfer] = useState<any>(null);
  const [selectedDeliveryTransfer, setSelectedDeliveryTransfer] = useState<any>(null);
  const [selectedNotaryTransfer, setSelectedNotaryTransfer] = useState<any>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTransfers(store.getTransfers());
      setVehicles(store.getVehicles());
    });
    return unsub;
  }, []);

  const stats = store.getStats();

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Transferencias Notariales & Cierre Digital"
        subtitle="Expedientes de compraventa, liquidación de impuesto 1.5% e inscripción en Registro Civil"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Transferencias Totales</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{transfers.length} expedientes</div>
            <div className="text-xs text-emerald-600 mt-1 font-semibold">
              {stats.totalTransfersCompleted} inscritas exitosamente
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Impuestos Liquidados (1.5%)</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {formatCLP(transfers.reduce((sum, t) => sum + t.transferTax15, 0))}
            </div>
            <div className="text-xs text-slate-400 mt-1">D.L. 3475 SII</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Tiempo Promedio de Firma</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">&lt; 8 minutos</div>
            <div className="text-xs text-slate-400 mt-1">vs 4 días en notaría física</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Comisiones Seguros Ganadas</span>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {formatCLP(stats.totalInsuranceCommissions)}
            </div>
            <div className="text-xs text-purple-600 mt-1">Ingreso neto adicional</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Órdenes de Transferencia</h3>
              <p className="text-xs text-slate-500">Expedientes notariales generados en salón</p>
            </div>

            <Link href="/app/transfers/new">
              <Button size="sm" className="gap-1.5 font-bold shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Nueva Transferencia / Cierre de Venta</span>
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Folio / Fecha</th>
                  <th className="py-3 px-4">Vehículo / Patente</th>
                  <th className="py-3 px-4">Comprador (RUT)</th>
                  <th className="py-3 px-4">Precio Venta</th>
                  <th className="py-3 px-4">Impuesto (1.5%)</th>
                  <th className="py-3 px-4">Seguro Asociado</th>
                  <th className="py-3 px-4">Estado Notarial</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transfers.map((t) => {
                  const car = vehicles.find((v) => v.id === t.vehicleId);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {t.id}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(t.createdAt).toLocaleDateString("es-CL")}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {car ? (
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900">{car.brand} {car.model}</div>
                            <LicensePlateBadge plate={car.licensePlate} size="sm" />
                          </div>
                        ) : (
                          "Auto en stock"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{t.buyerName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{t.buyerRut}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">{formatCLP(t.salePrice)}</td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-blue-700">{formatCLP(t.transferTax15)}</div>
                        <div className="text-[10px] text-slate-400">Total: {formatCLP(t.totalCost)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {t.insurancePolicy ? (
                          <Badge variant="available" className="text-[10px] font-bold">
                            {t.insurancePolicy.carrier} ({formatCLP(t.insurancePolicy.dealerCommissionCLP)})
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Sin seguro</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={t.status === "REGISTERED" ? "available" : "reserved"}
                          className="font-bold"
                        >
                          {t.status === "REGISTERED" ? "Inscrito Registro Civil" : "Pendiente de Firma"}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] font-bold gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                          onClick={() => setSelectedNotaryTransfer({ transfer: t, vehicle: car || vehicles[0] })}
                        >
                          <Scale className="w-3.5 h-3.5 text-blue-600" />
                          <span>Mandato Notarial</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] font-semibold"
                          onClick={() => setSelectedContractTransfer({ transfer: t, vehicle: car || vehicles[0] })}
                        >
                          Ver Contrato
                        </Button>

                        {t.status !== "REGISTERED" && car && (
                          <Button
                            size="sm"
                            className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => setSelectedDeliveryTransfer({ transfer: t, vehicle: car || vehicles[0] })}
                          >
                            Entregar Auto
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedNotaryTransfer && (
        <DigitalNotaryModal
          isOpen={true}
          transfer={selectedNotaryTransfer.transfer}
          vehicle={selectedNotaryTransfer.vehicle || vehicles[0]}
          tenant={tenant}
          onClose={() => setSelectedNotaryTransfer(null)}
        />
      )}

      {selectedContractTransfer && (
        <NotarialContractModal
          vehicle={selectedContractTransfer.vehicle}
          transfer={selectedContractTransfer.transfer}
          onClose={() => setSelectedContractTransfer(null)}
          onConfirmSignature={() => {
            alert("Contrato firmado electrónicamente con éxito.");
            setSelectedContractTransfer(null);
          }}
        />
      )}

      {selectedDeliveryTransfer && (
        <DeliveryChecklistModal
          vehicle={selectedDeliveryTransfer.vehicle}
          buyerName={selectedDeliveryTransfer.transfer.buyerName}
          buyerRut={selectedDeliveryTransfer.transfer.buyerRut}
          onClose={() => setSelectedDeliveryTransfer(null)}
          onConfirmDelivery={(act) => {
            store.completeTransfer(selectedDeliveryTransfer.transfer.id, act);
            alert("¡Entrega completada! El auto pasó automáticamente a estado VENDIDO y se despublicó de todos los portales.");
            setSelectedDeliveryTransfer(null);
          }}
        />
      )}
    </div>
  );
}
