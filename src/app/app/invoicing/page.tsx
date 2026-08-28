"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { SalesBookTable } from "@/components/invoicing/SalesBookTable";
import { InvoiceCreationModal } from "@/components/invoicing/InvoiceCreationModal";
import { ElectronicInvoiceViewModal } from "@/components/invoicing/ElectronicInvoiceViewModal";
import { InvoiceDTE } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { FileText, Plus, ShieldCheck, Download, CheckCircle2, DollarSign, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvoicingPage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [invoices, setInvoices] = useState(store.getInvoices());

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDTE | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const summary = store.getInvoicesSummary();

  const handleSaveInvoice = (data: any) => {
    const newInv = store.createInvoice({
      tenantId: tenant.id,
      dteType: data.dteType,
      vehicleId: data.vehicleId,
      receiverName: data.receiverName,
      receiverRut: data.receiverRut,
      receiverAddress: data.receiverAddress,
      receiverCity: data.receiverCity,
      receiverEmail: data.receiverEmail,
      description: data.description,
      exemptAmountCLP: data.exemptAmountCLP,
      netTaxableAmountCLP: data.netTaxableAmountCLP,
      vat19CLP: data.vat19CLP,
      totalCLP: data.totalCLP,
    });

    setInvoices([...store.getInvoices()]);
    setSuccessMessage(`¡Factura Electrónica Folio N° ${newInv.folio} emitida y timbrada exitosamente por el SII!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Facturación Electrónica SII & Gestión Tributaria"
        subtitle="Emisión de facturas con IVA sobre Margen (Ley 21.420), facturas de compra y Libro de Ventas F29"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Facturado del Mes</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCLP(summary.totalBilled)}
            </div>
            <div className="text-xs text-slate-400 mt-1">{summary.totalInvoices} DTEs emitidos</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Monto Exento (Costo)</div>
            <div className="text-2xl font-black text-slate-700 mt-1">
              {formatCLP(summary.totalExempt)}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">100% libre de IVA</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Base Afecta (Margen)</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {formatCLP(summary.totalNetTaxable)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Margen comercial gravado</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">IVA Débito Fiscal (F29)</div>
            <div className="text-2xl font-black text-red-600 mt-1">
              {formatCLP(summary.totalVAT)}
            </div>
            <div className="text-xs text-red-500 font-semibold mt-1">Impuesto a pagar al SII</div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Contribuyente Emisor</div>
              <div className="font-extrabold text-slate-900 text-sm">
                {tenant.name} • RUT: {tenant.rut}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/invoicing/f29"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Asistente F29 SII</span>
            </Link>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="font-bold text-xs gap-1.5 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Emitir Nueva Factura DTE</span>
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sales Book Table */}
        <SalesBookTable
          invoices={invoices}
          onViewInvoice={(inv) => setSelectedInvoice(inv)}
        />

        <InvoiceCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          vehicles={vehicles}
          onSaveInvoice={handleSaveInvoice}
        />

        {selectedInvoice && (
          <ElectronicInvoiceViewModal
            isOpen={true}
            onClose={() => setSelectedInvoice(null)}
            invoice={selectedInvoice}
            tenant={tenant}
          />
        )}
      </main>
    </div>
  );
}
