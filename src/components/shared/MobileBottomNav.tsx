"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Users,
  Bot,
  Camera,
  Menu,
  X,
  ShieldCheck,
  Calculator,
  Gavel,
  Receipt,
  FileSpreadsheet,
  Settings,
  Globe,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BadgePercent,
  FileCheck2,
} from "lucide-react";
import { store } from "@/lib/store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const tenant = store.getTenant();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs = [
    { href: "/app/inventory", label: "Stock", icon: Car },
    { href: "/app/crm", label: "Leads", icon: Users },
    { href: "/app/copilot", label: "Copiloto", icon: Bot },
    { href: "/app/inspection/yard-mode", label: "Patio", icon: Camera },
  ];

  const secondaryModules = [
    { href: "/app/onboarding", label: "Asistente de Inicio", icon: Sparkles, badge: "4 Pasos" },
    { href: "/app/financing", label: "Financiamiento F&I", icon: BadgePercent, badge: "Pre-Aprobación" },
    { href: "/app/transfers", label: "Notaría Ley 19.799", icon: FileCheck2, badge: "8 min" },
    { href: "/app/invoicing/f29", label: "Asistente F29 SII", icon: Receipt, badge: "Ley 21.420" },
    { href: "/app/wholesale", label: "Subastas Wholesale B2B", icon: Gavel, badge: "1.5% fee" },
    { href: "/app/valuation", label: "Tasación de Retomas", icon: Calculator, badge: "Guía SII" },
    { href: "/app/consignments", label: "Consignaciones", icon: FileSpreadsheet, badge: "" },
    { href: "/app/analytics", label: "Analítica & P&L", icon: TrendingUp, badge: "" },
    { href: "/app/aftersales", label: "Post-Venta & Garantías", icon: ShieldCheck, badge: "6 meses" },
    { href: "/app/website", label: "Mi Showroom Público", icon: Globe, badge: "En Vivo" },
    { href: "/app/settings", label: "Configuración & Equipo", icon: Settings, badge: "" },
  ];

  return (
    <>
      {/* Drawer / Full Screen Menu for More Modules */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col md:hidden animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                360
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Todos los Módulos</h3>
                <p className="text-[11px] text-slate-400">{tenant.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {secondaryModules.map((m) => {
              const Icon = m.icon;
              const isActive = pathname === m.href;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={"flex items-center justify-between p-3.5 rounded-xl border transition-all " + (
                    isActive
                      ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold"
                      : "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {m.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {m.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Showroom Quick Link Footer */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <Link
              href={"/site/" + (tenant.slug || "auto-oriente")}
              target="_blank"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Mi Showroom Público</span>
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Touch Bar (Fixed on Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 md:hidden flex items-center justify-around h-16 px-2 safe-area-pb">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== "/app" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={"flex flex-col items-center justify-center flex-1 h-full py-1 transition-all " + (
                isActive ? "text-blue-400 font-bold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div
                className={"w-9 h-7 rounded-lg flex items-center justify-center transition-all " + (
                  isActive ? "bg-blue-600/20 text-blue-400" : ""
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </Link>
          );
        })}

        {/* More Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={"flex flex-col items-center justify-center flex-1 h-full py-1 transition-all " + (
            isMenuOpen ? "text-blue-400 font-bold" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <div
            className={"w-9 h-7 rounded-lg flex items-center justify-center transition-all " + (
              isMenuOpen ? "bg-blue-600/20 text-blue-400" : ""
            )}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Más</span>
        </button>
      </nav>
    </>
  );
}
