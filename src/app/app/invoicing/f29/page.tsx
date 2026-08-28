"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import {
  FileSpreadsheet,
  Download,
  Printer,
  ArrowLeft,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  calculateMonthlyF29Summary,
  generateF29AccountingExport,
} from "@/lib/accounting/f29-engine";

export default function F29AssistantPage() {
  const [period, setPeriod] = useState("2026-08");
  const [ppmRate, setPpmRate] = useState(0.015);
  const tenant = store.getTenant();
  const invoices = store.getInvoices();
  const serviceOrders = store.getServiceOrders();

  const f29 = calculateMonthlyF29Summary({
    period,
    invoices,
    serviceExpenses: serviceOrders,
    ppmRate,
  });

  const handleDownloadCsv = () => {
    const { filename, csvContent } = generateF29AccountingExport(f29);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col font-sans bg-slate-50 min-h-screen">
      {/* Top Header */}
      <header className="p-6 bg-white border-b border-slate-200 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app/invoicing"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Servicio de Impuestos Internos • SII
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Régimen Ley 21.420 IVA sobre Margen
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Asistente de Declaración Mensual Formulario F29
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="text-xs font-bold gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Borrador</span>
          </Button>

          <Button
            onClick={handleDownloadCsv}
            className="text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV para Contador</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Período Tributario (Mes / Año)
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-transparent outline-none font-bold"
                >
                  <option value="2026-08">Agosto 2026</option>
                  <option value="2026-07">Julio 2026</option>
                  <option value="2026-06">Junio 2026</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Tasa PPM Dealer (%)
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <select
                  value={ppmRate}
                  onChange={(e) => setPpmRate(parseFloat(e.target.value))}
                  className="bg-transparent outline-none font-bold"
                >
                  <option value={0.01}>1.0% PPM</option>
                  <option value={0.015}>1.5% PPM (Estándar)</option>
                  <option value={0.02}>2.0% PPM</option>
                  <option value={0.025}>2.5% PPM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Contribuyente</div>
            <div className="font-extrabold text-slate-900 text-sm">{tenant.name}</div>
            <div className="text-xs text-slate-500 font-mono">RUT: {tenant.rut}</div>
          </div>
        </div>

        {/* F29 Official Line Items Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                  Desglose de Códigos F29 • Período {f29.period}
                </div>
                <h2 className="text-base font-black text-white">
                  Liquidación Mensual de IVA Débito, Crédito y PPM
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total a Pagar (Código 91)</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatCLP(f29.code91TotalTaxPayableCLP)}
              </div>
            </div>
          </div>

          {/* Table of F29 Codes */}
          <div className="divide-y divide-slate-100 text-xs">
            {/* Sección 1: Débito Fiscal y Ventas Exentas */}
            <div className="p-4 bg-slate-50/80 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
              I. Ventas del Mes & Débito Fiscal (Ley 21.420)
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px]">
                    Código 503
                  </span>
                  <span>Ventas Exentas o no gravadas (Costo de adquisición autos usados)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Monto exento por costo de compra a personas naturales sin derecho a crédito.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-slate-900">
                {formatCLP(f29.code503ExemptSalesCLP)}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px]">
                    Código 502
                  </span>
                  <span>Débito Fiscal Facturas Electrónicas (19% sobre Margen Bruto)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Base imponible gravada de {formatCLP(f29.code502NetTaxableSalesCLP)} correspondiente al margen de comercialización.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-blue-700">
                {formatCLP(f29.code502VatDebitCLP)}
              </div>
            </div>

            {/* Sección 2: Crédito Fiscal por Compras de Taller */}
            <div className="p-4 bg-slate-50/80 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
              II. Compras de Insumos & Servicios de Taller (Crédito Fiscal)
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px]">
                    Código 511
                  </span>
                  <span>Crédito Fiscal IVA de Facturas recibidas del giro</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Gastos de mantención, pintura, repuestos y preparación ({f29.totalServiceOrdersCount} órdenes de servicio).
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-emerald-700">
                -{formatCLP(f29.code511VatCreditCLP)}
              </div>
            </div>

            {/* Sección 3: IVA Determinado */}
            <div className="p-4 bg-slate-50/80 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
              III. Impuesto al Valor Agregado Determinado
            </div>

            <div className="p-4 flex items-center justify-between bg-blue-50/30">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[11px]">
                    Código 538
                  </span>
                  <span>IVA Determinado a Pagar en el Período</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Débito Fiscal (Cód. 502) menos Crédito Fiscal de compras (Cód. 511).
                </p>
              </div>
              <div className="text-right font-mono font-black text-sm text-slate-900">
                {formatCLP(f29.code538NetVatPayableCLP)}
              </div>
            </div>

            {/* Sección 4: Pagos Provisionales Mensuales (PPM) */}
            <div className="p-4 bg-slate-50/80 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
              IV. Pagos Provisionales Mensuales (PPM)
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[11px]">
                    Código 151
                  </span>
                  <span>Base Imponible PPM (Ingresos Brutos del Giro)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Total facturado bruto en el mes por venta de vehículos y comisiones.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-slate-900">
                {formatCLP(f29.code151PpmTaxableBaseCLP)}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[11px]">
                    Código 152
                  </span>
                  <span>PPM Determinado ({f29.ppmRatePercent}%)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Anticipo provisional de impuesto a la renta anual (F22).
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-purple-700">
                {formatCLP(f29.code152PpmCLP)}
              </div>
            </div>

            {/* Sección 5: Total a Declarar en el SII */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-sm text-white">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-xs">
                    Código 91
                  </span>
                  <span>TOTAL A PAGAR FORMULARIO F29 (SII)</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Monto final a declarar y pagar simultáneamente ante la Tesorería General de la República.
                </p>
              </div>
              <div className="text-right font-mono font-black text-2xl text-emerald-400">
                {formatCLP(f29.code91TotalTaxPayableCLP)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
