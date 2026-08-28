"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import { formatCLP, validateRut, formatRut } from "@/lib/chilean-utils";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";

interface FinancingApplicationModalProps {
  vehicle: Vehicle;
  initialDownPayment: number;
  initialTermMonths: number;
  estimatedPayment: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FinancingApplicationModal({
  vehicle,
  initialDownPayment,
  initialTermMonths,
  estimatedPayment,
  isOpen,
  onClose,
}: FinancingApplicationModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+56 9 ");
  const [monthlyIncome, setMonthlyIncome] = useState("1800000");
  const [employmentStatus, setEmploymentStatus] = useState<"DEPENDENT" | "INDEPENDENT">("DEPENDENT");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Ingresa tu nombre completo");
      return;
    }
    if (!validateRut(rut)) {
      setErrorMsg("Ingresa un RUT chileno válido");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Ingresa un correo electrónico válido");
      return;
    }

    const newLead = store.createLead({
      tenantId: vehicle.tenantId,
      vehicleId: vehicle.id,
      name,
      email,
      phone,
      rut: formatRut(rut),
      channel: "WEB",
      status: "NEW",
      notes: `Solicitud de crédito online para ${vehicle.brand} ${vehicle.model} (${vehicle.year}). Pie: ${formatCLP(
        initialDownPayment
      )}, Plazo: ${initialTermMonths} meses. Renta declarada: ${formatCLP(parseInt(monthlyIncome, 10))}.`,
      financingRequested: true,
      downPayment: initialDownPayment,
      termMonths: initialTermMonths,
    });

    store.createApplication({
      tenantId: vehicle.tenantId,
      leadId: newLead.id,
      vehicleId: vehicle.id,
      applicantName: name,
      applicantRut: formatRut(rut),
      applicantEmail: email,
      applicantPhone: phone,
      monthlyIncome: parseInt(monthlyIncome, 10) || 1500000,
      downPayment: initialDownPayment,
      termMonths: initialTermMonths,
      employmentStatus,
      status: "SUBMITTED",
      estimatedMonthlyPayment: estimatedPayment,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">¡Solicitud Enviada con Éxito!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Hemos recibido tus antecedentes para evaluar el financiamiento de tu{" "}
              <strong>
                {vehicle.brand} {vehicle.model}
              </strong>
              . Un ejecutivo financiero te contactará vía WhatsApp/Teléfono a la brevedad con la pre-aprobación.
            </p>
            <div className="pt-4">
              <Button onClick={onClose} className="w-full">
                Entendido
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Pre-evaluación en línea
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Postular a Crédito para {vehicle.brand} {vehicle.model}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                Cuota estimada: <strong className="text-blue-700">{formatCLP(estimatedPayment)}/mes</strong> (Pie:{" "}
                {formatCLP(initialDownPayment)} · {initialTermMonths} meses)
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez González"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="rut">RUT Chileno</Label>
                  <Input
                    id="rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="income">Renta Líquida Mensual ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="1800000"
                    required
                  />
                </div>

                <div>
                  <Label>Tipo de Empleo</Label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    <option value="DEPENDENT">Dependiente (Contrato)</option>
                    <option value="INDEPENDENT">Independiente / Boletas</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full font-bold shadow-md h-11">
                  Enviar Antecedentes para Pre-Aprobación
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Evaluación con Forum, Tanner, Santander Consumer y Autofin.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
