"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Car,
  Bot,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Phone,
  MapPin,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Calculator,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { store } from "@/lib/store";
import { validateRUT, formatRUT } from "@/lib/chilean-utils/rut";
import { validateLicensePlate, normalizeLicensePlate } from "@/lib/chilean-utils/license-plate";
import { formatCLP } from "@/lib/chilean-utils/currency";
import { fetchPlateScraper } from "@/lib/chilean-utils/plate-scraper";

export default function OnboardingWizardPage() {
  const router = useRouter();
  const currentTenant = store.getTenant();

  // Wizard state (1: Dealership, 2: First Car, 3: WhatsApp Test, 4: Success & Links)
  const [step, setStep] = useState(1);

  // Step 1: Dealership state
  const [dealerName, setDealerName] = useState(
    currentTenant.name === "Automotora Oriente" ? "" : currentTenant.name
  );
  const [dealerRut, setDealerRut] = useState(
    currentTenant.rut === "76.452.189-K" ? "" : currentTenant.rut
  );
  const [dealerPhone, setDealerPhone] = useState(currentTenant.phone || "+56 9 ");
  const [dealerCity, setDealerCity] = useState(currentTenant.city || "Santiago");
  const [dealerAddress, setDealerAddress] = useState(currentTenant.address || "Av. Las Condes 12345");
  const [dealerSlug, setDealerSlug] = useState(currentTenant.slug || "mi-automotora");
  const [rutError, setRutError] = useState("");

  // Step 2: First Vehicle state
  const [plate, setPlate] = useState("BBCL12");
  const [brand, setBrand] = useState("Toyota");
  const [model, setModel] = useState("RAV4");
  const [version, setVersion] = useState("2.0 LE 4x2 CVT");
  const [year, setYear] = useState("2022");
  const [mileage, setMileage] = useState("45000");
  const [priceCash, setPriceCash] = useState("16990000");
  const [priceFinanced, setPriceFinanced] = useState("15990000");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80"
  );
  const [plateError, setPlateError] = useState("");

  // Step 3: Copilot Simulator Chat state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string; time: string }>
  >([
    {
      sender: "bot",
      text: `¡Hola! Bienvenido a ${dealerName || "tu automotora"}. Veo que estás consultando por el ${brand} ${model} ${year} (Patente ${plate}). ¿Cómo te puedo ayudar hoy?`,
      time: "11:32",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Handlers for Step 1
  const handleDealerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDealerName(val);
    const slug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setDealerSlug(slug || "mi-automotora");
  };

  const handleDealerRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setDealerRut(formatted);
    if (formatted.length >= 8) {
      setRutError(validateRUT(formatted) ? "" : "RUT inválido (revise dígito verificador)");
    } else {
      setRutError("");
    }
  };

  const submitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (dealerRut && !validateRUT(dealerRut)) {
      setRutError("Por favor ingrese un RUT chileno válido");
      return;
    }

    const updated = {
      name: dealerName || "Automotora Principal",
      rut: dealerRut || "77.123.456-7",
      phone: dealerPhone,
      city: dealerCity,
      address: dealerAddress,
      slug: dealerSlug,
      whitelabel: {
        ...currentTenant.whitelabel,
        dealershipName: dealerName || "Automotora Principal",
      },
    };

    store.updateTenant(updated);
    fetch("/api/tenants", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn("Tenant save failed", err));

    setStep(2);
  };

  // Handlers for Step 2
  const handlePlateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setPlate(val);
    const check = validateLicensePlate(val);
    if (check.valid) {
      setPlateError("");
      try {
        const data = await fetchPlateScraper(val);
        setBrand(data.brand);
        setModel(data.model);
        setVersion(data.version);
        setYear(data.year.toString());
        setMileage(data.mileage.toString());
        setPriceCash(data.priceCash.toString());
        setPriceFinanced(data.priceFinanced.toString());
        if (data.imageUrl) setImageUrl(data.imageUrl);
      } catch (err) {
        console.warn("Onboarding plate scraper error:", err);
      }
    } else {
      setPlateError(val.length < 5 ? "" : "Formato inválido (ej. BBCL12 o AB1234)");
    }
  };

  const submitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLicensePlate(plate);
    if (!check.valid) {
      setPlateError("Ingrese una patente chilena válida");
      return;
    }

    // Clear previous mock cars to start clean with the user's real car
    store.clearMockData();

    const vehicleData = {
      tenantId: currentTenant.id,
      licensePlate: normalizeLicensePlate(plate),
      brand,
      model,
      version: version || "Estándar",
      year: parseInt(year, 10) || 2022,
      mileage: parseInt(mileage, 10) || 45000,
      transmission: "AUTOMATICA" as const,
      fuelType: "BENCINA" as const,
      bodyType: "SUV" as const,
      color: "Gris Grafito",
      priceCash: parseInt(priceCash, 10) || 16990000,
      priceFinanced: parseInt(priceFinanced, 10) || 15990000,
      acquisitionCost: Math.round(parseInt(priceCash, 10) * 0.85),
      status: "AVAILABLE" as const,
      description: `Excelente ${brand} ${model} año ${year}. Único dueño, mantenciones al día y garantía de 6 meses.`,
      features: ["Aire Acondicionado", "Frenos ABS", "Pantalla Touch", "Cámara de Retroceso"],
      images: [imageUrl],
      publishedToWeb: true,
      publishedToMercadolibre: true,
      publishedToChileautos: true,
      publishedToYapo: true,
    };

    store.createVehicle(vehicleData);
    fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    }).catch((err) => console.warn("Vehicle save failed", err));

    // Prepare initial message in Step 3
    setChatMessages([
      {
        sender: "bot",
        text: `¡Hola! Bienvenido a ${dealerName || "Automotora"}. Veo que estás consultando por el ${brand} ${model} ${year} (Patente ${normalizeLicensePlate(plate)}). ¿Cómo te puedo ayudar hoy?`,
        time: "11:32",
      },
    ]);

    setStep(3);
  };

  // Handlers for Step 3: Interactive Copilot simulation
  const sendCopilotMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMsg("");

    setTimeout(() => {
      let botResponse = "";
      const lower = text.toLowerCase();

      if (lower.includes("pie") || lower.includes("cuota") || lower.includes("credito") || lower.includes("financiamiento") || lower.includes("4 millones") || lower.includes("cuanto queda")) {
        const pCash = parseInt(priceCash, 10) || 16990000;
        const downPayment = 4000000;
        const loanAmount = pCash - downPayment;
        const monthlyEst = Math.round((loanAmount * 1.35) / 48);

        botResponse = `Para el ${brand} ${model} (${formatCLP(pCash)}) con un pie de ${formatCLP(downPayment)}, la cuota estimada a 48 meses con Forum/Tanner es de aprox. ${formatCLP(monthlyEst)} CLP/mes (Tasa 1.55% mensual). Además, este vehículo tiene Bono de Financiamiento de ${formatCLP(pCash - (parseInt(priceFinanced, 10) || pCash))}. ¿Te gustaría que evaluemos tu crédito ahora mismo?`;
      } else if (lower.includes("disponible") || lower.includes("ver") || lower.includes("horario") || lower.includes("hoy")) {
        botResponse = `¡Sí, está 100% disponible en nuestro salón de ${dealerCity}! Nuestro horario es de Lunes a Sábado de 09:30 a 19:00 hrs. ¿Te acomoda agendar una visita o prueba de manejo hoy?`;
      } else if (lower.includes("retoma") || lower.includes("parte de pago") || lower.includes("usado")) {
        botResponse = `¡Claro que sí! Recibimos tu auto en parte de pago con tasación inmediata en nuestro patio. Cuéntame, ¿qué marca, modelo y año tiene tu auto actual?`;
      } else {
        botResponse = `Excelente pregunta. El ${brand} ${model} ${year} cuenta con ${mileage} km, documentación al día en el Registro Civil y garantía mecánica de 6 meses incluida. ¿Te gustaría coordinar una visita para probarlo?`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 700);
  };

  const copyShowroomUrl = () => {
    const url = `${window.location.origin}/site/${dealerSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/20">
            360
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
              <span>Asistente de Activación Rápida</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                4 Pasos
              </span>
            </h1>
            <p className="text-xs text-slate-400">Configura tu automotora y prueba el copiloto en menos de 2 minutos</p>
          </div>
        </div>

        <Link href="/app/inventory">
          <Button variant="outline" size="sm" className="text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white">
            Saltar al Panel
          </Button>
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {[
            { num: 1, label: "Tu Automotora", icon: Building2 },
            { num: 2, label: "Primer Auto", icon: Car },
            { num: 3, label: "Test WhatsApp IA", icon: Bot },
            { num: 4, label: "Showroom Listo", icon: Globe },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div
                key={s.num}
                onClick={() => isDone && setStep(s.num)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  isActive ? "text-blue-400 font-bold" : isDone ? "text-emerald-400 font-medium" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="hidden sm:inline text-xs">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* STEP 1: DEALERSHIP PROFILE */}
          {step === 1 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Paso 1: Identidad de tu Automotora</h2>
                  <p className="text-xs text-slate-400">Ingresa los datos para personalizar tu showroom y contratos notariales</p>
                </div>
              </div>

              <form onSubmit={submitStep1} className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-300">Nombre de la Automotora / Razón Social *</Label>
                  <Input
                    value={dealerName}
                    onChange={handleDealerNameChange}
                    placeholder="Ej: Automotora Los Andes SpA"
                    required
                    className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">RUT Empresa (Módulo 11) *</Label>
                    <Input
                      value={dealerRut}
                      onChange={handleDealerRutChange}
                      placeholder="77.123.456-7"
                      required
                      className="mt-1 font-mono text-sm bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    {rutError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {rutError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-400" /> WhatsApp Oficial de Ventas *
                    </Label>
                    <Input
                      value={dealerPhone}
                      onChange={(e) => setDealerPhone(e.target.value)}
                      placeholder="+56 9 8765 4321"
                      required
                      className="mt-1 font-mono text-sm bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" /> Ciudad / Comuna *
                    </Label>
                    <Input
                      value={dealerCity}
                      onChange={(e) => setDealerCity(e.target.value)}
                      placeholder="Ej: Santiago, Vitacura"
                      required
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Dirección Salón / Patio</Label>
                    <Input
                      value={dealerAddress}
                      onChange={(e) => setDealerAddress(e.target.value)}
                      placeholder="Ej: Av. Las Condes 12345"
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold px-6">
                    <span>Siguiente: Cargar Mi Primer Auto</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: FIRST VEHICLE UPLOAD */}
          {step === 2 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Paso 2: Carga tu Primer Auto en Stock</h2>
                  <p className="text-xs text-slate-400">Ingresa la patente chilena y los precios comerciales</p>
                </div>
              </div>

              <form onSubmit={submitStep2} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300 flex items-center justify-between">
                      <span>Patente Chilena *</span>
                      {plate && !plateError && <LicensePlateBadge plate={plate} size="sm" />}
                    </Label>
                    <Input
                      value={plate}
                      onChange={handlePlateChange}
                      placeholder="BBCL12"
                      maxLength={7}
                      required
                      className="mt-1 font-mono uppercase font-bold text-sm bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 tracking-wider"
                    />
                    {plateError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {plateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Marca *</Label>
                    <Input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ej: Toyota"
                      required
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Modelo *</Label>
                    <Input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ej: RAV4"
                      required
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">Versión</Label>
                    <Input
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="2.0 LE 4x2 CVT"
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Año *</Label>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2022"
                      required
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Kilometraje (KM) *</Label>
                    <Input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="45000"
                      required
                      className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">Precio Contado ($ CLP) *</Label>
                    <Input
                      type="number"
                      value={priceCash}
                      onChange={(e) => setPriceCash(e.target.value)}
                      placeholder="16990000"
                      required
                      className="mt-1 font-mono bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Precio con Bono Financiamiento ($ CLP)</Label>
                    <Input
                      type="number"
                      value={priceFinanced}
                      onChange={(e) => setPriceFinanced(e.target.value)}
                      placeholder="15990000"
                      className="mt-1 font-mono bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="gap-2 bg-slate-900 text-slate-300 border-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </Button>

                  <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold px-6">
                    <span>Siguiente: Probar Copiloto IA en Vivo</span>
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: WHATSAPP COPILOT SIMULATION ("AHA! MOMENT") */}
          {step === 3 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Paso 3: Prueba tu Copiloto IA de WhatsApp</h2>
                    <p className="text-xs text-slate-400">
                      Pregúntale por el <strong className="text-slate-200">{brand} {model}</strong> que acabas de cargar
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> En Vivo 24/7
                </span>
              </div>

              {/* Vehicle Preview Card */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-3 mb-4">
                <img
                  src={imageUrl}
                  alt={brand}
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-bold text-white truncate">
                    {brand} {model} {version} ({year})
                  </div>
                  <div className="text-slate-400 flex items-center gap-2 mt-0.5">
                    <LicensePlateBadge plate={plate} size="sm" />
                    <span>Contado: {formatCLP(parseInt(priceCash, 10) || 0)}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Simulated Window */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-64 overflow-y-auto space-y-3 mb-4 flex flex-col justify-between">
                <div className="space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                          msg.sender === "user"
                            ? "bg-emerald-700 text-white rounded-br-xs"
                            : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                        <div
                          className={`text-[10px] mt-1 text-right ${
                            msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="mb-4">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Haz clic para probar una pregunta real:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "¿Cuánto queda la cuota con 4 millones de pie?",
                    "¿Está disponible para verlo hoy?",
                    "¿Reciben auto en parte de pago?",
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendCopilotMessage(preset)}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
                    >
                      💬 {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendCopilotMessage(inputMsg);
                }}
                className="flex gap-2 mb-6"
              >
                <Input
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Escribe un mensaje al Copiloto..."
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 text-xs"
                />
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="gap-2 bg-slate-900 text-slate-300 border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold px-6"
                >
                  <span>¡Excelente! Ver Mi Showroom Listo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS & ECOSYSTEM UNLOCKED */}
          {step === 4 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">¡Felicitaciones! Tu Automotora Está en Vivo</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Tu showroom público, tu base de datos de stock y tu Copiloto IA de WhatsApp ya están operativos.
                </p>
              </div>

              {/* Showroom Link Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left space-y-2">
                <Label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-400" /> Link de tu Showroom Público (Para Bio y Clientes)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/site/${dealerSlug}`}
                    className="bg-slate-950 border-slate-700 text-white font-mono text-xs select-all"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyShowroomUrl}
                    className="shrink-0 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 gap-1 text-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "¡Copiado!" : "Copiar"}</span>
                  </Button>
                  <Link href={`/site/${dealerSlug}`} target="_blank">
                    <Button size="sm" className="shrink-0 bg-blue-600 hover:bg-blue-500 gap-1 text-xs">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Ecosystem Unlocked Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <Link
                  href="/app/inspection/yard-mode"
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all block group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Car className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Modo Patio PWA</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Check-in con cámara trasera para mecánicos</p>
                </Link>

                <Link
                  href="/app/transfers"
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all block group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Notaría Ley 19.799</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cierra transferencias en 8 min por WhatsApp</p>
                </Link>

                <Link
                  href="/app/invoicing/f29"
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all block group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Asistente F29 SII</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">IVA sobre margen Ley 21.420 para tu contador</p>
                </Link>
              </div>

              {/* Final CTA */}
              <div className="pt-4">
                <Link href="/app/inventory">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-sm shadow-lg shadow-emerald-600/20 gap-2">
                    <span>Entrar a Mi Panel de Control (DMS)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
