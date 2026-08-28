"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Car, CheckCircle2, ShieldCheck } from "lucide-react";

export default function TradeInPage() {
  const params = useParams();
  const tenantSlug = (params?.tenantSlug as string) || "auto-oriente";
  const tenant = store.getTenant(tenantSlug);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+56 9 ");
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");

  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("2019");
  const [carMileage, setCarMileage] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [notes, setNotes] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !carBrand.trim() || !carModel.trim()) {
      setErrorMsg("Completa los datos obligatorios de contacto y vehículo.");
      return;
    }

    store.createLead({
      tenantId: tenant.id,
      name,
      phone,
      email,
      rut: rut || undefined,
      channel: "WEB",
      status: "NEW",
      notes: `SOLICITUD DE TASACIÓN / RETOMA: ${carBrand} ${carModel} (${carYear}) - ${carMileage} KM. Patente: ${carPlate}. Precio esperado: ${formatCLP(
        parseInt(expectedPrice, 10) || 0
      )}. Notas: ${notes}`,
      tradeInDetails: {
        brand: carBrand,
        model: carModel,
        year: parseInt(carYear, 10) || 2019,
        mileage: parseInt(carMileage, 10) || 50000,
        expectedPrice: parseInt(expectedPrice, 10) || 0,
      },
    });

    setIsSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link
        href={`/site/${tenantSlug}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al catálogo de {tenant.name}</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">¡Solicitud de Tasación Recibida!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Un tasador de <strong>{tenant.name}</strong> revisará los antecedentes de tu{" "}
              <strong>
                {carBrand} {carModel}
              </strong>{" "}
              y se comunicará contigo vía WhatsApp para entregarte una propuesta formal de retoma.
            </p>
            <div className="pt-4">
              <Link href={`/site/${tenantSlug}`}>
                <Button className="font-bold px-8">Ver vehículos disponibles para cambio</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-slate-100 space-y-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Tasación Rápida
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Entrega tu Auto en Parte de Pago
              </h1>
              <p className="text-xs text-slate-500">
                Aceptamos tu vehículo actual como pie para comprar cualquiera de nuestros seminuevos garantizados.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Datos de tu Vehículo Actual</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="cbrand">Marca</Label>
                    <Input
                      id="cbrand"
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      placeholder="Ej: Hyundai, Nissan..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cmodel">Modelo</Label>
                    <Input
                      id="cmodel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Ej: Accent, Kicks..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cyear">Año</Label>
                    <Input
                      id="cyear"
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value)}
                      placeholder="2019"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="ckm">Kilometraje Aproximado</Label>
                    <Input
                      id="ckm"
                      type="number"
                      value={carMileage}
                      onChange={(e) => setCarMileage(e.target.value)}
                      placeholder="55000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cplate">Patente (Opcional)</Label>
                    <Input
                      id="cplate"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
                      placeholder="BBCL12"
                      className="font-mono uppercase font-bold"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cprice">Monto Esperado ($ CLP)</Label>
                    <Input
                      id="cprice"
                      type="number"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="7500000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Tus Datos de Contacto</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="uname">Nombre Completo</Label>
                    <Input
                      id="uname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Carolina Rojas"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="uphone">Teléfono / WhatsApp</Label>
                    <Input
                      id="uphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 1234 5678"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="uemail">Correo Electrónico</Label>
                    <Input
                      id="uemail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carolina@correo.cl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Detalles del Auto (Mantenciones, choques, etc.)</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Única dueña, mantenciones al día..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full font-bold h-12 text-sm shadow-md">
                  Solicitar Tasación de mi Auto
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tasación transparente y sin costo ni compromiso de compra.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
