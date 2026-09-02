"use client";

import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { DocumentTemplateViewer } from "@/components/documents/DocumentTemplateViewer";

export default function DocumentsOverviewPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Generador de Documentos y Contratos Chilenos"
        subtitle="7 plantillas oficiales de notas de venta, compra, consignación y notaría digital"
      />

      <main className="p-6 max-w-7xl w-full">
        <DocumentTemplateViewer />
      </main>
    </div>
  );
}
