import React, { useState } from "react";
import { SubscriptionPlanTier, TenantSubscription } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles, Shield, Building2 } from "lucide-react";
import { formatCLP } from "@/lib/chilean-utils/financing";

interface PricingPlansCardProps {
  currentSubscription: TenantSubscription;
  onUpgradePlan: (tier: SubscriptionPlanTier, cycle: "MONTHLY" | "ANNUAL") => void;
}

const UF_VALUE_CLP = 38000;

export function PricingPlansCard({
  currentSubscription,
  onUpgradePlan,
}: PricingPlansCardProps) {
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");

  const plans = [
    {
      tier: "STARTER" as SubscriptionPlanTier,
      name: "Starter",
      tagline: "Para automotoras pequeñas en crecimiento",
      priceUF: 2.5,
      icon: Zap,
      color: "border-slate-200 text-slate-900",
      btnVariant: "outline" as const,
      features: [
        "Hasta 15 vehículos en stock",
        "2 usuarios con permisos RBAC",
        "Sitio Web Whitelabel responsivo",
        "CRM automotriz & leads",
        "Tasador inteligente de retomas",
        "Sincronización manual de stock",
        "Soporte estándar por correo",
      ],
    },
    {
      tier: "PRO" as SubscriptionPlanTier,
      name: "Pro Dealer",
      popular: true,
      tagline: "El motor completo para escalar ventas",
      priceUF: 5.0,
      icon: Sparkles,
      color: "border-blue-600 ring-2 ring-blue-600/20 text-blue-600",
      btnVariant: "default" as const,
      features: [
        "Hasta 45 vehículos en stock",
        "5 usuarios con permisos de equipo",
        "Copiloto IA WhatsApp 24/7",
        "Estudio Fotográfico IA (100 fotos/mes)",
        "Taller, Puesta a Punto & Libro de Costos",
        "Consignaciones & Corretaje de Terceros",
        "Facturación SII (IVA sobre Margen Ley 21.420)",
        "Sincronización automática Chileautos & Mercado Libre",
        "Soporte prioritario por WhatsApp",
      ],
    },
    {
      tier: "ENTERPRISE" as SubscriptionPlanTier,
      name: "Enterprise",
      tagline: "Para concesionarios y grupos automotrices",
      priceUF: 10.0,
      icon: Building2,
      color: "border-purple-300 text-purple-900",
      btnVariant: "outline" as const,
      features: [
        "Vehículos en stock ilimitados",
        "Usuarios y ejecutivos ilimitados",
        "Multi-sucursal centralizada",
        "Portal de Analítica Ejecutiva & P&L",
        "Estudio Fotográfico IA (500 fotos/mes)",
        "Copiloto IA WhatsApp (2.000 chats/mes)",
        "Feed XML Chileautos y API dedicada",
        "Onboarding Concierge VIP presencial",
        "Ejecutivo de cuenta y soporte telefónico 24/7",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Planes de Suscripción Autosoft 360</h3>
          <p className="text-xs text-slate-500">Tarifas transparentes en UF con facturación electrónica mensual</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === "MONTHLY"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Facturación Mensual
          </button>
          <button
            onClick={() => setBillingCycle("ANNUAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === "ANNUAL"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Facturación Anual</span>
            <span className="bg-emerald-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              -15% Dcto.
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentSubscription.tier === plan.tier;
          const effectivePriceUF = billingCycle === "ANNUAL" ? plan.priceUF * 0.85 : plan.priceUF;
          const clpEquivalent = Math.round(effectivePriceUF * UF_VALUE_CLP);

          return (
            <div
              key={plan.tier}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between relative shadow-sm transition-all hover:shadow-md ${
                plan.popular ? "border-blue-600 ring-2 ring-blue-600/15" : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Más Elegido por Automotoras
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-slate-900 text-base">{plan.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Plan Actual
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 min-h-[32px]">{plan.tagline}</p>

                <div className="border-t border-b border-slate-100 py-3 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{effectivePriceUF.toFixed(1)} UF</span>
                    <span className="text-xs text-slate-500 font-semibold">/ mes</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Equivalente a ~{formatCLP(clpEquivalent)} + IVA
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Qué incluye:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => onUpgradePlan(plan.tier, billingCycle)}
                  disabled={isCurrent}
                  className={`w-full text-xs font-bold h-10 ${
                    isCurrent
                      ? "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed"
                      : plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {isCurrent ? "Plan Activo en Uso" : `Cambiar a ${plan.name}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
