import React, { useState } from "react";
import { ConsignmentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Car, X, PlusCircle } from "lucide-react";

interface ConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ConsignmentModal({ isOpen, onClose, onSave }: ConsignmentModalProps) {
  const [ownerName, setOwnerName] = useState("Ignacio Silva Montes");
  const [ownerRut, setOwnerRut] = useState("15.981.204-5");
  const [ownerPhone, setOwnerPhone] = useState("+56 9 8899 1122");
  const [ownerEmail, setOwnerEmail] = useState("ignacio.silva@gmail.com");
  const [ownerBank, setOwnerBank] = useState("Banco BCI");
  const [ownerAccountType, setOwnerAccountType] = useState<any>("Corriente");
  const [ownerAccountNumber, setOwnerAccountNumber] = useState("77-192-88120");

  const [brand, setBrand] = useState("Volkswagen");
  const [model, setModel] = useState("Tiguan");
  const [version, setVersion] = useState("2.0 TSI Comfortline DSG");
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState(38000);
  const [licensePlate, setLicensePlate] = useState("PKLJ89");

  const [type, setType] = useState<ConsignmentType>("PHYSICAL");
  const [ownerTargetPriceCLP, setOwnerTargetPriceCLP] = useState(17500000);
  const [agreedSalePriceCLP, setAgreedSalePriceCLP] = useState(18990000);
  const [commissionType, setCommissionType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [commissionValue, setCommissionValue] = useState(4);
  const [contractExclusivityDays, setContractExclusivityDays] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ownerName,
      ownerRut,
      ownerPhone,
      ownerEmail,
      ownerBank,
      ownerAccountType,
      ownerAccountNumber,
      brand,
      model,
      version,
      year,
      mileage,
      licensePlate,
      type,
      ownerTargetPriceCLP,
      agreedSalePriceCLP,
      commissionType,
      commissionValue,
      contractExclusivityDays,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-sm">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Ingreso de Auto en Consignación</div>
              <div className="text-[11px] text-slate-400">Custodia física o virtual con mandato mercantil</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Modalidad */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Modalidad de Consignación</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("PHYSICAL")}
                className={`p-3 rounded-xl border text-left font-semibold ${
                  type === "PHYSICAL"
                    ? "bg-purple-50 border-purple-600 text-purple-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                🏢 Física en Salón
                <div className="text-[10px] font-normal text-slate-400">El auto queda en el local</div>
              </button>
              <button
                type="button"
                onClick={() => setType("VIRTUAL")}
                className={`p-3 rounded-xl border text-left font-semibold ${
                  type === "VIRTUAL"
                    ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                📱 Virtual con Dueño
                <div className="text-[10px] font-normal text-slate-400">Dueño lo usa a diario</div>
              </button>
            </div>
          </div>

          {/* Propietario */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900">1. Datos del Propietario / Comitente</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nombre Completo"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="RUT (ej. 15.981.204-5)"
                required
                value={ownerRut}
                onChange={(e) => setOwnerRut(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Teléfono WhatsApp"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Banco"
                required
                value={ownerBank}
                onChange={(e) => setOwnerBank(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <select
                value={ownerAccountType}
                onChange={(e) => setOwnerAccountType(e.target.value)}
                className="h-9 px-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Corriente">Cta Corriente</option>
                <option value="Vista / Rut">Cta Vista/Rut</option>
                <option value="Ahorro">Cta Ahorro</option>
              </select>
              <input
                type="text"
                placeholder="N° Cuenta"
                required
                value={ownerAccountNumber}
                onChange={(e) => setOwnerAccountNumber(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Vehiculo */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900">2. Datos del Vehículo</div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Marca"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Modelo"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Patente (ej. PKLJ89)"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg uppercase"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Versión"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Año"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="KM"
                value={mileage}
                onChange={(e) => setMileage(parseInt(e.target.value, 10))}
                className="h-9 px-3 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Precios y Comision */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900">3. Acuerdo Comercial y Comisión</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">Monto Pretendido por Dueño</label>
                <input
                  type="number"
                  step={50000}
                  value={ownerTargetPriceCLP}
                  onChange={(e) => setOwnerTargetPriceCLP(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Precio de Publicación (PVP)</label>
                <input
                  type="number"
                  step={50000}
                  value={agreedSalePriceCLP}
                  onChange={(e) => setAgreedSalePriceCLP(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-slate-500 block mb-0.5">Comisión Dealer ({commissionType === "PERCENTAGE" ? "%" : "$"})</label>
                <input
                  type="number"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-bold text-purple-600"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Días Exclusividad</label>
                <input
                  type="number"
                  value={contractExclusivityDays}
                  onChange={(e) => setContractExclusivityDays(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Registrar y Emitir Contrato</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
