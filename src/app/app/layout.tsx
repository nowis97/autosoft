import React from "react";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DataManagementBanner } from "@/components/shared/DataManagementBanner";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        <DataManagementBanner />
        {children}
      </div>
      <MobileBottomNav />
    </div>
  );
}
