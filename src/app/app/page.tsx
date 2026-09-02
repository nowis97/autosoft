"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { ExecutiveDashboard } from "@/components/analytics/ExecutiveDashboard";
import { SalesApprovalDrawer } from "@/components/sales/SalesApprovalDrawer";

export default function DashboardOverviewPage() {
  const [salesDrawerOpen, setSalesDrawerOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | undefined>();

  const handleOpenSaleApproval = (approvalId?: string) => {
    setSelectedApprovalId(approvalId);
    setSalesDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Panel Ejecutivo"
        subtitle="Métricas operacionales, rotación de stock, comisiones y tributación F29 SII"
      />

      <main className="p-6 max-w-7xl w-full">
        <ExecutiveDashboard onOpenSaleApproval={handleOpenSaleApproval} />
      </main>

      <SalesApprovalDrawer
        isOpen={salesDrawerOpen}
        approvalId={selectedApprovalId}
        onClose={() => setSalesDrawerOpen(false)}
      />
    </div>
  );
}
