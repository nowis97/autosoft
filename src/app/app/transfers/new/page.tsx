"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP, formatRut, cleanRut, validateRut } from "@/lib/chilean-utils";
import { calculateTransferTaxes } from "@/lib/chilean-utils/tax-calculator";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AutofactReportCard } from "@/components/transfers/AutofactReportCard";
import { InsuranceQuoteWidget } from "@/components/transfers/InsuranceQuoteWidget";
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck, Key } from "lucide-react";
import { InsurancePolicy } from "@/types";

export default function NewTransferPage() {
  const router = useRouter();
  const tenant = store.getTenant();
  const availableVehicles = store.getVehicles().filter((v) => v.status !== "SOLD");

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState(availableVehicles[0]?.id || "");

  const [buyerName, setBuyerName] = useState("");
  const [buyerRut, setBuyerRut] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("+56 9 ");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("Av. Providencia 1200");
  const [buyerCity, setBuyerCity] = useState("Providencia, Santiago");
  const [salePrice, setSalePrice] = useState("");

  const [selectedInsurance, setSelectedInsurance] = useState<InsurancePolicy | undefined>();
  const [errorMsg, setErrorMsg] = useState("");

  const vehicle = store.getVehicleById(selectedVehicleId) || availableVehicles[0];

  const currentPrice = salePrice ? parseInt(salePrice, 10) : vehicle?.priceCash || 15000000;
  const taxes = calculateTransferTaxes({ salePrice: currentPrice });

  const mockReport = {
    hasFines: false,
    tagFinesCount: 0,
    hasEncumbrance: false,
    isStolen: false,
    technicalInspectionValid: true,
    technicalInspectionExpiry: "2026-12-31",
    soapValid: true,
    ownersCount: 1,
    mileageRecord: vehicle?.mileage || 40000,
  };

  const handleCreateTransfer = () => {
    if (!buyerName.trim() || !buyerRut.trim()) {
      setErrorMsg("Completa el nombre y RUT del comprador.");
      return;
    }
    if (!validateRut(buyerRut)) {
      setErrorMsg("El RUT del comprador no es válido según el algoritmo Módulo 11.");
      return;
    }

    const created = store.createTransferOrder({
      tenantId: tenant.id,
      vehicleId: vehicle.id,
      buyerName,
      buyerRut: formatRut(buyerRut),
      buyerPhone,
      buyerEmail,
      buyerAddress,
      buyerCity,
      salePrice: currentPrice,
      fiscalAppraisal: taxes.fiscalAppraisal,
      autofactReport: mockReport,
      insurancePolicy: selectedInsurance,
    });

    alert(`¡Orden de Transferencia Notarial ${created.id} creada con éxito! Se ha notificado al comprador para firma digital.`);
    router.push("/app/transfers");
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Asistente de Cierre de Venta & Transferencia Digital"
        subtitle="Verificación legal, cálculo de impuestos, cotización de seguro y firma notarial"
      />

      <main className="p-6 max-w-4xl w-full space-y-6">
        <Link
          href="/app/transfers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado de transferencias</span>
        </Link>

        {/* Steps indicator */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, title: "1. Datos & Autofact" },
            { num: 2, title: "2. Impuestos & Seguro" },
            { num: 3, title: "3. Confirmar Cierre" },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                step === s.num
                  ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                  : step > s.num
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <div className="text-xs">{s.title}</div>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Vehicle & Buyer */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                Selección de Vehículo para Transferir
              </h3>

              <div>
                <Label>Vehículo a transferir</Label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    const v = store.getVehicleById(e.target.value);
                    if (v) setSalePrice(v.priceCash.toString());
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 mt-1"
                >
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.year}) - Patente: {v.licensePlate} - {formatCLP(v.priceCash)}
                    </option>
                  ))}
                </select>
              </div>

              {vehicle && <AutofactReportCard vehicle={vehicle} report={mockReport} />}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                Datos del Comprador (Adquirente)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bname">Nombre Completo del Comprador</Label>
                  <Input
                    id="bname"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ej: Macarena Silva Pinto"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="brut">RUT del Comprador</Label>
                  <Input
                    id="brut"
                    value={buyerRut}
                    onChange={(e) => setBuyerRut(e.target.value)}
                    placeholder="12.345.678-5"
                    className="font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bphone">Teléfono / WhatsApp</Label>
                  <Input
                    id="bphone"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bmail">Correo Electrónico</Label>
                  <Input
                    id="bmail"
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="macarena@correo.cl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bdir">Domicilio</Label>
                  <Input
                    id="bdir"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bcity">Comuna / Ciudad</Label>
                  <Input
                    id="bcity"
                    value={buyerCity}
                    onChange={(e) => setBuyerCity(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (!buyerName.trim() || !buyerRut.trim()) {
                    setErrorMsg("Completa los datos del comprador.");
                    return;
                  }
                  setErrorMsg("");
                  setStep(2);
                }}
                className="font-bold px-8 shadow-xs"
              >
                Continuar a Impuestos & Seguros →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Taxes & Insurance */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Liquidación Tributaria de Transferencia (D.L. 3475)</span>
                <span className="text-xs text-blue-600 font-mono">SII Oficial</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sprice">Precio Pactado de Venta ($ CLP)</Label>
                  <Input
                    id="sprice"
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="font-bold text-base mt-1"
                  />
                </div>

                <div>
                  <Label>Tasación Fiscal SII</Label>
                  <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center font-bold text-slate-700 text-xs mt-1">
                    {formatCLP(taxes.fiscalAppraisal)}
                  </div>
                </div>

                <div>
                  <Label>Impuesto Fiscal 1.5% (D.L. 3475)</Label>
                  <div className="h-10 px-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center font-bold text-blue-800 text-xs mt-1">
                    {formatCLP(taxes.transferTax15)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Impuesto a la Transferencia (1.5%):</span>
                  <strong>{formatCLP(taxes.transferTax15)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Arancel Notarial de Autorización de Firmas:</span>
                  <strong>{formatCLP(taxes.notaryFee)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Arancel de Inscripción Registro Civil (SRCeI):</span>
                  <strong>{formatCLP(taxes.civilRegistryFee)}</strong>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Gastos de Transferencia Notarial:</span>
                  <span className="text-blue-700">{formatCLP(taxes.totalTransferCost)}</span>
                </div>
              </div>
            </div>

            {vehicle && (
              <InsuranceQuoteWidget
                vehicle={vehicle}
                selectedPolicy={selectedInsurance}
                onSelectPolicy={(policy) => setSelectedInsurance(policy)}
              />
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Volver
              </Button>
              <Button onClick={() => setStep(3)} className="font-bold px-8 shadow-xs">
                Continuar a Resumen y Firma →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Resumen de la Orden de Transferencia</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block">
                    Vehículo Seleccionado
                  </span>
                  <div>• {vehicle.brand} {vehicle.model} {vehicle.year}</div>
                  <div>• Patente: <strong>{vehicle.licensePlate}</strong></div>
                  <div>• Precio de Venta: <strong>{formatCLP(currentPrice)}</strong></div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block">
                    Comprador Registrado
                  </span>
                  <div>• {buyerName}</div>
                  <div>• RUT: <strong>{formatRut(buyerRut)}</strong></div>
                  <div>• Contacto: {buyerPhone}</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs space-y-2 text-blue-950">
                <div className="font-bold">Desglose de Liquidación Final:</div>
                <div className="flex justify-between">
                  <span>Valor del Vehículo:</span>
                  <strong>{formatCLP(currentPrice)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Notariales e Impuesto 1.5%:</span>
                  <strong>{formatCLP(taxes.totalTransferCost)}</strong>
                </div>
                {selectedInsurance && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Seguro {selectedInsurance.carrier} (Comisión Dealer: {formatCLP(selectedInsurance.dealerCommissionCLP)}):</span>
                    <span>{formatCLP(selectedInsurance.monthlyPremiumCLP)} / mes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← Volver a Impuestos
              </Button>
              <Button
                onClick={handleCreateTransfer}
                className="font-bold px-8 shadow-md bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Emitir Orden Notarial y Notificar para Firma</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
