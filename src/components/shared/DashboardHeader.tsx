"use client";

import React from "react";
import Link from "next/link";
import { Bell, Plus, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const users = store.getUsers();
  const currentUser = users[0];
  const tenant = store.getTenant();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-all">
      <div className="min-w-0 flex-1 pr-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{title}</h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>En Vivo</span>
          </span>
        </div>
        {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link href="/app/inventory/new">
          <Button size="sm" className="gap-1.5 shadow-sm font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 sm:px-4 h-8 sm:h-9 rounded-xl transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Nuevo Auto</span>
            <span className="xs:hidden">Auto</span>
          </Button>
        </Link>

        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors relative"
          title="Notificaciones y Avisos de Mercado"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
            {currentUser?.name?.slice(0, 2).toUpperCase() || "AO"}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser?.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{tenant.rut}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
