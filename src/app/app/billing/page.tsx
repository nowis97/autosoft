"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { PricingPlansCard } from "@/components/billing/PricingPlansCard";
import { UsageMetricsCard } from "@/components/billing/UsageMetricsCard";
import { PaymentMethodModal } from "@/components/billing/PaymentMethodModal";
import { SubscriptionPlanTier, TenantSubscription } from "@/types";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, CheckCircle2, FileText, Download } from "lucide-react";
import { formatCLP } from "@/lib/chilean-utils/financing";

export default function BillingPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const users = store.getUsers();
  const [subscription, setSubscription] = useState(store.getSubscription());

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpgradePlan = (tier: SubscriptionPlanTier, cycle: "MONTHLY" | "ANNUAL") => {
    const updated = store.updateSubscriptionPlan(tier, cycle);
    setSubscription({ ...updated });
    setSuccessMessage(`¡Plan actualizado con éxito a ${tier} (${updated.priceUF} UF/mes)!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSavePaymentMethod = (pm: any) => {
    const updated = store.updatePaymentMethod(pm);
    setSubscription({ ...updated });
    setSuccessMessage("¡Método de pago chileno actualizado correctamente!");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Planes, Suscripción & Facturación SaaS"
        subtitle="Gestión de planes en UF, capacidad de inventario y facturas electrónicas de servicio"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* Active Plan Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Plan Activo: {subscription.tier}
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Suscripción al Día
              </span>
            </div>
            <h2 className="text-xl font-black">{tenant.name}</h2>
            <p className="text-xs text-slate-400">
              {subscription.priceUF} UF / mes • Facturación {subscription.billingCycle === "ANNUAL" ? "Anual (-15%)" : "Mensual"} • Próximo cobro: {new Date(subscription.nextBillingDate).toLocaleDateString("es-CL")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Método de Pago</div>
              <div className="text-xs font-bold text-slate-200">
                {subscription.paymentMethod.bankName} (•••• {subscription.paymentMethod.last4})
              </div>
            </div>
            <Button
              onClick={() => setIsPaymentModalOpen(true)}
              variant="outline"
              size="sm"
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border-slate-700 gap-1.5"
            >
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Cambiar Medio de Pago</span>
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Usage Metrics Card */}
        <UsageMetricsCard
          subscription={subscription}
          vehiclesCount={vehicles.length}
          usersCount={users.length}
        />

        {/* Pricing Plans Selector */}
        <PricingPlansCard
          currentSubscription={subscription}
          onUpgradePlan={handleUpgradePlan}
        />

        {/* Invoices History for Autosoft SaaS Subscription */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Facturas Electrónicas de Servicio Autosoft SpA</span>
            </h3>
            <span className="text-xs text-slate-400">RUT Proveedor: 77.891.204-5 (Autosoft SpA)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Folio DTE</th>
                  <th className="py-2.5 px-3">Período / Concepto</th>
                  <th className="py-2.5 px-3">Monto Total</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Descargar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">DTE N° 4091</td>
                  <td className="py-3 px-3">Suscripción Plan Pro Dealer (Agosto 2026)</td>
                  <td className="py-3 px-3 font-black text-slate-900">{formatCLP(190000)} + IVA</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Pagado
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-blue-600 font-bold">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">DTE N° 3512</td>
                  <td className="py-3 px-3">Suscripción Plan Pro Dealer (Julio 2026)</td>
                  <td className="py-3 px-3 font-black text-slate-900">{formatCLP(190000)} + IVA</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Pagado
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-blue-600 font-bold">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSavePaymentMethod={handleSavePaymentMethod}
        />
      </main>
    </div>
  );
}
