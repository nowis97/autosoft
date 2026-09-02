"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP, validateRUT } from "@/lib/chilean-utils";
import { ContractTemplateType, ContractFinancialAdjustment } from "@/types";
import {
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TEMPLATES: { key: ContractTemplateType; label: string }[] = [
  { key: "NOTA_VENTA", label: "Nota de Venta" },
  { key: "NOTA_COMPRA", label: "Nota de Compra" },
  { key: "CONSIGNACION", label: "Consignación" },
  { key: "RESERVACION", label: "Reservación" },
  { key: "COTIZACION", label: "Cotización" },
  { key: "CIERRE_NEGOCIO", label: "Cierre de Negocio" },
  { key: "FICHA_TECNICA", label: "Ficha Técnica" },
];

export function DocumentTemplateViewer() {
  const [activeTemplate, setActiveTemplate] = useState<ContractTemplateType>("NOTA_VENTA");
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  // Client info state
  const [clientName, setClientName] = useState("Cliente Ejemplo");
  const [clientRut, setClientRut] = useState("12.345.678-9");
  const [clientPhone, setClientPhone] = useState("+56 9 1234 5678");
  const [clientEmail, setClientEmail] = useState("cliente@ejemplo.com");
  const [clientAddress, setClientAddress] = useState("Calle Ejemplo 123, Santiago");

  // Financial Line Items
  const [adjustment, setAdjustment] = useState<ContractFinancialAdjustment>({
    basePriceCLP: selectedVehicle?.priceCash || 16000000,
    priceAdjustmentCLP: -1000000,
    gestoriaFeeCLP: 50000,
    additionalInsuranceCLP: 100000,
    accessoriesCLP: 50000,
    totalPriceCLP: 15200000,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculateTotal = (base: number, adj: number, gest: number, ins: number, acc: number) => {
    return base + adj + gest + ins + acc;
  };

  const handleUpdatePrice = (field: keyof ContractFinancialAdjustment, val: number) => {
    const updated = { ...adjustment, [field]: val };
    updated.totalPriceCLP = calculateTotal(
      updated.basePriceCLP,
      updated.priceAdjustmentCLP,
      updated.gestoriaFeeCLP,
      updated.additionalInsuranceCLP,
      updated.accessoriesCLP
    );
    setAdjustment(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Templates Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.key}
              onClick={() => setActiveTemplate(tpl.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTemplate === tpl.key
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleSave} size="sm" className="gap-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Guardar cambios</span>
          </Button>
          <Button onClick={() => window.print()} variant="outline" size="sm" className="gap-1.5 text-xs font-bold rounded-xl">
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Documento y términos legales guardados correctamente.</span>
        </div>
      )}

      {/* Document Workspace (Interactive Letterhead Preview) */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-lg max-w-4xl mx-auto space-y-8 text-slate-800 font-sans">
        {/* Dealership & Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{tenant.name}</h2>
            <p className="text-xs text-slate-500 font-semibold">RUT: {tenant.rut || "76.452.189-K"}</p>
            <p className="text-xs text-slate-500">Email: {tenant.email || "contacto@dealership.cl"}</p>
            <p className="text-xs text-slate-500">Tel: {tenant.phone || "+56 9 8765 4321"} · Web: {tenant.customDomain || `${tenant.slug}.autosoft.cl`}</p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
              {TEMPLATES.find((t) => t.key === activeTemplate)?.label}
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">N° 12345</p>
            <p className="text-[11px] text-slate-400">Fecha: {new Date().toLocaleDateString("es-CL")}</p>
          </div>
        </div>

        {/* Client Details Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Datos del Cliente</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nombre Completo:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">RUT Chileno:</span>
              <input
                type="text"
                value={clientRut}
                onChange={(e) => setClientRut(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Teléfono de Contacto:</span>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Dirección / Comuna:</span>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Technical Specs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Detalles del Vehículo</h4>
            <select
              value={selectedVehicle?.id}
              onChange={(e) => {
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) {
                  setSelectedVehicle(found);
                  handleUpdatePrice("basePriceCLP", found.priceCash);
                }
              }}
              className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Marca y Modelo</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Año y Color</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.year} · {selectedVehicle?.color}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Patente</span>
              <span className="font-black text-slate-900 uppercase">{selectedVehicle?.licensePlate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Kilometraje</span>
              <span className="font-extrabold text-slate-900">{selectedVehicle?.mileage?.toLocaleString("es-CL")} km</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown & Itemized Pricing */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Detalle Económico de la Operación</h4>
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600 font-semibold">Precio Publicado del Vehículo</span>
              <span className="font-bold text-slate-900 tabular-nums">{formatCLP(adjustment.basePriceCLP)}</span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span className="font-semibold">- Ajuste / Descuento de Precio</span>
              <input
                type="number"
                value={adjustment.priceAdjustmentCLP}
                onChange={(e) => handleUpdatePrice("priceAdjustmentCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Gestoría y Gastos de Transferencia</span>
              <input
                type="number"
                value={adjustment.gestoriaFeeCLP}
                onChange={(e) => handleUpdatePrice("gestoriaFeeCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Seguro y Garantía Adicional</span>
              <input
                type="number"
                value={adjustment.additionalInsuranceCLP}
                onChange={(e) => handleUpdatePrice("additionalInsuranceCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700">
              <span className="font-semibold">+ Accesorios y Equipamiento</span>
              <input
                type="number"
                value={adjustment.accessoriesCLP}
                onChange={(e) => handleUpdatePrice("accessoriesCLP", Number(e.target.value))}
                className="w-32 text-right font-bold bg-slate-50 border border-slate-200 rounded-lg p-1"
              />
            </div>

            <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900 uppercase tracking-wider">TOTAL A PAGAR</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">{formatCLP(adjustment.totalPriceCLP)}</span>
            </div>
          </div>
        </div>

        {/* Legal Chilean Clauses */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Términos y Condiciones Legales</h4>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Ley 21.398 Pro-Consumidor & Ley 19.799 Firma Electrónica</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] leading-relaxed text-slate-600 space-y-2">
            <p>
              Por el presente instrumento, el comprador se responsabiliza de cualquier siniestro, accidente o daño que pudiere producirse a terceros una vez recibido el vehículo. Esta nota de venta no es cancelable ni válida como factura y queda sujeta a confirmación de fondos por la empresa.
            </p>
            <p>
              La entrega material del vehículo usado se realizará tras haberse verificado el pago total del saldo y suscrito el mandato especial de transferencia ante notario digital. El vehículo cuenta con la cobertura de garantía legal según el marco vigente.
            </p>
          </div>
        </div>

        {/* Dual Signatures Block */}
        <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-center text-xs">
          <div className="space-y-2">
            <div className="h-16 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-400 text-sm">Representante Legal</span>
            </div>
            <p className="font-extrabold text-slate-900">{tenant.name}</p>
            <p className="text-[10px] text-slate-400">RUT: {tenant.rut || "76.452.189-K"}</p>
          </div>

          <div className="space-y-2">
            <div className="h-16 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
              <span className="font-serif italic text-slate-400 text-sm">{clientName}</span>
            </div>
            <p className="font-extrabold text-slate-900">{clientName}</p>
            <p className="text-[10px] text-slate-400">RUT: {clientRut}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
