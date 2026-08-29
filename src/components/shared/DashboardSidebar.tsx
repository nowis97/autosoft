"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Calculator,
  Camera,
  ClipboardCheck,
  Wrench,
  Megaphone,
  Bot,
  TrendingUp,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  ShieldAlert,
  Gavel,
  ShieldCheck,
  Share2,
  Users,
  BadgePercent,
  FileCheck2,
  Globe,
  Settings,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { store } from "@/lib/store";

const navItems = [
  { href: "/app/onboarding", label: "🚀 Asistente de Inicio", icon: Sparkles },
  { href: "/app", label: "Resumen General", icon: LayoutDashboard },
  { href: "/app/inventory", label: "Inventario DMS", icon: Car },
  { href: "/app/inspection", label: "Inspección Técnica", icon: ClipboardCheck },
  { href: "/app/wholesale", label: "Subastas Wholesale B2B", icon: Gavel },
  { href: "/app/consignments", label: "Consignaciones", icon: FileSpreadsheet },
  { href: "/app/service", label: "Taller & Puesta a Punto", icon: Wrench },
  { href: "/app/valuation", label: "Tasación de Retomas", icon: Calculator },
  { href: "/app/studio", label: "Estudio Fotográfico IA", icon: Camera },
  { href: "/app/marketing", label: "Marketing & Redes", icon: Megaphone },
  { href: "/app/copilot", label: "Copiloto de Ventas IA", icon: Bot },
  { href: "/app/aftersales", label: "Post-Venta & Garantías", icon: ShieldCheck },
  { href: "/app/analytics", label: "Analítica & P&L", icon: TrendingUp },
  { href: "/app/invoicing", label: "Facturación SII", icon: Receipt },
  { href: "/app/billing", label: "Planes & Suscripción", icon: CreditCard },
  { href: "/app/audit", label: "Auditoría & Seguridad", icon: ShieldAlert },
  { href: "/app/syndication", label: "Sincronización Multicanal", icon: Share2 },
  { href: "/app/crm", label: "CRM & Leads", icon: Users },
  { href: "/app/financing", label: "Financiamiento F&I", icon: BadgePercent },
  { href: "/app/transfers", label: "Transferencias & Cierre", icon: FileCheck2 },
  { href: "/app/insurance", label: "Seguros Automotrices", icon: ShieldCheck },
  { href: "/app/website", label: "Mi Sitio Web", icon: Globe },
  { href: "/app/settings", label: "Configuración & Equipo", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const tenant = store.getTenant();

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight leading-tight">
                Autosoft 360
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {tenant.name}
              </div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href={`/site/${tenant.slug}`}
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-blue-400 transition-colors"
        >
          <span>Ver mi Catálogo Público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>Autosoft v2.0</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema en línea
          </span>
        </div>
      </div>
    </aside>
  );
}
