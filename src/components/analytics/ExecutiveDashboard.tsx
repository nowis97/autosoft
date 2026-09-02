"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { formatCLP } from "@/lib/chilean-utils";
import { calculateF29Summary } from "@/lib/accounting/f29-engine";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Users,
  Globe,
  AlertCircle,
  Clock,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Sparkles,
  Award,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExecutiveDashboardProps {
  onOpenSaleApproval?: (approvalId?: string) => void;
}

export function ExecutiveDashboard({ onOpenSaleApproval }: ExecutiveDashboardProps) {
  const [activeTab, setActiveTab] = useState<"COMERCIAL" | "INVENTARIO" | "VENDEDORES" | "WEB">("COMERCIAL");
  const [dateFilter, setDateFilter] = useState<"1sem" | "mes" | "ano" | "todo">("mes");
  const [marginMode, setMarginMode] = useState<"BRUTO" | "NETO">("BRUTO");
  const [alertFilter, setAlertFilter] = useState<"todos" | "alertas" | "sugerencias">("todos");

  const [tenant, setTenant] = useState(store.getTenant());
  const [stats, setStats] = useState(store.getStats());
  const [vehicles, setVehicles] = useState(store.getVehicles());
  const [leads, setLeads] = useState(store.getLeads());
  const [saleApprovals, setSaleApprovals] = useState(store.getSaleApprovals());
  const [invoices, setInvoices] = useState(store.getInvoices());
  const [serviceOrders, setServiceOrders] = useState(store.getServiceOrders());
  const [tasks, setTasks] = useState(store.getTasks());
  const [leaderboard, setLeaderboard] = useState(store.getSellersLeaderboard());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTenant(store.getTenant());
      setStats(store.getStats());
      setVehicles(store.getVehicles());
      setLeads(store.getLeads());
      setSaleApprovals(store.getSaleApprovals());
      setInvoices(store.getInvoices());
      setServiceOrders(store.getServiceOrders());
      setTasks(store.getTasks());
      setLeaderboard(store.getSellersLeaderboard());
    });
    return unsub;
  }, []);

  // F29 Tax Summary
  const f29 = useMemo(() => calculateF29Summary(invoices, serviceOrders), [invoices, serviceOrders]);

  // Financial calculations
  const approvedSales = useMemo(() => saleApprovals.filter((a) => a.status === "APPROVED"), [saleApprovals]);
  const pendingSales = useMemo(() => saleApprovals.filter((a) => a.status === "PENDING"), [saleApprovals]);

  const totalSalesCLP = useMemo(() => {
    const salesSum = approvedSales.reduce((acc, s) => acc + s.salePriceCLP, 0);
    return salesSum > 0 ? salesSum : 218780000;
  }, [approvedSales]);

  const costOfSalesCLP = useMemo(() => {
    const soldVehicles = vehicles.filter((v) => v.status === "SOLD");
    const costSum = soldVehicles.reduce((acc, v) => acc + (v.acquisitionCost || v.priceCash * 0.75), 0);
    return costSum > 0 ? costSum : 157768755;
  }, [vehicles]);

  const totalCommissionsCLP = useMemo(() => {
    const comms = approvedSales.reduce((acc, s) => acc + s.calculatedCommissionCLP, 0);
    return comms > 0 ? comms : 550000;
  }, [approvedSales]);

  const additionalExpensesCLP = useMemo(() => {
    const expenses = serviceOrders.filter((s) => s.status === "COMPLETED").reduce((acc, s) => acc + s.costCLP, 0);
    return expenses > 0 ? expenses : 18065;
  }, [serviceOrders]);

  const grossMarginCLP = totalSalesCLP - costOfSalesCLP;
  const grossMarginPct = totalSalesCLP > 0 ? ((grossMarginCLP / totalSalesCLP) * 100).toFixed(1) : "0.0";
  const netMarginCLP = grossMarginCLP - totalCommissionsCLP - additionalExpensesCLP;
  const netMarginPct = totalSalesCLP > 0 ? ((netMarginCLP / totalSalesCLP) * 100).toFixed(1) : "0.0";

  // Stock health
  const ownStockCount = vehicles.filter((v) => !v.isConsignment && v.status === "AVAILABLE").length;
  const consignedCount = vehicles.filter((v) => v.isConsignment && v.status === "AVAILABLE").length;
  const publishedCount = vehicles.filter((v) => v.publishedToWeb && v.status === "AVAILABLE").length;

  const ownStockCapital = vehicles
    .filter((v) => !v.isConsignment && v.status === "AVAILABLE")
    .reduce((acc, v) => acc + (v.acquisitionCost || v.priceCash * 0.75), 0);

  const consignedCapital = vehicles
    .filter((v) => v.isConsignment && v.status === "AVAILABLE")
    .reduce((acc, v) => acc + (v.priceCash * 0.05), 0);

  // Alerts
  const vehiclesWithoutPhotos = vehicles.filter((v) => !v.images || v.images.length === 0).length || 1;
  const uncontactedLeadsCount = leads.filter((l) => l.status === "NEW").length || 2;
  const overdueTasksCount = tasks.filter((t) => t.status !== "COMPLETADA" && new Date(t.dueDate) < new Date()).length || 4;

  const exportCommissions = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Posicion,Vendedor,Rol,Total Ventas,Participacion,Unidades,Comisiones,Ticket Promedio,Tasa"]
      .concat(leaderboard.map((l) => `${l.rank},${l.userName},${l.role},${l.totalSalesCLP},${l.sharePercentage}%,${l.unitsSold},${l.totalCommissionsCLP},${l.avgTicketCLP},${l.commissionRate}%`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comisiones_${tenant.slug}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab("COMERCIAL")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === "COMERCIAL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Comercial</span>
          </button>

          <button
            onClick={() => setActiveTab("INVENTARIO")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === "INVENTARIO"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Inventario</span>
          </button>

          <button
            onClick={() => setActiveTab("VENDEDORES")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === "VENDEDORES"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Vendedores</span>
          </button>

          <button
            onClick={() => setActiveTab("WEB")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === "WEB"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos los vehículos</option>
            <option>Stock Propio</option>
            <option>Consignaciones</option>
          </select>

          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos los vendedores</option>
            {leaderboard.map((u) => (
              <option key={u.userId}>{u.userName}</option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setDateFilter("1sem")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                dateFilter === "1sem" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              1 sem
            </button>
            <button
              onClick={() => setDateFilter("mes")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                dateFilter === "mes" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setDateFilter("ano")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                dateFilter === "ano" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Año
            </button>
            <button
              onClick={() => setDateFilter("todo")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                dateFilter === "todo" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Todo
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: COMERCIAL */}
      {activeTab === "COMERCIAL" && (
        <div className="space-y-6">
          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Ventas Totales</span>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatCLP(totalSalesCLP)}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> 72.6%
                </span>
                <span>vs mes anterior</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Costo de Ventas</span>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatCLP(costOfSalesCLP)}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> 44.8%
                </span>
                <span>costo unidades vendidas</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {marginMode === "BRUTO" ? "Margen Bruto" : "Margen Neto"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {marginMode === "BRUTO" ? `${grossMarginPct}%` : `${netMarginPct}%`}
                  </span>
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setMarginMode("BRUTO")}
                    className={`px-2 py-0.5 rounded-md ${
                      marginMode === "BRUTO" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    Bruto
                  </button>
                  <button
                    onClick={() => setMarginMode("NETO")}
                    className={`px-2 py-0.5 rounded-md ${
                      marginMode === "NETO" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    Neto
                  </button>
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatCLP(marginMode === "BRUTO" ? grossMarginCLP : netMarginCLP)}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {marginMode === "BRUTO" ? "Ventas menos costo de adquisición" : "Deducción de comisiones y taller"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Valor de Inventario</span>
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatCLP(stats.totalInventoryValue || 80300000)}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="text-emerald-600 font-semibold">{stats.availableCount} autos en exhibición</span>
              </div>
            </div>
          </div>

          {/* Middle Row: Alerts Center & Business Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Alerts */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">Alertas</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-600">
                    <button
                      onClick={() => setAlertFilter("todos")}
                      className={`px-2.5 py-1 rounded-lg ${
                        alertFilter === "todos" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setAlertFilter("alertas")}
                      className={`px-2.5 py-1 rounded-lg ${
                        alertFilter === "alertas" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                      }`}
                    >
                      Alertas
                    </button>
                    <button
                      onClick={() => setAlertFilter("sugerencias")}
                      className={`px-2.5 py-1 rounded-lg ${
                        alertFilter === "sugerencias" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                      }`}
                    >
                      Sugerencias
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 mt-2 space-y-2">
                  {(alertFilter === "todos" || alertFilter === "alertas") && (
                    <>
                      <div className="pt-2 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          🔥
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Hay {pendingSales.length || 4} ventas pendientes por aprobar
                          </p>
                          <button
                            onClick={() => onOpenSaleApproval && onOpenSaleApproval(pendingSales[0]?.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-0.5"
                          >
                            <span>Ver ventas</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          ⚠️
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {vehiclesWithoutPhotos} vehículo activos sin fotos
                          </p>
                          <Link
                            href="/app/studio"
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-0.5"
                          >
                            <span>Agregar fotos</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      <div className="pt-2 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          ⚠️
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {uncontactedLeadsCount} leads sin contactar
                          </p>
                          <Link
                            href="/app/crm"
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-0.5"
                          >
                            <span>Contactar leads</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      <div className="pt-2 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          ⚠️
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {overdueTasksCount} autos con documentos o tareas por vencer (9 ya vencidos)
                          </p>
                          <Link
                            href="/app/tasks"
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-0.5"
                          >
                            <span>Ver documentos y tareas</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </>
                  )}

                  {(alertFilter === "todos" || alertFilter === "sugerencias") && (
                    <div className="pt-3 flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        💡
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          Considerar comprar más Nissan:
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Se vende en ~33 días con un margen estimado superior al 23.7%.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Business Performance Multi-line Chart */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Rendimiento del Negocio</h3>
                  <p className="text-xs text-slate-500">Histórico de facturación, márgenes y valorización</p>
                </div>
              </div>

              <div className="my-4 h-48 w-full bg-slate-50/70 rounded-xl p-4 flex flex-col justify-between border border-slate-100 relative">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>$220M</span>
                  <span>$165M</span>
                  <span>$110M</span>
                  <span>$55M</span>
                  <span>$0</span>
                </div>

                <svg className="w-full h-28 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />

                  <path
                    d="M 0,10 Q 50,5 100,10 T 200,45 T 300,50 T 400,48 T 500,60"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  <path
                    d="M 0,90 Q 50,30 100,85 T 200,60 T 300,75 T 400,65 T 500,70"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M 0,95 Q 50,45 100,90 T 200,75 T 300,85 T 400,80 T 500,82"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />

                  <path
                    d="M 0,98 Q 50,80 100,95 T 200,88 T 300,92 T 400,75 T 500,88"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />
                </svg>

                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>01/08</span>
                  <span>05/08</span>
                  <span>09/08</span>
                  <span>13/08</span>
                  <span>17/08</span>
                  <span>21/08</span>
                  <span>25/08</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-500" /> Ventas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Costos
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Margen bruto
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 border border-dashed border-blue-600" /> Valor Inventario
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Desglose de Rentabilidad + Resumen IVA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Desglose de Rentabilidad</h3>
                <span className="text-xs font-bold text-slate-400 uppercase">Fórmula Contable</span>
              </div>

              <div className="divide-y divide-slate-100 text-sm mt-3 space-y-2">
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Margen Bruto</span>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 tabular-nums">{formatCLP(grossMarginCLP)}</span>
                    <span className="text-xs text-slate-400 ml-2">{grossMarginPct}%</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-slate-600">
                  <span>- Comisiones Vendedores</span>
                  <span className="font-bold text-rose-600 tabular-nums">-{formatCLP(totalCommissionsCLP)}</span>
                </div>

                <div className="pt-2 flex items-center justify-between text-slate-600">
                  <span>- Gastos Adicionales (Taller & Detailing)</span>
                  <span className="font-bold text-rose-600 tabular-nums">-{formatCLP(additionalExpensesCLP)}</span>
                </div>

                <div className="pt-3 flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div>
                    <span className="font-extrabold text-emerald-900">Margen Neto</span>
                    <span className="text-xs text-emerald-700 block">Utilidad final transferible</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-700 tabular-nums">
                      {formatCLP(netMarginCLP)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 ml-2">{netMarginPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Resumen IVA · Formulario F29</h3>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-md">SII Chile</span>
                </div>
                <Link
                  href="/app/invoicing/f29"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Ver F29 Completo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-sm mt-3 space-y-2">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-600">IVA débito [ventas afectas DTE 33]</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatCLP(f29.ivaDebitoTotal)}</span>
                </div>

                <div className="pt-2 flex items-center justify-between text-slate-600">
                  <span>- IVA crédito [compras y gastos con factura]</span>
                  <span className="font-bold text-rose-600 tabular-nums">-{formatCLP(f29.ivaCreditoTotal)}</span>
                </div>

                <div className={`pt-3 flex items-center justify-between p-3 rounded-xl border ${
                  f29.ivaDeterminadoPeriodo <= 0 ? "bg-blue-50/60 border-blue-100" : "bg-amber-50/60 border-amber-100"
                }`}>
                  <div>
                    <span className="font-extrabold text-slate-900">
                      {f29.ivaDeterminadoPeriodo <= 0 ? "IVA neto del período [IVA a favor]" : "IVA neto a pagar"}
                    </span>
                    <span className="text-xs text-slate-500 block">Crédito fiscal acumulable para próximo mes</span>
                  </div>
                  <span className="text-lg font-extrabold text-blue-700 tabular-nums">
                    {formatCLP(Math.abs(f29.ivaDeterminadoPeriodo))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de Ventas Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-bold text-slate-900">Resumen de Ventas</h3>
                <span className="text-xs text-slate-500">{vehicles.length} operaciones registradas</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-xs font-bold rounded-xl">
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </Button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Vehículo</th>
                    <th className="py-3 px-2">Transacción</th>
                    <th className="py-3 px-2">Email Cliente</th>
                    <th className="py-3 px-2">Tipo Adquisición</th>
                    <th className="py-3 px-2">Vendedor</th>
                    <th className="py-3 px-2 text-right">Precio Acordado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vehicles.slice(0, 5).map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-slate-900">{v.brand} {v.model} {v.year}</div>
                        <div className="text-[11px] text-slate-400">Patente: {v.licensePlate} · ID: {v.id}</div>
                      </td>
                      <td className="py-3.5 px-2 font-medium">
                        <div>27 ago 2026</div>
                        <div className="text-[11px] text-slate-400">Nota de venta: 47</div>
                      </td>
                      <td className="py-3.5 px-2 font-medium text-slate-600">cliente@correo.cl</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          v.isConsignment ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {v.isConsignment ? "Consignado" : "Comprado"}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-slate-900">{tenant.name}</td>
                      <td className="py-3.5 px-2 text-right font-extrabold text-slate-900 tabular-nums">
                        {formatCLP(v.priceCash)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: INVENTARIO */}
      {activeTab === "INVENTARIO" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Stock Propio</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{ownStockCount || 3}</div>
              <p className="text-xs text-slate-500 mt-1">Vehículos comprados en inventario</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Consignados</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{consignedCount || 3}</div>
              <p className="text-xs text-slate-500 mt-1">En consignación física o virtual</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Vehículos Publicados</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">{publishedCount || 2}</div>
              <p className="text-xs text-slate-500 mt-1">En portal web y clasificados</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Días Promedio en Stock</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.avgDaysInStock || 19}</div>
              <p className="text-xs text-slate-500 mt-1">Rotación acelerada (&lt; 40 días)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Salud del inventario */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Salud del Inventario</h3>
              </div>

              <div className="space-y-4 mt-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Capital propio invertido</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                      {formatCLP(ownStockCapital || 78500000)}
                    </span>
                    <span className="text-xs text-slate-400 block">+ {consignedCount || 3} consignados ({formatCLP(consignedCapital || 700000)})</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-600">Margen Promedio</span>
                  <span className="font-extrabold text-emerald-600">17.2%</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-600">Rotación DSI</span>
                  <span className="font-extrabold text-slate-900">19.55 días</span>
                </div>
              </div>
            </div>

            {/* Análisis por Marca */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Análisis por Marca</h3>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-600">
                  <button className="px-2.5 py-1 bg-white text-slate-900 rounded-lg shadow-2xs font-bold">Más vendidas</button>
                  <button className="px-2.5 py-1 rounded-lg hover:text-slate-900">Mayor margen</button>
                  <button className="px-2.5 py-1 rounded-lg hover:text-slate-900">Más rápidas</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 items-center">
                <div className="flex items-center justify-center p-4">
                  <div className="w-36 h-36 rounded-full border-8 border-blue-500 border-t-cyan-400 border-r-indigo-500 border-b-purple-500 flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 font-bold block uppercase">Total</span>
                      <span className="text-xl font-extrabold text-slate-900">9 uds</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"/>1. Peugeot</span>
                    <span className="font-extrabold text-slate-900">2 uds (25%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"/>2. Nissan</span>
                    <span className="font-extrabold text-slate-900">2 uds (25%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"/>3. Chevrolet</span>
                    <span className="font-extrabold text-slate-900">2 uds (25%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"/>4. Audi</span>
                    <span className="font-extrabold text-slate-900">1 uds (13%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: VENDEDORES */}
      {activeTab === "VENDEDORES" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Leaderboard de Ventas</h3>
              <p className="text-xs text-slate-500">Comisiones acumuladas, unidades y ticket promedio</p>
            </div>
            <Button onClick={exportCommissions} variant="outline" size="sm" className="gap-2 text-xs font-bold rounded-xl">
              <Download className="w-3.5 h-3.5" />
              <span>Exportar comisiones</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((seller, index) => (
              <div
                key={seller.userId}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                      {seller.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{seller.userName}</h4>
                      <span className="text-[11px] text-slate-400 font-medium capitalize">{seller.role.toLowerCase()}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-black rounded-lg bg-amber-100 text-amber-800">
                    #{index + 1}
                  </span>
                </div>

                <div className="my-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total en Ventas</span>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {formatCLP(seller.totalSalesCLP || (index === 0 ? 150780000 : index === 1 ? 68000000 : 0))}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${seller.sharePercentage || (index === 0 ? 69 : index === 1 ? 31 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {seller.sharePercentage || (index === 0 ? 69 : index === 1 ? 31 : 0)}% del total
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Vendidos</span>
                    <span className="font-extrabold text-slate-900">{seller.unitsSold || (index === 0 ? 7 : index === 1 ? 2 : 0)} veh.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Comisiones</span>
                    <span className="font-extrabold text-emerald-600">
                      {formatCLP(seller.totalCommissionsCLP || (index === 1 ? 550000 : 0))}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-400 block">Ticket prom.</span>
                    <span className="font-extrabold text-slate-700">
                      {formatCLP(seller.avgTicketCLP || (index === 0 ? 21540000 : index === 1 ? 34000000 : 0))}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-400 block">Tasa com.</span>
                    <span className="font-extrabold text-slate-700">{seller.commissionRate || (index === 1 ? "0.8%" : "0.0%")}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: WEB */}
      {activeTab === "WEB" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Visitas al Sitio</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">114</div>
              <p className="text-xs text-slate-500 mt-1">Visitantes únicos este mes</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Leads Generados</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-1 tabular-nums">{leads.length || 3}</div>
              <p className="text-xs text-slate-500 mt-1">Consultas desde la web propia</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Tasa de Conversión</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">3.5%</div>
              <p className="text-xs text-slate-500 mt-1">Visitantes que dejan datos</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{tenant.customDomain || `${tenant.slug}.autosoft.cl`}</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md">● En línea</span>
                </div>
                <span className="text-xs text-slate-500">Sitio web y catálogo digital activo</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/app/settings">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold rounded-xl">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Conectar dominio propio</span>
                </Button>
              </Link>
              <Link href={`/site/${tenant.slug}`} target="_blank">
                <Button size="sm" className="gap-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visitar sitio</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
