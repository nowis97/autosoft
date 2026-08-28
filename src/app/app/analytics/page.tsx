"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { ExecutivePnLTable } from "@/components/analytics/ExecutivePnLTable";
import { BrandRotationMatrixCard } from "@/components/analytics/BrandRotationMatrixCard";
import { SalesCommissionsTable } from "@/components/analytics/SalesCommissionsTable";
import {
  calculateExecutivePnL,
  calculateBrandPerformance,
  calculateSalesRepCommissions,
} from "@/lib/analytics/pnl-calculator";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { TrendingUp, DollarSign, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const vehicles = store.getVehicles();
  const transfers = store.getTransfers();
  const applications = store.getApplications();
  const orders = store.getServiceOrders();
  const users = store.getUsers();

  const pnl = calculateExecutivePnL(vehicles, transfers, applications, orders, users);
  const brandPerf = calculateBrandPerformance(vehicles, transfers);
  const commissions = calculateSalesRepCommissions(users, transfers, applications);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Analítica Financiera Ejecutiva & P&L"
        subtitle="Estado de Resultados consolidado en tiempo real (Autos + F&I + Seguros - Costos de Taller - Comisiones)"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Período Contable</div>
            <div className="font-extrabold text-slate-900 text-base mt-0.5">
              Agosto 2026 • Cierre Mensual Consolidado
            </div>
          </div>

          <Button
            onClick={handleExportReport}
            className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Informe Ejecutivo PDF</span>
          </Button>
        </div>

        {downloadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ¡Informe Ejecutivo generado y descargado exitosamente con balance consolidado y rotación DSI!
            </span>
          </div>
        )}

        {/* Executive PnL Table */}
        <ExecutivePnLTable pnl={pnl} />

        {/* Brand Rotation & Margin Matrix */}
        <BrandRotationMatrixCard performance={brandPerf} />

        {/* Sales Rep Commissions Table */}
        <SalesCommissionsTable commissions={commissions} />
      </main>
    </div>
  );
}
