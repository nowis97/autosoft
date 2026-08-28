import React from "react";
import { ServiceOrder, Vehicle } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Wrench } from "lucide-react";

interface ServiceOrdersTableProps {
  orders: ServiceOrder[];
  vehicles: Vehicle[];
  onCompleteOrder: (id: string) => void;
}

export function ServiceOrdersTable({
  orders,
  vehicles,
  onCompleteOrder,
}: ServiceOrdersTableProps) {
  const getCategoryBadge = (cat: ServiceOrder["category"]) => {
    if (cat === "MECANICA") return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">⚙️ Mecánica</span>;
    if (cat === "PINTURA_DESABOLLADURA") return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-bold">🎨 Pintura</span>;
    if (cat === "NEUMATICOS_FRENOS") return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">🛞 Neumáticos</span>;
    if (cat === "DETAILING_ESTETICA") return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">✨ Detailing</span>;
    return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">📋 Trámites</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Wrench className="w-4 h-4 text-blue-600" />
          <span>Libro de Órdenes de Trabajo del Taller ({orders.length})</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">Vehículo</th>
              <th className="py-3 px-3">Categoría</th>
              <th className="py-3 px-3">Descripción / Repuestos</th>
              <th className="py-3 px-3">Proveedor</th>
              <th className="py-3 px-3">Costo (CLP)</th>
              <th className="py-3 px-3">Estado</th>
              <th className="py-3 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {orders.map((ord) => {
              const vehicle = vehicles.find((v) => v.id === ord.vehicleId);

              return (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{vehicle?.brand} {vehicle?.model}</div>
                    {vehicle && <LicensePlateBadge plate={vehicle.licensePlate} size="sm" />}
                  </td>
                  <td className="py-3 px-3">{getCategoryBadge(ord.category)}</td>
                  <td className="py-3 px-3">
                    <div className="max-w-xs">{ord.description}</div>
                    {ord.invoiceNumber && (
                      <span className="text-[10px] text-slate-400">Doc: {ord.invoiceNumber}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{ord.providerName}</td>
                  <td className="py-3 px-3 font-black text-slate-900">{formatCLP(ord.costCLP)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {ord.status === "COMPLETED" ? "Completado" : "En Taller"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ord.status !== "COMPLETED" ? (
                      <Button
                        size="sm"
                        onClick={() => onCompleteOrder(ord.id)}
                        className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2.5 gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Finalizar</span>
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Listo</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
