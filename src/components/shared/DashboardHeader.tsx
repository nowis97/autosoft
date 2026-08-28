"use client";

import React from "react";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const users = store.getUsers();
  const currentUser = users[0];

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app/inventory/new">
          <Button size="sm" className="gap-1.5 shadow-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Nuevo Auto</span>
          </Button>
        </Link>

        <button
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            {currentUser?.name?.slice(0, 2).toUpperCase() || "RV"}
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-semibold text-slate-900 leading-none">{currentUser?.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Dueño Automotora</div>
          </div>
        </div>
      </div>
    </header>
  );
}
