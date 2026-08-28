import React, { useState } from "react";
import { Vehicle, DTEType } from "@/types";
import { calculateUsedCarInvoiceTaxes } from "@/lib/chilean-utils/tax-invoicing";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { FileText, X, PlusCircle, Calculator } from "lucide-react";

interface InvoiceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSaveInvoice: (data: any) => void;
}

export function InvoiceCreationModal({
  isOpen,
  onClose,
  vehicles,
  onSaveInvoice,
}: InvoiceCreationModalProps) {
  const [dteType, setDteType] = useState<DTEType>("33");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || "");
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

  const [receiverName, setReceiverName] = useState("Cristián Montes Vial");
  const [receiverRut, setReceiverRut] = useState("13.491.820-4");
  const [receiverAddress, setReceiverAddress] = useState("Av. Presidente Riesco 5711");
  const [receiverCity, setReceiverCity] = useState("Las Condes, Santiago");
  const [receiverEmail, setReceiverEmail] = useState("cmontes@inversiones.cl");

  const [salePrice, setSalePrice] = useState(selectedVehicle?.priceCash || 16490000);
  const [acquisitionCost, setAcquisitionCost] = useState(selectedVehicle?.acquisitionCost || 13800000);

  if (!isOpen) return null;

  const taxes = calculateUsedCarInvoiceTaxes(salePrice, acquisitionCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInvoice({
      dteType,
      vehicleId,
      receiverName,
      receiverRut,
      receiverAddress,
      receiverCity,
      receiverEmail,
      description: `Venta Vehículo Usado ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.year}) Patente ${selectedVehicle.licensePlate} - IVA sobre Margen Ley 21.420`,
      exemptAmountCLP: taxes.exemptAmountCLP,
      netTaxableAmountCLP: taxes.netTaxableAmountCLP,
      vat19CLP: taxes.vat19CLP,
      totalCLP: taxes.totalInvoiceCLP,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Emitir Factura Electrónica (DTE)</div>
              <div className="text-[11px] text-slate-400">Cálculo de IVA sobre Margen según Ley 21.420</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tipo de Documento Tributario (DTE)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDteType("33")}
                className={`p-3 rounded-xl border text-left font-semibold ${
                  dteType === "33"
                    ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                📄 DTE 33: Factura Venta Usados
                <div className="text-[10px] font-normal text-slate-400">IVA sobre Margen de Comercialización</div>
              </button>
              <button
                type="button"
                onClick={() => setDteType("46")}
                className={`p-3 rounded-xl border text-left font-semibold ${
                  dteType === "46"
                    ? "bg-purple-50 border-purple-600 text-purple-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                📥 DTE 46: Factura de Compra
                <div className="text-[10px] font-normal text-slate-400">Compra de auto a particular / retoma</div>
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vehículo Asociado</label>
            <select
              value={vehicleId}
              onChange={(e) => {
                setVehicleId(e.target.value);
                const v = vehicles.find((veh) => veh.id === e.target.value);
                if (v) {
                  setSalePrice(v.priceCash);
                  setAcquisitionCost(v.acquisitionCost || Math.round(v.priceCash * 0.85));
                }
              }}
              className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white font-semibold"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year}) - Patente: {v.licensePlate}
                </option>
              ))}
            </select>
          </div>

          {/* Receptor */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900">1. Datos del Receptor / Cliente</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Razón Social / Nombre"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="RUT Receptor"
                required
                value={receiverRut}
                onChange={(e) => setReceiverRut(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Dirección Comercial"
                required
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Ciudad / Comuna"
                required
                value={receiverCity}
                onChange={(e) => setReceiverCity(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Desglose Tributario */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>2. Desglose Tributario (IVA sobre Margen)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-0.5">Precio de Venta Total</label>
                <input
                  type="number"
                  step={50000}
                  value={salePrice}
                  onChange={(e) => setSalePrice(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Costo de Adquisición (Monto Exento)</label>
                <input
                  type="number"
                  step={50000}
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Computed Taxes Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Monto Exento (Costo de Compra):</span>
                <strong className="text-slate-900">{formatCLP(taxes.exemptAmountCLP)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Margen Bruto de Comercialización:</span>
                <strong className="text-blue-600">{formatCLP(taxes.grossCommercialMargin)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Afecta (Margen / 1.19):</span>
                <strong className="text-slate-800">{formatCLP(taxes.netTaxableAmountCLP)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA Débito Fiscal (19% s/ Margen):</span>
                <strong className="text-red-600">{formatCLP(taxes.vat19CLP)}</strong>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-slate-900">
                <span>Total Factura Electrónica:</span>
                <span className="text-emerald-600">{formatCLP(taxes.totalInvoiceCLP)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Emitir Factura Electrónica</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
